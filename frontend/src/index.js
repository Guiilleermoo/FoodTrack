import React, { useState } from 'react';

// Componente de Login
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Comprobar con microservicio-python
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>FoodTrack</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Usuario"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="submit"
          value="Iniciar Sesión"
          style={styles.submitButton}
        />
      </form>
      <p style={styles.paragraph}>
        ¿No tienes una cuenta? <a href="registro.html" style={styles.link}>Regístrate</a>
      </p>
    </div>
  );
};

const styles = {
  container: {
    width: '400px',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    margin: '0 auto',
  },
  logo: {
    width: '100px',
    marginBottom: '20px',
  },
  title: {
    color: '#34495e',
    fontSize: '2.5em',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '15px',
    margin: '10px 0 20px 0',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#f2f2f2',
    fontSize: '1.2em',
  },
  submitButton: {
    backgroundColor: '#16a085',
    color: 'white',
    padding: '15px',
    width: '100%',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.2em',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  paragraph: {
    marginTop: '20px',
    fontSize: '1em',
  },
  link: {
    color: '#16a085',
    textDecoration: 'none',
  },
};

export default Login;
