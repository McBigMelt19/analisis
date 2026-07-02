// src/services/adminEscuela.service.js
// Servicio de Admin Escuela (Secretario/Subdirector) - consume /api/admin-escuela/*

import { getBaseURL, isLocalMode, apiFetch } from './api.config'

// ═══════════════════════════════════════════════
// PROFESORES
// ═══════════════════════════════════════════════

/**
 * Obtiene profesores de la escuela del admin autenticado.
 * Backend: GET /api/admin-escuela/profesores
 * Returns: { profesores: [{ id, usuario, escuela }] }
 */
export const getProfesores = async () => {
    const base = getBaseURL()
    if (isLocalMode()) return []

    const response = await apiFetch(`${base}/admin-escuela/profesores`)
    if (!response.ok) throw new Error('Error al cargar profesores')
    const data = await response.json()
    return data.profesores || []
}

/**
 * Asigna un profesor a un grado en un período.
 * Backend: POST /api/admin-escuela/asignar-profesor
 * Expects: { profesor_id, grado_id, periodo_escolar_id }
 */
export const asignarProfesorGrado = async (profesorId, gradoId, periodoEscolarId) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/admin-escuela/asignar-profesor`, {
        method: 'POST',
        body: JSON.stringify({
            profesor_id: profesorId,
            grado_id: gradoId,
            periodo_escolar_id: periodoEscolarId,
        }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al asignar profesor al grado')
    }
    return await response.json()
}

/**
 * Registra un nuevo profesor (crea usuario + persona + profesor).
 * Backend: POST /api/admin-escuela/registrar-profesor
 * Expects: { username, contrasena, nombre, apellido, email_recuperacion, ci, telefono, especialidad }
 */
export const registrarProfesor = async (profesorData) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/admin-escuela/registrar-profesor`, {
        method: 'POST',
        body: JSON.stringify(profesorData),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al registrar profesor')
    }
    return await response.json()
}

/**
 * Remueve un profesor de un grado.
 * Backend: DELETE /api/admin-escuela/remover-profesor
 * Expects body: { profesor_id, grado_id, periodo_escolar_id }
 */
export const removerProfesorGrado = async (profesorId, gradoId, periodoEscolarId) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/admin-escuela/remover-profesor`, {
        method: 'DELETE',
        body: JSON.stringify({
            profesor_id: profesorId,
            grado_id: gradoId,
            periodo_escolar_id: periodoEscolarId,
        }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al remover profesor del grado')
    }
    return await response.json()
}

// ═══════════════════════════════════════════════
// CURRÍCULO (solo lectura)
// ═══════════════════════════════════════════════

/**
 * Obtiene temas del currículo (vista previa, solo lectura).
 * Backend: GET /api/admin-escuela/curriculo?grado_id=X
 * Returns: { temas: [...], nota: '...' }
 */
export const getCurriculo = async (gradoId = null) => {
    const base = getBaseURL()
    if (isLocalMode()) return []

    const params = gradoId ? `?grado_id=${gradoId}` : ''
    const response = await apiFetch(`${base}/admin-escuela/curriculo${params}`)
    if (!response.ok) throw new Error('Error al cargar currículo')
    const data = await response.json()
    return data.temas || []
}

// ═══════════════════════════════════════════════
// ESTUDIANTES
// ═══════════════════════════════════════════════

/**
 * Obtiene estudiantes de la escuela.
 * Backend: GET /api/admin-escuela/estudiantes
 * Returns: { estudiantes: [{ id, usuario, representante, matriculas }] }
 */
export const getEstudiantes = async () => {
    const base = getBaseURL()
    if (isLocalMode()) return []

    const response = await apiFetch(`${base}/admin-escuela/estudiantes`)
    if (!response.ok) throw new Error('Error al cargar estudiantes')
    const data = await response.json()
    return data.estudiantes || []
}

/**
 * Registra un nuevo estudiante (crea usuario + persona + representante + estudiante + matrícula).
 * Backend: POST /api/admin-escuela/registrar-estudiante
 * Expects: { username, contrasena, nombre, apellido, ci, telefono,
 *            representante_nombre, representante_email, representante_telefono,
 *            relacion_representante, grado_id, periodo_escolar_id }
 */
export const registrarEstudiante = async (estudianteData) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/admin-escuela/registrar-estudiante`, {
        method: 'POST',
        body: JSON.stringify(estudianteData),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al registrar estudiante')
    }
    return await response.json()
}

// ═══════════════════════════════════════════════
// AUDITORÍA Y ESTADÍSTICAS
// ═══════════════════════════════════════════════

/**
 * Obtiene resumen de notas por profesor.
 * Backend: GET /api/admin-escuela/notas-profesores?profesor_id=X&periodo_escolar_id=X
 * Returns: { resumen_profesores: [{ profesor_id, nombre, total_sesiones, promedio_notas }] }
 */
export const getNotasPorProfesor = async (profesorId = null, periodoEscolarId = null) => {
    const base = getBaseURL()
    if (isLocalMode()) return { resumen_profesores: [] }

    const params = new URLSearchParams()
    if (profesorId) params.set('profesor_id', profesorId)
    if (periodoEscolarId) params.set('periodo_escolar_id', periodoEscolarId)

    const queryStr = params.toString()
    const response = await apiFetch(`${base}/admin-escuela/notas-profesores${queryStr ? `?${queryStr}` : ''}`)
    if (!response.ok) throw new Error('Error al cargar notas por profesor')
    return await response.json()
}

/**
 * Obtiene desempeño de estudiantes de la escuela.
 * Backend: GET /api/admin-escuela/desempeno-estudiantes?grado_id=X&periodo_escolar_id=X
 * Returns: { total, estudiantes: [{ estudiante_id, nombre, promedio }] }
 */
export const getDesempenoEstudiantes = async (filters = {}) => {
    const base = getBaseURL()
    if (isLocalMode()) return { total: 0, estudiantes: [] }

    const params = new URLSearchParams()
    if (filters.grado_id) params.set('grado_id', filters.grado_id)
    if (filters.periodo_escolar_id) params.set('periodo_escolar_id', filters.periodo_escolar_id)

    const queryStr = params.toString()
    const response = await apiFetch(`${base}/admin-escuela/desempeno-estudiantes${queryStr ? `?${queryStr}` : ''}`)
    if (!response.ok) throw new Error('Error al cargar desempeño')
    return await response.json()
}

/**
 * Obtiene logs de auditoría de la escuela.
 * Backend: GET /api/admin-escuela/auditoria?tabla=X&accion=X&desde=X&hasta=X&page=X&limit=X
 * Returns: { total, page, totalPages, logs: [...] }
 */
export const getAuditoria = async (filters = {}) => {
    const base = getBaseURL()
    if (isLocalMode()) return { total: 0, page: 1, totalPages: 0, logs: [] }

    const params = new URLSearchParams()
    if (filters.tabla) params.set('tabla', filters.tabla)
    if (filters.accion) params.set('accion', filters.accion)
    if (filters.desde) params.set('desde', filters.desde)
    if (filters.hasta) params.set('hasta', filters.hasta)
    if (filters.page) params.set('page', filters.page)
    if (filters.limit) params.set('limit', filters.limit)

    const queryStr = params.toString()
    const response = await apiFetch(`${base}/admin-escuela/auditoria${queryStr ? `?${queryStr}` : ''}`)
    if (!response.ok) throw new Error('Error al cargar auditoría')
    return await response.json()
}
