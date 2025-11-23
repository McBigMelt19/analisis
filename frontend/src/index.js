import React from 'react';
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import 'core-js'; // Si lo necesitas

import App from './App';
import store from './store';

// Eliminamos la importación del CSS de react-chatbotify aquí

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);