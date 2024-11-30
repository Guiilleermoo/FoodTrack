from flask import Blueprint, request, jsonify
from models import Usuario, Alimento, Consumo
from config import db
import bcrypt, logging, base64

logging.basicConfig(level=logging.DEBUG)

bp = Blueprint('routes', __name__)

def hash_password(contrasena):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(contrasena.encode('utf-8'), salt)
    hashed_str = base64.b64encode(hashed).decode('utf-8')
    return hashed_str

def verificar_contrasena(contrasena, hashed_str):
    hashed = base64.b64decode(hashed_str.encode('utf-8'))
    return bcrypt.checkpw(contrasena.encode('utf-8'), hashed)

####################### USUARIO #######################
# Crear usuario
@bp.route('/usuarios', methods=['POST'])
def crearUsuario():
    data = request.get_json()

    logging.debug("Datos recibidos para crear usuario: %s", data)

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
        return jsonify({'message': 'Login exitoso', 'usuarioId': usuario.id}), 200
    
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
        db.session.rollback()
        logging.error("Error al eliminar el usuario con ID %d: %s", idUsuario, str(e))
        return jsonify({'error': str(e)}), 400

####################### ALIMENTO #######################
# Crear Alimento
@bp.route('/alimentos', methods=['POST'])
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
def obtenerConsumosPorUsuario(usuarioID):
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
