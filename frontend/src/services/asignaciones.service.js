// src/services/asignaciones.service.js
// Servicio de asignaciones y entregas - consume /api/asignaciones/* y /api/mis-entregas

import { getBaseURL, isLocalMode, apiFetch } from './api.config'

// ═══════════════════════════════════════════════
// ASIGNACIONES (CRUD)
// ═══════════════════════════════════════════════

/**
 * Obtiene todas las asignaciones (con filtros opcionales).
 * Backend: GET /api/asignaciones?sesion_id=X&tipo=X
 * Returns: { asignaciones: [{ id, sesion_id, tipo, titulo, descripcion, ponderacion, fecha_limite, sesion }] }
 */
export const getAsignaciones = async (filters = {}) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const params = new URLSearchParams(filters).toString()
        const response = await fetch(`${base}/asignaciones${params ? `?${params}` : ''}`)
        if (!response.ok) throw new Error('Error al cargar asignaciones')
        return await response.json()
    }

    const params = new URLSearchParams()
    if (filters.sesion_id) params.set('sesion_id', filters.sesion_id)
    if (filters.tipo) params.set('tipo', filters.tipo)

    const queryStr = params.toString()
    const response = await apiFetch(`${base}/asignaciones${queryStr ? `?${queryStr}` : ''}`)
    if (!response.ok) throw new Error('Error al cargar asignaciones')
    const data = await response.json()
    return data.asignaciones || []
}

/**
 * Obtiene una asignación por ID (incluye entregas).
 * Backend: GET /api/asignaciones/:id
 * Returns: { asignacion: { id, sesion, entregas[] } }
 */
export const getAsignacionById = async (asignacionId) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/asignaciones/${asignacionId}`)
        if (!response.ok) throw new Error('Error al cargar asignación')
        return await response.json()
    }

    const response = await apiFetch(`${base}/asignaciones/${asignacionId}`)
    if (!response.ok) throw new Error('Error al cargar asignación')
    const data = await response.json()
    return data.asignacion || data
}

/**
 * Crea una nueva asignación (solo profesores/zona).
 * Backend: POST /api/asignaciones
 * Expects: { sesion_id, tipo, titulo, descripcion, ponderacion, fecha_limite }
 * Returns: { message, asignacion }
 */
export const crearAsignacion = async (asignacionData) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/asignaciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(asignacionData),
        })
        if (!response.ok) throw new Error('Error al crear asignación')
        return await response.json()
    }

    const response = await apiFetch(`${base}/asignaciones`, {
        method: 'POST',
        body: JSON.stringify({
            sesion_id: asignacionData.sesion_id,
            tipo: asignacionData.tipo,
            titulo: asignacionData.titulo,
            descripcion: asignacionData.descripcion || '',
            ponderacion: asignacionData.ponderacion || 0,
            fecha_limite: asignacionData.fecha_limite,
        }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al crear asignación')
    }
    const data = await response.json()
    return data.asignacion || data
}

/**
 * Actualiza una asignación existente.
 * Backend: PUT /api/asignaciones/:id
 */
export const updateAsignacion = async (asignacionId, updateData) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/asignaciones/${asignacionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
        })
        if (!response.ok) throw new Error('Error al actualizar asignación')
        return await response.json()
    }

    const response = await apiFetch(`${base}/asignaciones/${asignacionId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al actualizar asignación')
    }
    const data = await response.json()
    return data.asignacion || data
}

/**
 * Elimina una asignación.
 * Backend: DELETE /api/asignaciones/:id
 */
export const deleteAsignacion = async (asignacionId) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/asignaciones/${asignacionId}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Error al eliminar asignación')
        return await response.json()
    }

    const response = await apiFetch(`${base}/asignaciones/${asignacionId}`, { method: 'DELETE' })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al eliminar asignación')
    }
    return await response.json()
}

// ═══════════════════════════════════════════════
// ENTREGAS (Estudiantes entregan, Profesores califican)
// ═══════════════════════════════════════════════

/**
 * Entrega una asignación (solo estudiantes).
 * Backend: POST /api/asignaciones/:id/entregar
 * Expects: { respuesta, archivo_url }
 * Returns: { message, entrega }
 */
export const entregarAsignacion = async (asignacionId, entregaData) => {
    const base = getBaseURL()

    if (isLocalMode()) return { message: 'No disponible en modo local' }

    const response = await apiFetch(`${base}/asignaciones/${asignacionId}/entregar`, {
        method: 'POST',
        body: JSON.stringify({
            respuesta: entregaData.respuesta || null,
            archivo_url: entregaData.archivo_url || null,
        }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al entregar asignación')
    }
    const data = await response.json()
    return data.entrega || data
}

/**
 * Obtiene entregas de una asignación (solo profesores/admin).
 * Backend: GET /api/asignaciones/:id/entregas
 * Returns: { entregas: [{ id, estudiante_id, respuesta, calificacion, estudiante }] }
 */
export const getEntregasPorAsignacion = async (asignacionId) => {
    const base = getBaseURL()

    if (isLocalMode()) return []

    const response = await apiFetch(`${base}/asignaciones/${asignacionId}/entregas`)
    if (!response.ok) throw new Error('Error al cargar entregas')
    const data = await response.json()
    return data.entregas || []
}

/**
 * Califica una entrega (solo profesores/admin).
 * Backend: POST /api/asignaciones/calificar
 * Expects: { asignacion_id, estudiante_id, calificacion (0-20), comentario_evaluacion }
 * Returns: { message, entrega }
 */
export const calificarEntrega = async (calificacionData) => {
    const base = getBaseURL()

    if (isLocalMode()) return { message: 'No disponible en modo local' }

    const response = await apiFetch(`${base}/asignaciones/calificar`, {
        method: 'POST',
        body: JSON.stringify({
            asignacion_id: calificacionData.asignacion_id,
            estudiante_id: calificacionData.estudiante_id,
            calificacion: calificacionData.calificacion,
            comentario_evaluacion: calificacionData.comentario_evaluacion || '',
        }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al calificar entrega')
    }
    const data = await response.json()
    return data.entrega || data
}

/**
 * Obtiene las entregas del estudiante autenticado.
 * Backend: GET /api/mis-entregas
 * Returns: { entregas: [...], estadisticas: {...} }
 */
export const getMisEntregas = async () => {
    const base = getBaseURL()

    if (isLocalMode()) return { entregas: [], estadisticas: null }

    const response = await apiFetch(`${base}/mis-entregas`)
    if (!response.ok) throw new Error('Error al cargar mis entregas')
    const data = await response.json()
    return {
        entregas: data.entregas || [],
        estadisticas: data.estadisticas || null,
    }
}
