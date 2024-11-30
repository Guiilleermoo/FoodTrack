const mongoose = require('mongoose');

const evolucionSchema = new mongoose.Schema({
  usuarioId: { type: String, required: true },
  fecha: { type: Date, default: Date.now }, 
  caloriasConsumidas: { type: Number, required: true },
  alimentoMasConsumido: { type: String },
  estadisticas: {
    promedioCalorias: { type: Number },
    totalAlimentosConsumidos: { type: Number }
  }
});

const Evolucion = mongoose.model('Evolucion', evolucionSchema);
module.exports = Evolucion;
