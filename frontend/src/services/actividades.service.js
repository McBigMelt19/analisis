// src/services/actividades.service.js
// Servicio de actividades - consume /api/actividades/*, /api/estadisticas

import { getBaseURL, isLocalMode, apiFetch } from './api.config'

// ═══════════════════════════════════════════════
// ACTIVIDADES (CRUD)
// ═══════════════════════════════════════════════

/**
 * Obtiene actividades (con filtros opcionales).
 * Backend: GET /api/actividades?id_leccion=X&id_tema=X
 * Returns: { actividades: [{ id_actividad, id_leccion, id_tipo, puntaje_maximo, leccion, tipoActividad }] }
 */
export const getActividades = async (filters = {}) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const params = new URLSearchParams(filters).toString()
        const response = await fetch(`${base}/actividades${params ? `?${params}` : ''}`)
        if (!response.ok) throw new Error('Error al cargar actividades')
        return await response.json()
    }

    const params = new URLSearchParams()
    if (filters.id_leccion) params.set('id_leccion', filters.id_leccion)
    if (filters.id_tema) params.set('id_tema', filters.id_tema)

    const queryStr = params.toString()
    const response = await apiFetch(`${base}/actividades${queryStr ? `?${queryStr}` : ''}`)
    if (!response.ok) throw new Error('Error al cargar actividades')
    const data = await response.json()
    return data.actividades || []
}

/**
 * Obtiene una actividad por ID.
 * Backend: GET /api/actividades/:id
 */
export const getActividadById = async (actividadId) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/actividades/${actividadId}`)
    if (!response.ok) throw new Error('Error al cargar actividad')
    const data = await response.json()
    return data.actividad || data
}

/**
 * Crea una nueva actividad (solo profesores/zona).
 * Backend: POST /api/actividades
 * Expects: { id_leccion, id_tipo, puntaje_maximo }
 */
export const crearActividad = async (actividadData) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/actividades`, {
        method: 'POST',
        body: JSON.stringify({
            id_leccion: actividadData.id_leccion,
            id_tipo: actividadData.id_tipo,
            puntaje_maximo: actividadData.puntaje_maximo || 20,
        }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al crear actividad')
    }
    const data = await response.json()
    return data.actividad || data
}

/**
 * Actualiza una actividad.
 * Backend: PUT /api/actividades/:id
 */
export const updateActividad = async (actividadId, updateData) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/actividades/${actividadId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al actualizar actividad')
    }
    const data = await response.json()
    return data.actividad || data
}

/**
 * Elimina una actividad.
 * Backend: DELETE /api/actividades/:id
 */
export const deleteActividad = async (actividadId) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/actividades/${actividadId}`, { method: 'DELETE' })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al eliminar actividad')
    }
    return await response.json()
}

// ═══════════════════════════════════════════════
// ENTREGAS DE ACTIVIDADES
// ═══════════════════════════════════════════════

/**
 * Entrega una actividad (solo estudiantes).
 * Backend: POST /api/actividades/:id/entregar
 * Expects: { respuestas }
 * Returns: { message, entrega, evaluacion_preliminar }
 */
export const entregarActividad = async (actividadId, respuestas) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/actividades/${actividadId}/entregar`, {
        method: 'POST',
        body: JSON.stringify({ respuestas }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al entregar actividad')
    }
    return await response.json()
}

/**
 * Obtiene entregas de una actividad (solo profesores/admin).
 * Backend: GET /api/actividades/:id/entregas
 * Returns: { entregas: [...] }
 */
export const getEntregasPorActividad = async (actividadId) => {
    const base = getBaseURL()
    if (isLocalMode()) return []

    const response = await apiFetch(`${base}/actividades/${actividadId}/entregas`)
    if (!response.ok) throw new Error('Error al cargar entregas')
    const data = await response.json()
    return data.entregas || []
}

/**
 * Califica una actividad entregada (solo profesores/admin).
 * Backend: POST /api/actividades/calificar
 * Expects: { id_entrega, nota_obtenida, texto_feedback }
 */
export const calificarActividad = async (calificacionData) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/actividades/calificar`, {
        method: 'POST',
        body: JSON.stringify({
            id_entrega: calificacionData.id_entrega,
            nota_obtenida: calificacionData.nota_obtenida,
            texto_feedback: calificacionData.texto_feedback || '',
        }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al calificar actividad')
    }
    return await response.json()
}

/**
 * Obtiene las entregas del estudiante autenticado (actividades legado).
 * Backend: GET /api/mis-entregas-actividades
 * Returns: { entregas: [...] }
 */
export const getMisEntregasActividades = async () => {
    const base = getBaseURL()
    if (isLocalMode()) return []

    const response = await apiFetch(`${base}/mis-entregas-actividades`)
    if (!response.ok) throw new Error('Error al cargar entregas')
    const data = await response.json()
    return data.entregas || []
}

// ═══════════════════════════════════════════════
// ESTADÍSTICAS
// ═══════════════════════════════════════════════

/**
 * Obtiene estadísticas completas del usuario autenticado.
 * Backend: GET /api/estadisticas
 * Returns: { estadisticas: { total, completadas, promedio, letra, porTipo, porTema, racha } }
 */
export const getEstadisticas = async () => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/estadisticas`)
    if (!response.ok) throw new Error('Error al cargar estadísticas')
    const data = await response.json()
    return data.estadisticas || data
}
