// /src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/login.css';
import logo from './../assets/logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();

    // Aquí va la lógica para verificar el login, por ahora, solo simularemos el login
    if (username === 'usuario' && password === 'contraseña') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/seguimiento');  // Redirige al inicio si es exitoso
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="FoodTrack Logo" /> {/* Asegúrate de que la ruta sea correcta */}
      <h1>FoodTrack</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Usuario" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <input type="submit" value="Iniciar Sesión" />
      </form>

      <p>¿No tienes una cuenta? <a href="/registro">Regístrate</a></p>
    </div>
  );
};

export default Login;
