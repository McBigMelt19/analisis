// src/services/topics.service.js
// Servicio de temas - maneja consultas de temas/topics en ambos modos

import { getBaseURL, isLocalMode, apiFetch } from './api.config'

/**
 * Obtiene los temas por grado.
 * - Modo local: GET /topics?grade_id=X (devuelve array con objeto { temas: [...], grade_name, ... })
 * - Modo render: GET /temas/grado/:id_grado (devuelve array de temas con estructura diferente)
 */
export const getTopicsByGrade = async (gradeId) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/topics?grade_id=${gradeId}`)
        if (!response.ok) throw new Error('Error al cargar temas')
        return await response.json()
    }

    // Modo Render
    const response = await apiFetch(`${base}/temas/grado/${gradeId}`)
    if (!response.ok) throw new Error('Error al cargar temas')
    const data = await response.json()

    // Adaptar formato: el backend Render devuelve un array de temas
    // El frontend espera [{ grade_name, temas: [...], edad_objetivo, ... }]
    // Necesitamos adaptar a ese formato
    const temas = Array.isArray(data) ? data : (data.temas || [])
    
    return [{
        grade_id: gradeId,
        grade_name: `${gradeId}° Grado`,
        temas: temas.map(t => t.titulo || t.nombre || t),
        edad_objetivo: '',
        nivel_complejidad: '',
        restricciones_ia: '',
        // Datos completos de temas para uso avanzado
        _temasCompletos: temas,
    }]
}

/**
 * Obtiene todos los temas (autenticado).
 * - Modo local: GET /topics
 * - Modo render: GET /temas
 */
export const getAllTopics = async () => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/topics`)
        if (!response.ok) throw new Error('Error al cargar temas')
        return await response.json()
    }

    const response = await apiFetch(`${base}/temas`)
    if (!response.ok) throw new Error('Error al cargar temas')
    return await response.json()
}
