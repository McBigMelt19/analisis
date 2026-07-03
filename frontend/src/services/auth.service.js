// src/services/auth.service.js
// Servicio de autenticación
// Login diferenciado: el backend detecta si es username o email automáticamente.

import { getBaseURL, isLocalMode, isBackendMode, apiFetch, setToken, removeToken } from './api.config'

/**
 * Login del usuario.
 * - Modo local: busca en json-server por username (compatibilidad)
 * - Modo backend: POST /auth/login con identifier (username o email)
 */
export const login = async (loginInput, password) => {
  if (isLocalMode()) {
    return loginLocal(loginInput, password)
  }
  return loginBackend(loginInput, password)
}

// ─── Modo local (json-server) ───────────────────────────────
const loginLocal = async (loginInput, password) => {
  const normalizedLogin = loginInput.trim().toLowerCase()
  const encodedLogin = encodeURIComponent(normalizedLogin)
  const base = getBaseURL()

  // Buscar por username primero
  let response = await fetch(`${base}/users?username=${encodedLogin}`)
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  let users = await response.json()

  if (users.length === 0) {
    // Buscar por email como fallback
    response = await fetch(`${base}/users?email=${encodedLogin}`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    users = await response.json()
  }

  const user = users.find((u) => u.password === password.trim())
  if (user) return { success: true, user }
  return { success: false, message: 'Credenciales incorrectas' }
}

// ─── Modo Backend (Express + JWT) ──────────────────────────
/**
 * Backend endpoint: POST /api/auth/login
 * Envía: { identifier, contrasena }
 *   - identifier con '@' → busca por email_recuperacion (profesores/admins/zona)
 *   - identifier sin '@' → busca por username (estudiantes)
 */
const loginBackend = async (loginInput, password) => {
  const base = getBaseURL()

  const response = await apiFetch(`${base}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      identifier: loginInput.trim(),
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

  if (data.token) {
    setToken(data.token)
  }

  const user = adaptBackendUser(data)
  return { success: true, user }
}

/**
 * Adapta la respuesta del backend al formato del frontend.
 * Backend devuelve: { usuario, persona, entidad, rol, token }
 * Frontend espera: { id, username, name, email, role, ... }
 */
export const adaptBackendUser = (data) => {
  const { usuario, persona, entidad, rol, token } = data

  // Mapear roles del backend al frontend
  const roleMap = {
    estudiante: 'student',
    profesor: 'teacher',
    admin_escuela: 'admin_escuela',
    zona_educativa: 'zona_educativa',
  }

  const user = {
    id: usuario.id,
    username: usuario.username,
    email: usuario.email_recuperacion || null,
    role: roleMap[rol] || rol,
    name: persona ? `${persona.nombre} ${persona.apellido}` : usuario.username,
    token,
  }

  // Datos específicos por rol
  if (rol === 'estudiante' && entidad) {
    user.id_estudiante = entidad.id
    user.escuela_id = entidad.escuela_id
    if (entidad.matriculas && entidad.matriculas.length > 0) {
      user.grade_id = entidad.matriculas[0].grado_id
    }
  }

  if (rol === 'profesor' && entidad) {
    user.id_profesor = entidad.id
    user.escuela_id = entidad.escuela_id
    user.especialidad = entidad.especialidad
  }

  if (rol === 'admin_escuela' && entidad) {
    user.id_admin = entidad.id
    user.escuela_id = entidad.escuela_id
  }

  if (rol === 'zona_educativa' && entidad) {
    user.id_zona = entidad.id
    user.cargo = entidad.cargo
  }

  return user
}

/**
 * Obtener perfil del usuario autenticado
 */
export const getProfile = async () => {
  if (isLocalMode()) return null

  const base = getBaseURL()
  const response = await apiFetch(`${base}/perfil`)

  if (!response.ok) throw new Error('Error al obtener perfil')
  const data = await response.json()

  return adaptBackendUser({ ...data, token: null })
}

/**
 * Logout del usuario
 */
export const logout = async () => {
  if (isBackendMode()) {
    try {
      const base = getBaseURL()
      await apiFetch(`${base}/auth/logout`, { method: 'POST' })
    } catch (error) {
      console.error('Error en logout remoto:', error)
    }
  }
  removeToken()
}
