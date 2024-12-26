// /src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Registro from './components/registro';
import Seguimiento from './components/seguimiento';
import RegistroAlimentos from './components/registroAlimentos';
import Recomendaciones from './components/recomendaciones';
import MainLayout from './layouts/mainLayout';
import SwaggerDocs from './components/swaggerDocs';
import GitHubCallback from './components/githubCallback';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route path="seguimiento" element={<Seguimiento />} />
          <Route path="registroAlimentos" element={<RegistroAlimentos />} />
          <Route path="recomendaciones" element={<Recomendaciones />} />
        </Route>

        <Route path="/auth/github/callback" element={<GitHubCallback />} />
        <Route path="/docs" element={<SwaggerDocs />} />
        <Route path="*" element={<Navigate to="/login" />} />
        
      </Routes>
    </Router>
  );
};

export default App;
