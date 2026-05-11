// src/services/api.config.js
// Configuración centralizada de la API - soporta modo "local" (json-server) y "backend" (backend Express real)

const API_MODE = import.meta.env.VITE_API_MODE || 'backend'
const API_URL_LOCAL = import.meta.env.VITE_API_URL_LOCAL || 'http://localhost:3001'
const API_URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND || 'http://localhost:5001/api'

export const isLocalMode = () => API_MODE === 'local'
export const isBackendMode = () => API_MODE === 'backend'

export const getBaseURL = () => {
    if (isLocalMode()) {
        return API_URL_LOCAL
    }
    return API_URL_BACKEND
}

/**
 * Obtiene el token JWT almacenado (solo relevante en modo render)
 */
export const getToken = () => {
    return localStorage.getItem('authToken')
}

/**
 * Almacena el token JWT
 */
export const setToken = (token) => {
    localStorage.setItem('authToken', token)
}

/**
 * Elimina el token JWT
 */
export const removeToken = () => {
    localStorage.removeItem('authToken')
}

/**
 * Helper para hacer fetch con headers de autenticación (modo render).
 * En modo local, hace fetch normal sin headers extra.
 * 
 * @param {string} url - URL completa
 * @param {object} options - Opciones de fetch (method, body, etc.)
 * @returns {Promise<Response>}
 */
export const apiFetch = async (url, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    }

    // En modo backend, agregar token JWT si existe
    if (isBackendMode()) {
        const token = getToken()
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
    }

    const response = await fetch(url, {
        ...options,
        headers,
        // Incluir cookies en modo backend (el backend también usa cookies)
        credentials: isBackendMode() ? 'include' : 'same-origin',
    })

    return response
}

console.log(`[API Config] Modo: ${API_MODE} | URL: ${getBaseURL()}`)
