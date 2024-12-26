import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/header.css'

const Header = () => {
  const navigate = useNavigate();


    const handleLogout = () => {
      localStorage.removeItem('authToken'); 
      navigate('/login');
    };

  return (
    <header>
      <nav>
        <Link to="/seguimiento">Seguimiento</Link>
        <Link to="/registroAlimentos">Registro de Alimentos</Link>
        <Link to="/recomendaciones">Recomendaciones</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
};

export default Header;
