import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/login.css';
import logo from './../assets/logo.png';
import 'font-awesome/css/font-awesome.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('/flask/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, contrasena: password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('authToken', data.token);

        const userId = data.usuarioId;
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + (24 * 60 * 60 * 1000));
        
        document.cookie = `user_id=${userId}; expires=${expirationDate.toUTCString()}; path=/`;
        navigate('/seguimiento');
      } else {
        alert(data.message || 'Error en la autenticación');
      }
    } catch (error) {
      console.error('Error al intentar autenticar:', error);
      alert('Hubo un error al intentar autenticar. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="FoodTrack Logo" />
      <h1>FoodTrack</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
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

      <div className="social-login-buttons">
        {/* Google Button */}
        <button 
          onClick={() => window.location.href = 'http://localhost:8000/flask/auth/google/login'}
          className="social-btn google-btn"
        >
           <i className="fa fa-google social-icon"></i>
        </button>

        {/* GitHub Button */}
        <button 
          onClick={() => window.location.href = 'http://localhost:8000/flask/auth/github/login'}
          className="social-btn github-btn"
        >
          <i className="fa fa-github social-icon"></i>
        </button>
      </div>

      <p>¿No tienes una cuenta? <a href="/registro">Regístrate</a></p>
    </div>
  );
};

export default Login;
