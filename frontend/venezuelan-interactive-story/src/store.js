import { createStore, combineReducers } from 'redux';
import { sidebarReducer } from './reducers/sidebarReducer'; // Asegúrate de tener un reducer para manejar el estado de la barra lateral
import { userReducer } from './reducers/userReducer'; // Asegúrate de tener un reducer para manejar el estado del usuario

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  user: userReducer,
  // Agrega otros reducers aquí si es necesario
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // Habilita Redux DevTools si está disponible
);

export default store;