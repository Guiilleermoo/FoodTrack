// Conexión a MongoDB

// Schemas MongoDB

// Crear Recomendación Personalizada
// Consultar Recomendaciones Personalziadas de un Usuario

// Crear información de la Evaluación de un Usuario
// Actualizar información de la Evaluación de un Usuario
// Consultar información de la Evaluación de un Usuario

const express = require('express');
const app = express();

app.get('/node', (req, res) => {
  res.send('Hello from Node.js!');
});

app.listen(3000, () => {
  console.log('Express server running on port 3000');
});
