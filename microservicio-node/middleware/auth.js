const jwt = require('jsonwebtoken');
const logger = require('../logger');

const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send({ error: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.identity;
    next();
  } catch (error) {
    logger.error('Error al verificar el token:', error);
    res.status(401).send({ error: 'Token no válido o expirado.' });
  }
};

module.exports = verificarToken;
