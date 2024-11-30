// /src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Registro from './pages/registro';
import Seguimiento from './pages/seguimiento';
import RegistroAlimentos from './pages/registroAlimentos';
import Recomendaciones from './pages/recomendaciones';
import MainLayout from './layouts/mainLayout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route path="/" element={<MainLayout />}>
          <Route path="seguimiento" element={<Seguimiento />} />
          <Route path="registroAlimentos" element={<RegistroAlimentos />} />
          <Route path="recomendaciones" element={<Recomendaciones />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
