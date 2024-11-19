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

    // Validar que todos los campos estén llenos (aunque ya tienes "required" en los inputs)
    if (!formData.username || !formData.email || !formData.password || !formData.age) {
      setError('Todos los campos son requeridos.');
      return;
    }

    // Preparar los datos a enviar
    const dataToSend = {
      nombreUsario: formData.username,
      email: formData.email,
      contrasena: formData.password,
      edad: formData.age,
    };

    try {
      // Enviar los datos al backend usando fetch
      const response = await fetch('/flask/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), // Enviar los datos como JSON
      });

      const data = await response.json(); // Convertir la respuesta a JSON

      if (response.ok) {
        // Si el registro fue exitoso
        alert('Te has registrado exitosamente. ¡Bienvenido!');
        navigate('/login'); // Redirigir al login
      } else {
        // Si hubo algún error (ej. email ya registrado)
        setError(data.error || 'Error al registrar el usuario.');
      }
    } catch (error) {
      // En caso de error en la solicitud (por ejemplo, problema con la conexión)
      setError('Hubo un error al intentar registrar al usuario. Inténtalo de nuevo.');
    }
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
