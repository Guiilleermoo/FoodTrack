// /src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/app.css';
import App from './app';
import favicon from './assets/favIcon.ico';

const link = document.createElement('link');
link.rel = 'icon';
link.href = favicon;
document.head.appendChild(link);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
