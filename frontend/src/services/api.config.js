// src/services/api.config.js
// Configuración centralizada de la API - soporta modo "local" (json-server) y "render" (backend Express)

const API_MODE = import.meta.env.VITE_API_MODE || 'local'
const API_URL_LOCAL = import.meta.env.VITE_API_URL_LOCAL || 'http://localhost:3001'
const API_URL_RENDER = import.meta.env.VITE_API_URL_RENDER || 'https://iahistoriabackend.onrender.com/api'

export const isLocalMode = () => API_MODE === 'local'
export const isRenderMode = () => API_MODE === 'render'

export const getBaseURL = () => {
    if (isLocalMode()) {
        return API_URL_LOCAL
    }
    return API_URL_RENDER
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

    // En modo render, agregar token JWT si existe
    if (isRenderMode()) {
        const token = getToken()
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
    }

    const response = await fetch(url, {
        ...options,
        headers,
        // Incluir cookies en modo render (el backend también usa cookies)
        credentials: isRenderMode() ? 'include' : 'same-origin',
    })

    return response
}

console.log(`[API Config] Modo: ${API_MODE} | URL: ${getBaseURL()}`)
