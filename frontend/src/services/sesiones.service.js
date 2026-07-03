// src/services/sesiones.service.js
// Servicio de sesiones de clase - consume /api/sesiones/*

import { getBaseURL, isLocalMode, apiFetch } from './api.config'

/**
 * Obtiene todas las sesiones (con filtros opcionales).
 * Backend: GET /api/sesiones?tema_id=X&profesor_id=X&periodo_escolar_id=X
 * Returns: { sesiones: [{ id, tema_id, profesor_id, periodo_escolar_id, fecha, resumen, tema, profesor, periodo }] }
 */
export const getSesiones = async (filters = {}) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const params = new URLSearchParams(filters).toString()
        const response = await fetch(`${base}/sesiones${params ? `?${params}` : ''}`)
        if (!response.ok) throw new Error('Error al cargar sesiones')
        return await response.json()
    }

    const params = new URLSearchParams()
    if (filters.tema_id) params.set('tema_id', filters.tema_id)
    if (filters.profesor_id) params.set('profesor_id', filters.profesor_id)
    if (filters.periodo_escolar_id) params.set('periodo_escolar_id', filters.periodo_escolar_id)

    const queryStr = params.toString()
    const response = await apiFetch(`${base}/sesiones${queryStr ? `?${queryStr}` : ''}`)
    if (!response.ok) throw new Error('Error al cargar sesiones')
    const data = await response.json()
    return data.sesiones || []
}

/**
 * Obtiene una sesión por ID.
 * Backend: GET /api/sesiones/:id
 * Returns: { sesion: { id, tema, profesor, periodo, estudiantes[] } }
 */
export const getSesionById = async (sesionId) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/sesiones/${sesionId}`)
        if (!response.ok) throw new Error('Error al cargar sesión')
        return await response.json()
    }

    const response = await apiFetch(`${base}/sesiones/${sesionId}`)
    if (!response.ok) throw new Error('Error al cargar sesión')
    const data = await response.json()
    return data.sesion || data
}

/**
 * Crea una nueva sesión (solo profesores/zona).
 * Backend: POST /api/sesiones
 * Expects: { tema_id, periodo_escolar_id, fecha, resumen }
 * Returns: { message, sesion }
 */
export const crearSesion = async (sesionData) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/sesiones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sesionData),
        })
        if (!response.ok) throw new Error('Error al crear sesión')
        return await response.json()
    }

    const response = await apiFetch(`${base}/sesiones`, {
        method: 'POST',
        body: JSON.stringify({
            tema_id: sesionData.tema_id,
            periodo_escolar_id: sesionData.periodo_escolar_id,
            fecha: sesionData.fecha,
            resumen: sesionData.resumen || '',
        }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al crear sesión')
    }
    const data = await response.json()
    return data.sesion || data
}

/**
 * Actualiza una sesión existente.
 * Backend: PUT /api/sesiones/:id
 * Returns: { message, sesion }
 */
export const updateSesion = async (sesionId, updateData) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/sesiones/${sesionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
        })
        if (!response.ok) throw new Error('Error al actualizar sesión')
        return await response.json()
    }

    const response = await apiFetch(`${base}/sesiones/${sesionId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al actualizar sesión')
    }
    const data = await response.json()
    return data.sesion || data
}

/**
 * Elimina una sesión.
 * Backend: DELETE /api/sesiones/:id
 */
export const deleteSesion = async (sesionId) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/sesiones/${sesionId}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Error al eliminar sesión')
        return await response.json()
    }

    const response = await apiFetch(`${base}/sesiones/${sesionId}`, { method: 'DELETE' })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al eliminar sesión')
    }
    return await response.json()
}

/**
 * Registra asistencia de estudiantes en una sesión.
 * Backend: POST /api/sesiones/:id/asistencia
 * Expects: { asistencias: [{ estudiante_id, asistencia, observacion_clase }] }
 */
export const registrarAsistencia = async (sesionId, asistencias) => {
    const base = getBaseURL()

    if (isLocalMode()) return { message: 'No disponible en modo local' }

    const response = await apiFetch(`${base}/sesiones/${sesionId}/asistencia`, {
        method: 'POST',
        body: JSON.stringify({ asistencias }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al registrar asistencia')
    }
    return await response.json()
}
