// src/services/lecciones.service.js
// Servicio de lecciones - consume /api/lecciones/*

import { getBaseURL, isLocalMode, apiFetch } from './api.config'

/**
 * Obtiene lecciones (con filtros opcionales).
 * Backend: GET /api/lecciones?id_tema=X&id_grado=X
 * Returns: { lecciones: [{ id_leccion, id_tema, id_profesor, titulo_leccion, fecha_planificada, tema, profesor, actividades }] }
 */
export const getLecciones = async (filters = {}) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const params = new URLSearchParams(filters).toString()
        const response = await fetch(`${base}/lecciones${params ? `?${params}` : ''}`)
        if (!response.ok) throw new Error('Error al cargar lecciones')
        return await response.json()
    }

    const params = new URLSearchParams()
    if (filters.id_tema) params.set('id_tema', filters.id_tema)
    if (filters.id_grado) params.set('id_grado', filters.id_grado)

    const queryStr = params.toString()
    const response = await apiFetch(`${base}/lecciones${queryStr ? `?${queryStr}` : ''}`)
    if (!response.ok) throw new Error('Error al cargar lecciones')
    const data = await response.json()
    return data.lecciones || []
}

/**
 * Obtiene una lección por ID.
 * Backend: GET /api/lecciones/:id
 * Returns: { leccion: { id_leccion, tema, profesor, actividades } }
 */
export const getLeccionById = async (leccionId) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/lecciones/${leccionId}`)
        if (!response.ok) throw new Error('Error al cargar lección')
        return await response.json()
    }

    const response = await apiFetch(`${base}/lecciones/${leccionId}`)
    if (!response.ok) throw new Error('Error al cargar lección')
    const data = await response.json()
    return data.leccion || data
}

/**
 * Crea una nueva lección (solo profesores/zona).
 * Backend: POST /api/lecciones
 * Expects: { id_tema, titulo_leccion, fecha_planificada }
 */
export const crearLeccion = async (leccionData) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/lecciones`, {
        method: 'POST',
        body: JSON.stringify({
            id_tema: leccionData.id_tema,
            titulo_leccion: leccionData.titulo_leccion,
            fecha_planificada: leccionData.fecha_planificada,
        }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al crear lección')
    }
    const data = await response.json()
    return data.leccion || data
}

/**
 * Actualiza una lección.
 * Backend: PUT /api/lecciones/:id
 */
export const updateLeccion = async (leccionId, updateData) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/lecciones/${leccionId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al actualizar lección')
    }
    const data = await response.json()
    return data.leccion || data
}

/**
 * Elimina una lección.
 * Backend: DELETE /api/lecciones/:id
 */
export const deleteLeccion = async (leccionId) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/lecciones/${leccionId}`, { method: 'DELETE' })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al eliminar lección')
    }
    return await response.json()
}
