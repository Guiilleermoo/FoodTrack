// /src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Registro from './pages/registro';
import Seguimiento from './pages/seguimiento';
import RegistroAlimentos from './pages/registroAlimentos';
import Recomendaciones from './pages/recomendaciones';
import MainLayout from './layouts/mainLayout';
import Prueba from './pages/prueba';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas sin Header ni Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Redirige automáticamente de / a /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rutas con Header y Footer usando MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route path="seguimiento" element={<Seguimiento />} />
          <Route path="registroAlimentos" element={<RegistroAlimentos />} />
          <Route path="recomendaciones" element={<Recomendaciones />} />
          <Route path="prueba" element={<Prueba />} />
        </Route>
        
         {/* Ruta por defecto para cuando no existe la ruta */}
         <Route path="*" element={<Navigate to="/login" />} /> {/* Redirige a login si la ruta no existe */}
      </Routes>
    </Router>
  );
};

export default App;
