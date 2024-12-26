from flask import Blueprint, request, jsonify, current_app as app, redirect, url_for
from models import Usuario, Alimento, Consumo
from config import db
import jwt
import bcrypt, logging, base64
from datetime import datetime, timedelta
from functools import wraps
from authlib.integrations.flask_client import OAuth
import requests

logging.basicConfig(level=logging.DEBUG)

bp = Blueprint('routes', __name__)

FRONTEND_REDIRECT_URI = 'http://localhost:8000/auth/github/callback'

oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id='1090474168952-nbfv7rjg2ff0mhodmf9tgcrkumsadb61.apps.googleusercontent.com',
    client_secret='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',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    access_token_url='https://accounts.google.com/o/oauth2/token',
    client_kwargs={'scope': 'openid profile email'},
)

github = oauth.register(
    name='github',
    client_id='Ov23lifXawUPQJByUkpn',
    client_secret='149d6a5d873d2164230e8a032c8e777e54aad815',
    access_token_url='https://github.com/login/oauth/access_token',
    authorize_url='https://github.com/login/oauth/authorize',
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'},
)

def hash_password(contrasena):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(contrasena.encode('utf-8'), salt)
    hashed_str = base64.b64encode(hashed).decode('utf-8')
    return hashed_str

def verificar_contrasena(contrasena, hashed_str):
    hashed = base64.b64decode(hashed_str.encode('utf-8'))
    return bcrypt.checkpw(contrasena.encode('utf-8'), hashed)

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        logging.debug("Token recibido: %s", token)
        if not token:
            return jsonify({'message': 'Token de acceso requerido!'}), 403
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"], options={"verify_exp": True})
            logging.debug("Datos decodificados del token: %s", data)
            current_user = data['sub']
            logging.debug("Usuario autenticado: %d", current_user)
        except jwt.ExpiredSignatureError as e:
            logging.error("Token expirado!" + str(e))
            return jsonify({'message': 'Token expirado!'}), 403
        except jwt.InvalidTokenError as e:
            logging.error("Token inválido!" + str(e))
            return jsonify({'message': 'Token inválido!'}), 403
        except Exception as e:
            logging.error("Error al decodificar el token: %s", str(e))
            return jsonify({'message': 'Token inválido!'}), 403

        return f(current_user, *args, **kwargs)

    return decorated_function

@bp.after_request
def apply_coop(response):
    response.headers['Cross-Origin-Opener-Policy'] = 'unsafe-none'
    return response

####################### USUARIO #######################
# Crear usuario
@bp.route('/usuarios', methods=['POST'])
def crearUsuario():
    data = request.get_json()

    logging.debug("Datos recibidos para crear usuario: %s", data)

    if not data or not all(key in data for key in ['nombreUsuario', 'email', 'contrasena', 'edad']):
        logging.error("Faltan datos requeridos para crear usuario")
        return jsonify({"error": "Faltan datos requeridos"}), 400

    nombreUsuario = data.get('nombreUsuario')
    email = data.get('email')
    contrasena = data.get('contrasena')
    edad = data.get('edad')

    contrasenaHashed = hash_password(contrasena)

    usuarioNuevo = Usuario(nombreUsario = nombreUsuario, email = email, contrasena = contrasenaHashed, edad = edad)
    db.session.add(usuarioNuevo)

    try:
        db.session.commit()
        logging.info("Usuario creado exitosamente: %s", usuarioNuevo.to_dict())
    except Exception as e:
        db.session.rollback()
        logging.error("Error al guardar el usuario: %s", str(e))
        return jsonify({"error": str(e)}), 400
    
    return jsonify(usuarioNuevo.to_dict()), 201

# Login: Buscar usuario por gmail y coomprobar contrasena
@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    contrasena = data.get('contrasena')

    if not email or not contrasena:
        logging.warning("Intento de login fallido: falta email o contrasena")
        return jsonify({'message': 'Email y contrasena son requeridos.'}), 400

    logging.info("Intento de login para el email: %s", email)

    usuario = Usuario.query.filter_by(email=email).first()

    if usuario and verificar_contrasena(contrasena, usuario.contrasena):
        logging.info("Login exitoso para el email: %s", email)

        expiration = datetime.utcnow() + timedelta(hours=1)
        token = jwt.encode({
            'sub': str(usuario.id),
            'exp': expiration
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            'message': 'Login exitoso', 
            'token': token,
            'usuarioId': usuario.id
        }), 200
            
    logging.warning("Login fallido para el email: %s", email)
    return jsonify({'message': 'Credenciales invalidas'}), 401

# Login con Google
@bp.route('/auth/google/login')
def google_login():
    logging.info("Iniciando login con Google")
    google_auth_url = f'https://accounts.google.com/o/oauth2/auth?client_id={google.client_id}&redirect_uri=http://localhost:8000/flask/auth/google/callback&response_type=code&scope=openid%20profile%20email'
    logging.info("URL de autorización de Google: %s", google_auth_url)
    
    return redirect(google_auth_url)

@bp.route('/auth/google/callback')
def google_callback():
    code = request.args.get('code')  # Obtenemos el código de autorización de Google
    logging.info("Código de autorización recibido: %s", code)

    if not code:
        logging.error("Código de autorización no recibido.")
        return jsonify({'message': 'Código de autorización requerido.'}), 400

    try:
        logging.info("Solicitando token de acceso a Google")

        token_response = requests.post(
            'https://oauth2.googleapis.com/token',
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
            data={
                'client_id': google.client_id,
                'client_secret': google.client_secret,
                'code': code,
                'grant_type': 'authorization_code',
                'redirect_uri': 'http://localhost:8000/flask/auth/google/callback'  # URI de redirección en tu app
            }
        )
        token_response_data = token_response.json()
        logging.info("Token de acceso recibido de Google: %s", token_response_data)

        access_token = token_response_data.get('access_token')
        if not access_token:
            logging.error("No se recibió el token de acceso de Google")
            return jsonify({'message': 'Error al obtener el token de acceso de Google'}), 400

        # Obtener los datos del usuario usando el token de acceso
        user_response = requests.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        user_data = user_response.json()
        logging.info("Datos del usuario de Google: %s", user_data)

        if 'error' in user_data:
            logging.error("Error al obtener los datos del usuario de Google: %s", user_data['error'])
            return jsonify({'message': 'Error al obtener los datos del usuario de Google'}), 400

        # Obtener el nombre y el correo electrónico del usuario
        nombreUsuario = user_data.get('name')
        email = user_data.get('email')

        if not email:
            email = f"{nombreUsuario.replace(' ', '')}@gmail.com"  # Generar un correo si no se encuentra

        # Buscar al usuario en la base de datos
        usuario = Usuario.query.filter_by(email=email).first()

        if not usuario:
            # Si no existe, crear un nuevo usuario
            usuarioNuevo = Usuario(nombreUsario=nombreUsuario, email=email, contrasena='', edad=0)
            db.session.add(usuarioNuevo)
            try:
                db.session.commit()
                logging.info("Usuario creado exitosamente: %s", usuarioNuevo.to_dict())
            except Exception as e:
                db.session.rollback()
                logging.error("Error al guardar el usuario: %s", str(e))
                return jsonify({"error": str(e)}), 400

            usuario = Usuario.query.filter_by(email=email).first()

        # Generar un JWT para el usuario
        logging.info("Usuario autenticado: %s", usuario.to_dict())
        payload = {
            'sub': usuario.id,
            'exp': datetime.utcnow() + timedelta(hours=1)  # Token con expiración de 1 hora
        }

        jwt_token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
        logging.info("JWT Token generado: %s", jwt_token)

        # Redirigir al frontend con el JWT
        return redirect(f"{FRONTEND_REDIRECT_URI}?token={jwt_token}")

    except Exception as e:
        logging.error("Error en el callback de Google: %s", str(e))
        return jsonify({'message': 'Error en la autenticación con Google'}), 400
    
# Login con Github
@bp.route('/auth/github/login')
def github_login():
    logging.info("Iniciando login con GitHub")
    github_auth_url = f'https://github.com/login/oauth/authorize?client_id={github.client_id}&redirect_uri=http://localhost:8000/flask/auth/github/callback'
    logging.info("URL de autorización de GitHub: %s", github_auth_url)
    
    return redirect(github_auth_url)

@bp.route('/auth/github/callback')
def github_callback():
    code = request.args.get('code')  # Obtenemos el código de autorización
    logging.info("Código de autorización recibido: %s", code)
    if not code:
        logging.error("Código de autorización no recibido.")
        return jsonify({'message': 'Código de autorización requerido.'}), 400

    try:
        logging.info("Solicitando token de acceso a GitHub")
        token_response = requests.post(
            'https://github.com/login/oauth/access_token',
            headers={'Accept': 'application/json'},
            data={
                'client_id': github.client_id,
                'client_secret': github.client_secret,
                'code': code
            }
        )
        logging.info("Token de acceso recibido de GitHub: %s", token_response.json())

        token_data = token_response.json()
        access_token = token_data.get('access_token')
        logging.info("Token de acceso: %s", access_token)

        user_response = requests.get(
            'https://api.github.com/user',
            headers={'Authorization': f'token {access_token}'}
        )
        user_data = user_response.json()
        logging.info("Datos del usuario de GitHub: %s", user_data)

        if not user_data:
            logging.error("No se recibieron datos del usuario de GitHub")
            return jsonify({'message': 'Error en la autenticación con GitHub'}), 400
        
        nombreUsuario = user_data.get('name')
        email = user_data.get('email')

        if not email:
            email = f"{nombreUsuario}@gmail.com"

        usuario = Usuario.query.filter_by(email=email).first()

        if not usuario:
            usuarioNuevo = Usuario(nombreUsario = nombreUsuario, email = email, contrasena = '', edad = 0)
            db.session.add(usuarioNuevo)
            try:
                db.session.commit()
                logging.info("Usuario creado exitosamente: %s", usuarioNuevo.to_dict())
            except Exception as e:
                db.session.rollback()
                logging.error("Error al guardar el usuario: %s", str(e))
                return jsonify({"error": str(e)}), 400
            
            usuario = Usuario.query.filter_by(email=email).first()
        
        logging.info("Usuario autenticado: %s", usuario.to_dict())
        payload = {
            'sub': usuario.id,
            'exp': datetime.utcnow() + timedelta(hours=1)
        }

        jwt_token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
        logging.info("JWT Token: %s", jwt_token)
        return redirect(f"{FRONTEND_REDIRECT_URI}?token={jwt_token}")

    except Exception as e:
        logging.error("Error en el callback de GitHub: %s", str(e))
        return jsonify({'message': 'Error en la autenticación con GitHub'}), 400

# Eliminar usuario
@bp.route('/usuarios/<int:idUsuario>', methods=['DELETE'])
def eliminar_usuario(idUsuario):
    logging.info("Eliminando usuario con ID: %d", idUsuario)

    usuario = Usuario.query.get(idUsuario)
    
    if not usuario:
        logging.warning("Usuario con ID %d no encontrado", idUsuario)
        return jsonify({'message': 'Usuario no encontrado.'}), 404

    logging.info("Usuario encontrado: %s", usuario.to_dict())
    
    db.session.delete(usuario)
    
    try:
        db.session.commit()
        logging.info("Usuario con ID %d eliminado exitosamente", idUsuario)
        return jsonify({'message': 'Usuario eliminado exitosamente.'}), 200
    except Exception as e:
        db.session.rollback()
        logging.error("Error al eliminar el usuario con ID %d: %s", idUsuario, str(e))
        return jsonify({'error': str(e)}), 400

####################### ALIMENTO #######################
# Crear Alimento
@bp.route('/alimentos', methods=['POST'])
@token_required
def crearAlimento():
    data = request.get_json()

    logging.debug("Datos recibidos para crear alimento: %s", data)

    if not data or not all(key in data for key in ['nombreAlimento']):
        logging.error("Faltan datos requeridos para crear alimento")
        return jsonify({"error": "Faltan datos requeridos"}), 400

    nombreAlimento = data.get('nombreAlimento')
    nutriScore = data.get('nutriScore', 'E')

    alimentoNuevo = Alimento(nombreAlimento = nombreAlimento, nutriScore = nutriScore)
    db.session.add(alimentoNuevo)

    try:
        db.session.commit()
        logging.info("Alimento creado exitosamente: %s", alimentoNuevo.to_dict())
    except Exception as e:
        db.session.rollback()
        logging.error("Error al guardar el alimento: %s", str(e))
        return jsonify({"error": str(e)}), 400
    
    return jsonify(alimentoNuevo.to_dict()), 201

# Actualizar Alimento
@bp.route('/alimentos/<int:idAlimento>', methods=['PUT'])
@token_required
def actualizarAlimento(idAlimento):
    data = request.get_json()

    logging.debug("Datos recibidos para actualizar alimento ID %d: %s", idAlimento, data)

    if not data:
        logging.error("No se recibieron datos para actualizar el alimento")
        return jsonify({"error": "No se recibieron datos"}), 400

    alimento = Alimento.query.get(idAlimento)
    if not alimento:
        logging.error("Alimento con ID %d no encontrado", idAlimento)
        return jsonify({"error": "Alimento no encontrado"}), 404

    if 'nombreAlimento' in data:
        alimento.nombreAlimento = data['nombreAlimento']
    if 'nutriScore' in data:
        alimento.nutriScore = data['nutriScore']

    try:
        db.session.commit()
        logging.info("Alimento con ID %d actualizado exitosamente", idAlimento)
    except Exception as e:
        db.session.rollback()
        logging.error("Error al actualizar el alimento: %s", str(e))
        return jsonify({"error": str(e)}), 400

    return jsonify(alimento.to_dict()), 200

# Buscar Alimento por nombreAlimento
@bp.route('/alimentos/buscar/<string:nombreAlimento>', methods=['GET'])
@token_required
def buscarAlimentoPorNombre(nombreAlimento):
    if not nombreAlimento:
        logging.error("No se recibió el nombre del alimento a buscar")
        return jsonify({"error": "Nombre del alimento es requerido"}), 400

    logging.debug("Buscando alimento por nombre: %s", nombreAlimento)

    alimento = Alimento.query.filter_by(nombreAlimento=nombreAlimento).first()

    if not alimento:
        logging.error("No se encontraron un alimento con el nombre: %s", nombreAlimento)
        return jsonify({"error": "No se encontró el alimento"}), 404

    logging.info("Alimento encontrado: %s", alimento.to_dict())
    return jsonify({"alimento": alimento.to_dict()}), 200

# Eliminar Alimento
@bp.route('/alimentos/<int:idAlimento>', methods=['DELETE'])
def eliminarAlimento(idAlimento):
    logging.debug("Solicitando eliminación de alimento ID %d", idAlimento)

    alimento = Alimento.query.get(idAlimento)
    if not alimento:
        logging.error("Alimento con ID %d no encontrado", idAlimento)
        return jsonify({"error": "Alimento no encontrado"}), 404

    logging.info("Alimento encontrado: %s", alimento.to_dict())

    db.session.delete(alimento)

    try:
        db.session.commit()
        logging.info("Alimento con ID %d eliminado exitosamente", idAlimento)
    except Exception as e:
        db.session.rollback()
        logging.error("Error al eliminar el alimento: %s", str(e))
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Alimento eliminado exitosamente"}), 200

####################### CONSUMO #######################
# Crear Registro de Consumo
@bp.route('/consumos', methods=['POST'])
@token_required
def crearRegistroConsumo():
    data = request.get_json()

    logging.debug("Datos recibidos para crear registro de consumo: %s", data)

    if not data or not all(key in data for key in ['alimentoID', 'usuarioID', 'cantidad', 'calorias']):
        logging.error("Faltan datos requeridos para crear el registro de consumo")
        return jsonify({"error": "Faltan datos requeridos"}), 400

    alimentoID = data.get('alimentoID')
    usuarioID = data.get('usuarioID')
    cantidad = data.get('cantidad')
    calorias = data.get('calorias')

    if not isinstance(cantidad, (int, float)):
        logging.error("Cantidad debe ser numérica")
        return jsonify({"error": "Cantidad debe ser numérica"}), 400

    if not isinstance(calorias, (int, float)):
        logging.error("Calorías debe ser numérica")
        return jsonify({"error": "Calorías debe ser numérica"}), 400

    nuevoConsumo = Consumo(alimentoID=alimentoID, usuarioID=usuarioID, cantidad=cantidad, calorias=calorias)
    db.session.add(nuevoConsumo)

    try:
        db.session.commit()
        logging.info("Registro de consumo creado exitosamente: %s", nuevoConsumo.to_dict())
    except Exception as e:
        db.session.rollback()
        logging.error("Error al guardar el registro de consumo: %s", str(e))
        return jsonify({"error": str(e)}), 400

    return jsonify(nuevoConsumo.to_dict()), 201

# Obtener todos los alimentos consumidos por un usuario
@bp.route('/consumos/usuario/<int:usuarioID>', methods=['GET'])
@token_required
def obtenerConsumosPorUsuario(current_user, usuarioID):
    if int(current_user) != usuarioID:
        logging.error("Usuario autenticado %d no coincide con el usuario solicitado %d", int(current_user), usuarioID)
        return jsonify({"error": "No autorizado"}), 403
    
    logging.debug("Solicitando consumos para el usuario con ID %d", usuarioID)

    consumos = Consumo.query.filter_by(usuarioID=usuarioID).all()

    if not consumos:
        logging.error("No se encontraron consumos para el usuario con ID %d", usuarioID)
        return jsonify({"error": "No se encontraron consumos para este usuario"}), 404

    consumos_lista = []
    for consumo in consumos:
        alimento = Alimento.query.get(consumo.alimentoID)
        if alimento:
            consumos_lista.append({
                "alimento": alimento.to_dict(),
                "cantidad": consumo.cantidad,
                "calorias": consumo.calorias,
                "fechaConsumo": consumo.fechaConsumo
            })

    logging.info("Consumos obtenidos para el usuario con ID %d: %s", usuarioID, consumos_lista)

    return jsonify({"consumos": consumos_lista}), 200

# Eliminar Registro de Consumo
@bp.route('/consumos/<int:idConsumo>', methods=['DELETE'])
@token_required
def eliminarRegistroConsumo(idConsumo):
    logging.debug("Solicitando eliminación de registro de consumo ID %d", idConsumo)

    consumo = Consumo.query.get(idConsumo)
    if not consumo:
        logging.error("Registro de consumo con ID %d no encontrado", idConsumo)
        return jsonify({"error": "Registro de consumo no encontrado"}), 404

    logging.info("Consumo encontrado: %s", consumo.to_dict())
    db.session.delete(consumo)

    try:
        db.session.commit()
        logging.info("Registro de consumo con ID %d eliminado exitosamente", idConsumo)
    except Exception as e:
        db.session.rollback()
        logging.error("Error al eliminar el registro de consumo: %s", str(e))
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Registro de consumo eliminado exitosamente"}), 200
