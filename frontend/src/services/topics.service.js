// src/services/topics.service.js
// Servicio de temas - maneja consultas de temas/topics en ambos modos

import { getBaseURL, isLocalMode, apiFetch } from './api.config'

/**
 * Obtiene los temas por grado.
 * - Modo local: GET /topics?grade_id=X (devuelve array con objeto { temas: [...], grade_name, ... })
 * - Modo render: GET /api/temas/grado/:id_grado
 *   Backend returns: { temas: [{ id_tema, nombre_tema, descripcion_objetivos, id_grado, lecciones: [...] }] }
 */
export const getTopicsByGrade = async (gradeId) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/topics?grade_id=${gradeId}`)
        if (!response.ok) throw new Error('Error al cargar temas')
        return await response.json()
    }

    // Modo Render
    // Backend endpoint: GET /api/temas/grado/:id_grado
    // Backend returns: { temas: [{ id_tema, nombre_tema, descripcion_objetivos, id_grado, lecciones }] }
    const response = await apiFetch(`${base}/temas/grado/${gradeId}`)
    if (!response.ok) throw new Error('Error al cargar temas')
    const data = await response.json()

    // Adaptar formato: el backend devuelve { temas: [...] }
    // El frontend espera [{ grade_name, temas: [string...], edad_objetivo, ... }]
    const temas = data.temas || []
    
    return [{
        grade_id: gradeId,
        grade_name: `${gradeId}° Grado`,
        temas: temas.map(t => t.nombre_tema || t.titulo || t.nombre || t),
        id_tema_actual: temas.length > 0 ? (temas[0].id_tema || null) : null,
        edad_objetivo: '',
        nivel_complejidad: '',
        restricciones_ia: '',
        // Datos completos de temas para uso avanzado (necesario para mapear id_tema)
        _temasCompletos: temas,
    }]
}

/**
 * Obtiene todos los temas (autenticado).
 * - Modo local: GET /topics
 * - Modo render: GET /api/temas
 *   Backend returns: { temas: [...] }
 */
export const getAllTopics = async () => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/topics`)
        if (!response.ok) throw new Error('Error al cargar temas')
        return await response.json()
    }

    // Backend endpoint: GET /api/temas
    // Backend returns: { temas: [{ id_tema, nombre_tema, descripcion_objetivos, id_grado, grado, lecciones }] }
    const response = await apiFetch(`${base}/temas`)
    if (!response.ok) throw new Error('Error al cargar temas')
    const data = await response.json()
    return data.temas || []
}

/**
 * Obtiene un tema por ID.
 * - Modo render: GET /api/temas/:id
 *   Backend returns: { tema: { id_tema, nombre_tema, descripcion_objetivos, grado, lecciones } }
 */
export const getTopicById = async (topicId) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/topics/${topicId}`)
        if (!response.ok) throw new Error('Error al cargar tema')
        return await response.json()
    }

    const response = await apiFetch(`${base}/temas/${topicId}`)
    if (!response.ok) throw new Error('Error al cargar tema')
    const data = await response.json()
    return data.tema || data
}

/**
 * Crea un nuevo tema (solo profesores/admin).
 * - Modo render: POST /api/temas
 *   Backend expects: { nombre_tema, descripcion_objetivos, id_grado }
 *   Backend returns: { message, tema }
 */
export const createTopic = async (topicData) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/topics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(topicData),
        })
        if (!response.ok) throw new Error('Error al crear tema')
        return await response.json()
    }

    const response = await apiFetch(`${base}/temas`, {
        method: 'POST',
        body: JSON.stringify({
            nombre_tema: topicData.nombre_tema || topicData.name,
            descripcion_objetivos: topicData.descripcion_objetivos || topicData.description || '',
            id_grado: topicData.id_grado || topicData.grade_id,
        }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al crear tema')
    }
    const data = await response.json()
    return data.tema || data
}
