import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import DefaultLayout from './layout/DefaultLayout';
import './scss/style.scss'; // Importa los estilos globales

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <DefaultLayout />
      </Router>
    </Provider>
  );
};

export default App;