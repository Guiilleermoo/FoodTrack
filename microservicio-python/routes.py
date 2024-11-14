from flask import Blueprint, request, jsonify
from models import Usuario, Alimento, Consumo
from config import db
import bcrypt, logging, base64

logging.basicConfig(level=logging.DEBUG)

bp = Blueprint('routes', __name__)

# Almacenar una contraseña
def hash_password(contrasena):
    # Generar un salt
    salt = bcrypt.gensalt()
    # Hash de la contraseña
    hashed = bcrypt.hashpw(contrasena.encode('utf-8'), salt)
    # Convertir a base64 para almacenar como string
    hashed_str = base64.b64encode(hashed).decode('utf-8')
    return hashed_str

# Verificar una contraseña
def verificar_contrasena(contrasena, hashed_str):
    # Decodificar el hash de base64 a bytes
    hashed = base64.b64decode(hashed_str.encode('utf-8'))
    return bcrypt.checkpw(contrasena.encode('utf-8'), hashed)

####################### USUARIO #######################
# Crear usuario
@bp.route('/usuarios', methods=['POST'])
def crearUsuario():
    data = request.get_json()

    logging.debug("Datos recibidos para crear usuario: %s", data)

     # Verifica que se reciban los datos correctamente
    if not data or not all(key in data for key in ['nombreUsario', 'email', 'contrasena', 'edad']):
        logging.error("Faltan datos requeridos para crear usuario")
        return jsonify({"error": "Faltan datos requeridos"}), 400

    nombreUsario = data.get('nombreUsario')
    email = data.get('email')
    contrasena = data.get('contrasena')
    edad = data.get('edad')

    contrasenaHashed = hash_password(contrasena)

    usuarioNuevo = Usuario(nombreUsario = nombreUsario, email = email, contrasena = contrasenaHashed, edad = edad)
    db.session.add(usuarioNuevo)

    try:
        db.session.commit()
        logging.info("Usuario creado exitosamente: %s", usuarioNuevo.to_dict())
    except Exception as e:
        db.session.rollback()  # Deshacer cambios en caso de error
        logging.error("Error al guardar el usuario: %s", str(e))
        return jsonify({"error": str(e)}), 400  # Devuelve el error al cliente
    
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
        return jsonify({'message': 'Login exitoso'}), 200
    
    logging.warning("Login fallido para el email: %s", email)
    return jsonify({'message': 'Credenciales invalidas'}), 401

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
        db.session.rollback()  # Deshacer cambios en caso de error
        logging.error("Error al eliminar el usuario con ID %d: %s", idUsuario, str(e))
        return jsonify({'error': str(e)}), 400

####################### ALIMENTO #######################
# Crear Alimento
@bp.route('/alimentos', methods=['POST'])
def crearAlimento():
    data = request.get_json()

    logging.debug("Datos recibidos para crear alimento: %s", data)

     # Verifica que se reciban los datos correctamente
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
        db.session.rollback()  # Deshacer cambios en caso de error
        logging.error("Error al guardar el alimento: %s", str(e))
        return jsonify({"error": str(e)}), 400  # Devuelve el error al cliente
    
    return jsonify(alimentoNuevo.to_dict()), 201

# Actualizar Alimento
@bp.route('/alimentos/<int:idAlimento>', methods=['PUT'])
def actualizarAlimento(idAlimento):
    data = request.get_json()

    logging.debug("Datos recibidos para actualizar alimento ID %d: %s", idAlimento, data)

    # Verifica que se reciban los datos correctamente
    if not data:
        logging.error("No se recibieron datos para actualizar el alimento")
        return jsonify({"error": "No se recibieron datos"}), 400

    # Busca el alimento en la base de datos
    alimento = Alimento.query.get(idAlimento)
    if not alimento:
        logging.error("Alimento con ID %d no encontrado", idAlimento)
        return jsonify({"error": "Alimento no encontrado"}), 404

    # Actualiza los campos si están presentes en la solicitud
    if 'nombreAlimento' in data:
        alimento.nombreAlimento = data['nombreAlimento']
    if 'nutriScore' in data:
        alimento.nutriScore = data['nutriScore']

    # Guarda los cambios en la base de datos
    try:
        db.session.commit()
        logging.info("Alimento con ID %d actualizado exitosamente", idAlimento)
    except Exception as e:
        db.session.rollback()  # Deshacer cambios en caso de error
        logging.error("Error al actualizar el alimento: %s", str(e))
        return jsonify({"error": str(e)}), 400  # Devuelve el error al cliente

    return jsonify(alimento.to_dict()), 200

# Eliminar Alimento
@bp.route('/alimentos/<int:idAlimento>', methods=['DELETE'])
def eliminarAlimento(idAlimento):
    logging.debug("Solicitando eliminación de alimento ID %d", idAlimento)

    # Busca el alimento en la base de datos
    alimento = Alimento.query.get(idAlimento)
    if not alimento:
        logging.error("Alimento con ID %d no encontrado", idAlimento)
        return jsonify({"error": "Alimento no encontrado"}), 404

    logging.info("Alimento encontrado: %s", alimento.to_dict())

    # Elimina el alimento de la base de datos
    db.session.delete(alimento)

    try:
        db.session.commit()
        logging.info("Alimento con ID %d eliminado exitosamente", idAlimento)
    except Exception as e:
        db.session.rollback()  # Deshacer cambios en caso de error
        logging.error("Error al eliminar el alimento: %s", str(e))
        return jsonify({"error": str(e)}), 400  # Devuelve el error al cliente

    return jsonify({"message": "Alimento eliminado exitosamente"}), 200

####################### CONSUMO #######################
# Crear Registro de Consumo
@bp.route('/consumos', methods=['POST'])
def crearRegistroConsumo():
    data = request.get_json()

    logging.debug("Datos recibidos para crear registro de consumo: %s", data)

    # Verifica que se reciban los datos correctamente
    if not data or not all(key in data for key in ['alimentoID', 'usuarioID', 'cantidad', 'calorias']):
        logging.error("Faltan datos requeridos para crear el registro de consumo")
        return jsonify({"error": "Faltan datos requeridos"}), 400

    alimentoID = data.get('alimentoID')
    usuarioID = data.get('usuarioID')
    cantidad = data.get('cantidad')
    calorias = data.get('calorias')

    # Validar que cantidad sea numérica
    if not isinstance(cantidad, (int, float)):
        logging.error("Cantidad debe ser numérica")
        return jsonify({"error": "Cantidad debe ser numérica"}), 400

    # Validar que calorías sea numérica
    if not isinstance(calorias, (int, float)):
        logging.error("Calorías debe ser numérica")
        return jsonify({"error": "Calorías debe ser numérica"}), 400

    nuevoConsumo = Consumo(alimentoID=alimentoID, usuarioID=usuarioID, cantidad=cantidad, calorias=calorias)
    db.session.add(nuevoConsumo)

    try:
        db.session.commit()
        logging.info("Registro de consumo creado exitosamente: %s", nuevoConsumo.to_dict())
    except Exception as e:
        db.session.rollback()  # Deshacer cambios en caso de error
        logging.error("Error al guardar el registro de consumo: %s", str(e))
        return jsonify({"error": str(e)}), 400  # Devuelve el error al cliente

    return jsonify(nuevoConsumo.to_dict()), 201

# Eliminar Registro de Consumo
@bp.route('/consumos/<int:idConsumo>', methods=['DELETE'])
def eliminarRegistroConsumo(idConsumo):
    logging.debug("Solicitando eliminación de registro de consumo ID %d", idConsumo)

    # Busca el registro de consumo en la base de datos
    consumo = Consumo.query.get(idConsumo)
    if not consumo:
        logging.error("Registro de consumo con ID %d no encontrado", idConsumo)
        return jsonify({"error": "Registro de consumo no encontrado"}), 404

    logging.info("Consumo encontrado: %s", consumo.to_dict())
    # Elimina el registro de consumo de la base de datos
    db.session.delete(consumo)

    try:
        db.session.commit()
        logging.info("Registro de consumo con ID %d eliminado exitosamente", idConsumo)
    except Exception as e:
        db.session.rollback()  # Deshacer cambios en caso de error
        logging.error("Error al eliminar el registro de consumo: %s", str(e))
        return jsonify({"error": str(e)}), 400  # Devuelve el error al cliente

    return jsonify({"message": "Registro de consumo eliminado exitosamente"}), 200
