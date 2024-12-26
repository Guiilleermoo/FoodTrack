import React, { useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerDocs = () => {
  const [serverUrl, setServerUrl] = useState('/openapiFlask.yaml');

  const handleServerChange = (event) => {
    setServerUrl(event.target.value);
  };

  return (
    <div style={styles.container}>
      <div style={styles.selectContainer}>
        <label htmlFor="server-select" style={styles.label}>
          Seleccionar Servidor: 
        </label>
        <select 
          id="server-select" 
          onChange={handleServerChange} 
          style={styles.select}
        >
          <option value="/openapiFlask.yaml">Microservicio de Flask</option>
          <option value="/openapiNode.yaml">Microservicio de Node.js</option>
        </select>
      </div>

      <div style={styles.swaggerContainer}>
        <SwaggerUI url={serverUrl} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    padding: '20px',
  },
  selectContainer: {
    marginBottom: '20px',
    marginTop: '40px',
  },
  label: {
    fontSize: '18px',
    marginRight: '10px',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  swaggerContainer: {
    width: '100%',
    height: 'calc(100vh - 100px)',
    overflow: 'auto',
  },
};

export default SwaggerDocs;
