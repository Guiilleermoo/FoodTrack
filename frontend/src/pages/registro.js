// /src/pages/registro.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/registro.css';

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.age) {
      setError('Todos los campos son requeridos.');
      return;
    }

    const dataToSend = {
      nombreUsario: formData.username,
      email: formData.email,
      contrasena: formData.password,
      edad: formData.age,
    };

    try {
      const response = await fetch('/flask/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Te has registrado exitosamente. ¡Bienvenido!');
        navigate('/login');
      } else {
        setError(data.error || 'Error al registrar el usuario.');
      }
    } catch (error) {
      setError('Hubo un error al intentar registrar al usuario. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="register-container">
      <h1>Registro en FoodTrack</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre de Usuario"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          placeholder="Correo Electrónico"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          placeholder="Edad"
          name="age"
          value={formData.age}
          onChange={handleChange}
          min="10"
          required
        />

        <input type="submit" value="Registrarse" />
      </form>

      <p>
        ¿Ya tienes una cuenta?{' '}
        <a href="/login" style={{ color: '#16a085' }}>
          Inicia sesión
        </a>
      </p>
    </div>
  );
};

export default Registro;
