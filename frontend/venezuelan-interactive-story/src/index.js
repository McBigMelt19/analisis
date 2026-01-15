import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './scss/style.scss'; // Importa los estilos globales
import './scss/examples.scss'; // Importa estilos de ejemplos
import './scss/vendors/simplebar.scss'; // Importa estilos de SimpleBar

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);