// src/services/auth.service.js
// Servicio de autenticación - maneja login/logout en ambos modos

import { getBaseURL, isLocalMode, isRenderMode, apiFetch, setToken, removeToken } from './api.config'

/**
 * Login del usuario.
 * - Modo local: busca en json-server por username/email y compara password en texto plano
 * - Modo render: POST /auth/login con email + contrasena (bcrypt en backend)
 */
export const login = async (loginInput, password) => {
    if (isLocalMode()) {
        return loginLocal(loginInput, password)
    }
    return loginRender(loginInput, password)
}

/**
 * Login contra json-server local
 */
const loginLocal = async (loginInput, password) => {
    const normalizedLogin = loginInput.trim().toLowerCase()
    const normalizedPassword = password.trim()
    const encodedLogin = encodeURIComponent(normalizedLogin)
    const base = getBaseURL()

    // Buscar por username
    let response = await fetch(`${base}/users?username=${encodedLogin}`)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    let users = await response.json()
    if (users.length === 0) {
        // Buscar por email
        response = await fetch(`${base}/users?email=${encodedLogin}`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        users = await response.json()
    }

    const user = users.find((u) => u.password === normalizedPassword)

    if (user) {
        return { success: true, user }
    } else {
        return { success: false, message: 'Credenciales incorrectas' }
    }
}

/**
 * Login contra backend Render (Express + JWT)
 */
const loginRender = async (loginInput, password) => {
    const base = getBaseURL()

    const response = await apiFetch(`${base}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
            email: loginInput.trim().toLowerCase(),
            contrasena: password.trim(),
        }),
    })

    const data = await response.json()

    if (!response.ok) {
        return {
            success: false,
            message: data.error || 'Credenciales incorrectas',
        }
    }

    // Guardar token JWT
    if (data.token) {
        setToken(data.token)
    }

    // Adaptar la respuesta del backend al formato que espera el frontend
    const user = adaptRenderUserToLocal(data)
    return { success: true, user }
}

/**
 * Adapta la respuesta del backend Render al formato que espera el frontend (formato json-server)
 * Backend Render devuelve: { usuario, persona, entidad, token }
 * Frontend espera: { id, username, name, email, role, grade_id, learning_style, ... }
 */
export const adaptRenderUserToLocal = (data) => {
    const { usuario, persona, entidad } = data

    // Mapear roles del backend al frontend
    const roleMap = {
        estudiante: 'student',
        profesor: 'teacher',
        representante: 'representative',
        admin: 'admin',
    }

    const user = {
        id: usuario.id_usuario,
        username: usuario.email, // En Render no hay username separado, usamos email
        email: usuario.email,
        role: roleMap[usuario.rol] || usuario.rol,
        name: persona ? `${persona.nombre} ${persona.apellido}` : usuario.email,
    }

    // Si es estudiante, agregar datos específicos
    if (usuario.rol === 'estudiante' && entidad) {
        user.grade_id = entidad.id_grado
        user.learning_style = entidad.estiloAprendizaje?.nombre || 'Visual'
        user.id_estudiante = entidad.id_estudiante
    }

    // Si es profesor, agregar datos específicos
    if (usuario.rol === 'profesor' && entidad) {
        user.id_profesor = entidad.id_profesor
        // El profesor no tiene grade_id directo en el backend Render
        // Podrías necesitar obtenerlo de otra fuente
    }

    return user
}

/**
 * Logout del usuario
 */
export const logout = async () => {
    if (isRenderMode()) {
        try {
            const base = getBaseURL()
            await apiFetch(`${base}/auth/logout`, { method: 'POST' })
        } catch (error) {
            console.error('Error en logout remoto:', error)
        }
    }
    removeToken()
}
