const mongoose = require('mongoose');

const recomendacionSchema = new mongoose.Schema({
  usuarioId: { type: String, required: true },
  alimentosRecomendados: { type: [String], required: true },
  motivo: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

const Recomendacion = mongoose.model('Recomendacion', recomendacionSchema);
module.exports = Recomendacion;