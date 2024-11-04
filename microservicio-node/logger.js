const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(), // Log en la consola
        new winston.transports.File({ filename: 'error.log', level: 'error' }), // Log de errores en un archivo
        new winston.transports.File({ filename: 'combined.log' }) // Log de todo en otro archivo
    ]
});

module.exports = logger;
