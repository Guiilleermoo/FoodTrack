const express = require('express');
const mongoose = require('mongoose');
const Recomendacion = require('./models/Recomendacion');
const Evolucion = require('./models/Evolucion');
const logger = require('./logger');
const verificarToken = require('./middleware/auth');

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
app.post('/recomendaciones', verificarToken, async (req, res) => {
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
app.get('/recomendaciones/usuario/:usuarioId', verificarToken, async (req, res) => {
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
app.patch('/recomendaciones/:id', verificarToken, async (req, res) => {
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
app.delete('/recomendaciones/:id', verificarToken, async (req, res) => {
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

// Crear una Evolución
app.post('/evoluciones', verificarToken, async (req, res) => {
  const { usuarioId, caloriasConsumidas, alimentoMasConsumido, estadisticas } = req.body;

  if (!req.body) {
    logger.warn('El cuerpo de la solicitud está vacío.');
    return res.status(400).send({ error: 'El cuerpo de la solicitud está vacío.' });
  }

  try {
    const evolucion = new Evolucion({
      usuarioId,
      caloriasConsumidas,
      alimentoMasConsumido,
      estadisticas
    });
    await evolucion.save();
    logger.info(`Evolución creada: ${JSON.stringify(evolucion)}`);
    res.status(201).send(evolucion);
  } catch (error) {
    logger.error('Error al crear la evolución:', error);
    res.status(400).send({ error: 'Error al crear la evolución' });
  }
});

// Leer todas las evoluciones de un usuario (usuarioId)
app.get('/evoluciones/:usuarioId', verificarToken, async (req, res) => {
  const usuarioId = req.params.usuarioId;

  try {
    const evoluciones = await Evolucion.find({ usuarioId });
    if (!evoluciones || evoluciones.length === 0) {
      logger.warn('No se encontraron evoluciones para el usuarioId:', usuarioId);
      return res.status(404).send({ error: 'No se encontraron evoluciones.' });
    }
    logger.info('Evoluciones encontradas para el usuarioId:', usuarioId);
    res.send(evoluciones);
  } catch (error) {
    logger.error('Error al obtener las evoluciones:', error);
    res.status(500).send(error);
  }
});

// Leer una evolución específica por ID
app.get('/evoluciones/:usuarioId/:id', verificarToken, async (req, res) => {
  const { usuarioId, id } = req.params;

  try {
    const evolucion = await Evolucion.findOne({ _id: id, usuarioId });
    if (!evolucion) {
      logger.warn('Evolución no encontrada para el usuarioId y el id:', usuarioId, id);
      return res.status(404).send({ error: 'Evolución no encontrada.' });
    }
    logger.info('Evolución encontrada:', JSON.stringify(evolucion));
    res.send(evolucion);
  } catch (error) {
    logger.error('Error al obtener la evolución por ID:', error);
    res.status(500).send(error);
  }
});

// Actualizar una Evolución
app.patch('/evoluciones/:id', verificarToken, async (req, res) => {
  try {
    const evolucion = await Evolucion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!evolucion) {
      logger.warn('Evolución no encontrada para el id:', req.params.id);
      return res.status(404).send({ error: 'Evolución no encontrada.' });
    }
    logger.info(`Evolución actualizada: ${JSON.stringify(evolucion)}`);
    res.send(evolucion);
  } catch (error) {
    logger.error('Error al actualizar la evolución:', error);
    res.status(400).send(error);
  }
});

// Eliminar una Evolución
app.delete('/evoluciones/:id', verificarToken, async (req, res) => {
  try {
    const evolucion = await Evolucion.findByIdAndDelete(req.params.id);
    if (!evolucion) {
      logger.warn('Evolución no encontrada para el id:', req.params.id);
      return res.status(404).send({ error: 'Evolución no encontrada.' });
    }
    logger.info(`Evolución eliminada: ${JSON.stringify(evolucion)}`);
    res.send(evolucion);
  } catch (error) {
    logger.error('Error al eliminar la evolución:', error);
    res.status(500).send(error);
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  logger.info(`Servidor escuchando en el puerto ${PORT}`);
});