// src/services/users.service.js
// Servicio de usuarios - maneja consultas de usuarios en ambos modos

import { getBaseURL, isLocalMode, apiFetch } from './api.config'

/**
 * Obtiene estudiantes por grado.
 * - Modo local: GET /users?role=student&grade_id=X
 * - Modo render: GET /api/auth/usuarios?rol=estudiante (y filtra por grado en frontend)
 */
export const getStudentsByGrade = async (gradeId) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/users?role=student&grade_id=${gradeId}`)
        if (!response.ok) throw new Error('Error al cargar estudiantes')
        return await response.json()
    }

    // Modo Render
    // Backend endpoint: GET /api/auth/usuarios?rol=estudiante
    // Backend returns: { usuarios: [{ id_usuario, email, rol, persona: { nombre, apellido, estudiante: {...} } }] }
    const response = await apiFetch(`${base}/auth/usuarios?rol=estudiante`)
    if (!response.ok) throw new Error('Error al cargar estudiantes')
    const data = await response.json()
    
    // Adaptar formato y filtrar por grado
    const students = (data.usuarios || [])
        .map(adaptRenderUserToStudent)
        .filter(s => s && s.grade_id == gradeId)
    
    return students
}

/**
 * Obtiene un usuario por ID.
 * - Modo local: GET /users/:id
 * - Modo render: GET /api/auth/usuarios y busca por id
 */
export const getUserById = async (userId) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/users/${userId}`)
        if (!response.ok) throw new Error('Error al cargar usuario')
        return await response.json()
    }

    // Modo Render - obtener perfil propio o buscar en lista
    // Backend endpoint: GET /api/auth/usuarios
    // Backend returns: { usuarios: [...] }
    const response = await apiFetch(`${base}/auth/usuarios`)
    if (!response.ok) throw new Error('Error al cargar usuario')
    const data = await response.json()
    
    const user = (data.usuarios || []).find(u => u.id_usuario == userId)
    if (!user) throw new Error('Usuario no encontrado')
    
    return adaptRenderUserToStudent(user)
}

/**
 * Obtiene todos los profesores.
 * - Modo local: GET /users?role=teacher
 * - Modo render: GET /api/auth/usuarios?rol=profesor
 */
export const getTeachers = async () => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/users?role=teacher`)
        if (!response.ok) throw new Error('Error al cargar profesores')
        return await response.json()
    }

    const response = await apiFetch(`${base}/auth/usuarios?rol=profesor`)
    if (!response.ok) throw new Error('Error al cargar profesores')
    const data = await response.json()

    return (data.usuarios || []).map(adaptRenderUserToStudent)
}

/**
 * Adapta un usuario del backend Render al formato json-server (estudiante/profesor)
 * Backend returns per user: { id_usuario, email, rol, persona: { nombre, apellido, estudiante: {...}, profesor: {...} } }
 */
const adaptRenderUserToStudent = (renderUser) => {
    if (!renderUser) return null

    const persona = renderUser.persona
    const estudiante = persona?.estudiante
    const profesor = persona?.profesor

    const roleMap = {
        estudiante: 'student',
        profesor: 'teacher',
        representante: 'representative',
        admin: 'admin',
    }

    const user = {
        id: renderUser.id_usuario,
        username: renderUser.email,
        email: renderUser.email,
        role: roleMap[renderUser.rol] || renderUser.rol,
        name: persona ? `${persona.nombre} ${persona.apellido}` : renderUser.email,
    }

    if (estudiante) {
        user.grade_id = estudiante.id_grado
        user.learning_style = estudiante.estiloAprendizaje?.nombre || 'Visual'
        user.id_estudiante = estudiante.id_estudiante
    }

    if (profesor) {
        user.id_profesor = profesor.id_profesor
        user.grade_id = profesor.id_grado || null
    }

    return user
}
