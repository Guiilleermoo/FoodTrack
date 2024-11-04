const express = require('express');
const mongoose = require('mongoose');
const Recomendacion = require('./models/Recomendacion');
const Evolucion = require('./models/Evolucion');
const logger = require('./logger');

const app = express();
app.use(express.json());

const PORT = 3000;

// Obtener la URI de conexión de la variable de entorno
const mongoURI = process.env.MONGO_URI;

// Conectar a MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    logger.info('Conectado a MongoDB');
  })
  .catch(err => {
    logger.error('Error de conexión a MongoDB:', err);
  });

/**********************RECOMENDACION********************/
// Crear una Recomendacion
app.post('/recomendaciones', async (req, res) => {
  const { usuarioId, alimentosRecomendados, motivo } = req.body;

  if (!req.body) {
    logger.warn('El cuerpo de la solicitud está vacío.');
    return res.status(400).send({ error: 'El cuerpo de la solicitud está vacío.' });
  }

  try {
    const recomendacion = new Recomendacion({
      usuarioId,
      alimentosRecomendados,
      motivo
    });
    await recomendacion.save();
    logger.info('Recomendación creada: ${JSON.stringify(recomendacion)}');
    res.status(201).send(recomendacion);
  } catch (error) {
    logger.error('Error al crear la recomendación:', error);
    res.status(400).send({ error: 'Error al crear la recomendación' });
  }
});

// Leer todas las recomendaciones de un usuario (usuarioId)
app.get('/recomendaciones/:usuarioId', async (req, res) => {
  const usuarioId = req.params.usuarioId;

  try {
    const recomendaciones = await Recomendacion.find({ usuarioId });
    if (!recomendaciones || recomendaciones.length === 0) {
      logger.warn('No se encontraron recomendaciones para el usuarioId:', usuarioId);
      return res.status(404).send({ error: 'No se encontraron recomendaciones.' });
    }
    logger.info('Recomendaciones encontradas para el usuarioId:', usuarioId);
    res.send(recomendaciones);
  } catch (error) {
    logger.error('Error al obtener las recomendaciones:', error);
    res.status(500).send(error);
  }
});

// Actualizar una Recomendacion
app.patch('/recomendaciones/:id', async (req, res) => {
  try {
    const recomendacion = await Recomendacion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!recomendacion) {
      logger.warn('Recomendación no encontrada para el recomendacionId:', req.params.id);
      return res.status(404).send({ error: 'Recomendación no encontrada.' });
    }
    logger.info('Recomendación actualizada: ${JSON.stringify(recomendacion)}');
    res.send(recomendacion);
  } catch (error) {
    logger.error('Error al actualizar la recomendación:', error);
    res.status(400).send(error);
  }
});

// Eliminar una Recomendacion 
app.delete('/recomendaciones/:id', async (req, res) => {
  try {
    const recomendacion = await Recomendacion.findByIdAndDelete(req.params.id);
    if (!recomendacion) {
      logger.warn('Recomendación no encontrada para el ID:', req.params.id);
      return res.status(404).send({ error: 'Recomendación no encontrada.' });
    }
    logger.info('Recomendación eliminada: ', JSON.stringify(recomendacion));
    res.send(recomendacion);
  } catch (error) {
    logger.error('Error al eliminar la recomendación:', error);
    res.status(500).send(error);
  }
});


/**********************EVOLUCION********************/

// Iniciar el servidor
app.listen(PORT, () => {
  logger.info(`Servidor escuchando en el puerto ${PORT}`);
});
