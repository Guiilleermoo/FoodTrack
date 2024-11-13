import React from 'react';
import './app.css';  // Asegúrate de tener este archivo .css

import reactImg from '../assets/react.png'
import dockerImg from '../assets/docker.png'

function AppComponent() {
  return (
    <div className='container'>
      <img src={reactImg} alt='reactImg' className='reactImg'/>
      <h1 className='title'>I LOVE REACT AND DOCKER</h1>
      <img src={dockerImg} alt='dockerImg' className='dockerImg'/>
    </div>
  );
}

export default AppComponent;  // Exportar el componente para usarlo en index.js
