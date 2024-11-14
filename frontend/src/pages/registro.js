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
    gender: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario al backend
    // Por ejemplo, usando fetch o axios:
    // fetch('/register', { method: 'POST', body: JSON.stringify(formData) });
    // Simulación de registro exitoso
    alert('Te has registrado exitosamente. ¡Bienvenido!');

    // Redirigir al login
    navigate('/login');
  };

  return (
    <div className="register-container">
      <h1>Registro en FoodTrack</h1>
      <form onSubmit={handleSubmit}>
        {/* Nombre de Usuario */}
        <input
          type="text"
          placeholder="Nombre de Usuario"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        {/* Correo Electrónico */}
        <input
          type="email"
          placeholder="Correo Electrónico"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Edad */}
        <input
          type="number"
          placeholder="Edad"
          name="age"
          value={formData.age}
          onChange={handleChange}
          min="10"
          required
        />

        {/* Género */}
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="" disabled selected>
            Selecciona tu género
          </option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
        </select>

        {/* Botón de Enviar */}
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
