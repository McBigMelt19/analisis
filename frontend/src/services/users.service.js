// src/services/users.service.js
// Servicio de usuarios - maneja consultas de usuarios en ambos modos

import { getBaseURL, isLocalMode, apiFetch } from './api.config'

/**
 * Obtiene estudiantes por grado.
 * - Modo local: GET /users?role=student&grade_id=X
 * - Modo backend: GET /api/profesor/estudiantes?grado_id=X
 *
 * Respuesta del backend:
 *   { estudiantes: [{ id, id_estudiante, username, email, name, role, grade_id, grade_name, estado }] }
 */
export const getStudentsByGrade = async (gradeId) => {
  const base = getBaseURL()

  if (isLocalMode()) {
    const response = await fetch(`${base}/users?role=student&grade_id=${gradeId}`)
    if (!response.ok) throw new Error('Error al cargar estudiantes')
    return await response.json()
  }

  // Modo Backend — ruta específica para profesores/admins
  const params = gradeId ? `?grado_id=${gradeId}` : ''
  const response = await apiFetch(`${base}/profesor/estudiantes${params}`)
  if (!response.ok) throw new Error('Error al cargar estudiantes')
  const data = await response.json()

  return data.estudiantes || []
}

/**
 * Obtiene todos los estudiantes de la escuela (sin filtro de grado).
 * - Modo local: GET /users?role=student
 * - Modo backend: GET /api/profesor/estudiantes
 */
export const getAllStudents = async () => {
  const base = getBaseURL()

  if (isLocalMode()) {
    const response = await fetch(`${base}/users?role=student`)
    if (!response.ok) throw new Error('Error al cargar estudiantes')
    return await response.json()
  }

  const response = await apiFetch(`${base}/profesor/estudiantes`)
  if (!response.ok) throw new Error('Error al cargar estudiantes')
  const data = await response.json()

  return data.estudiantes || []
}

/**
 * Obtiene un usuario por ID.
 * - Modo local: GET /users/:id
 * - Modo backend: GET /api/profesor/estudiantes y busca por id
 */
export const getUserById = async (userId) => {
  const base = getBaseURL()

  if (isLocalMode()) {
    const response = await fetch(`${base}/users/${userId}`)
    if (!response.ok) throw new Error('Error al cargar usuario')
    return await response.json()
  }

  // Buscar entre todos los estudiantes de la escuela
  const response = await apiFetch(`${base}/profesor/estudiantes`)
  if (!response.ok) throw new Error('Error al cargar usuario')
  const data = await response.json()

  const user = (data.estudiantes || []).find(u => u.id == userId)
  if (!user) throw new Error('Usuario no encontrado')

  return user
}

/**
 * Obtiene todos los profesores.
 * - Modo local: GET /users?role=teacher
 * - Modo backend: GET /api/admin-escuela/profesores
 */
export const getTeachers = async () => {
  const base = getBaseURL()

  if (isLocalMode()) {
    const response = await fetch(`${base}/users?role=teacher`)
    if (!response.ok) throw new Error('Error al cargar profesores')
    return await response.json()
  }

  const response = await apiFetch(`${base}/admin-escuela/profesores`)
  if (!response.ok) throw new Error('Error al cargar profesores')
  const data = await response.json()

  // Adaptar formato del backend al frontend
  return (data.profesores || []).map(prof => ({
    id: prof.usuario?.id,
    id_profesor: prof.id,
    username: prof.usuario?.username,
    email: prof.usuario?.email_recuperacion || null,
    name: prof.usuario?.persona
      ? `${prof.usuario.persona.nombre} ${prof.usuario.persona.apellido}`
      : prof.usuario?.username,
    role: 'teacher',
    especialidad: prof.especialidad,
    escuela_id: prof.escuela_id,
  }))
}
