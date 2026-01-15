// frontend/src/config/auth.js

/**
 * Guarda el rol del usuario en localStorage.
 * @param {string} role - 'student' o 'teacher'
 */
export const saveUserRole = (role) => {
  localStorage.setItem('userRole', role);
};

/**
 * Obtiene el rol del usuario de localStorage.
 * @returns {string|null} - El rol o null si no está logueado.
 */
export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

/**
 * Cierra la sesión y limpia el rol.
 */
export const logout = () => {
  localStorage.removeItem('userRole');
};