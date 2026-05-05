// src/services/feedback.service.js
// Servicio de retroalimentación - actualmente solo soporta modo local (json-server)
// El backend Render no tiene un endpoint equivalente de feedbacks

import { getBaseURL, isLocalMode, apiFetch } from './api.config'

/**
 * Obtiene los feedbacks de un profesor.
 * - Modo local: GET /feedbacks?teacher_id=X
 * - Modo render: GET /sugerencias (adaptado)
 */
export const getFeedbacksByTeacher = async (teacherId) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/feedbacks?teacher_id=${teacherId}`)
        if (!response.ok) throw new Error('Error al cargar feedbacks')
        return await response.json()
    }

    // Modo Render - usar endpoint de sugerencias como alternativa
    try {
        const response = await apiFetch(`${base}/sugerencias`)
        if (!response.ok) return []
        const data = await response.json()
        return Array.isArray(data) ? data : (data.sugerencias || [])
    } catch {
        console.warn('Endpoint de feedbacks no disponible en modo render')
        return []
    }
}

/**
 * Crea un nuevo feedback.
 * - Modo local: POST /feedbacks
 * - Modo render: POST /chatbot/sugerir (adaptado)
 */
export const createFeedback = async (feedbackData) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/feedbacks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedbackData),
        })
        if (!response.ok) throw new Error('Error al guardar feedback')
        return await response.json()
    }

    // Modo Render
    try {
        const response = await apiFetch(`${base}/chatbot/sugerir`, {
            method: 'POST',
            body: JSON.stringify({
                mensaje: feedbackData.feedback,
                id_estudiante: feedbackData.student_id,
                tema: feedbackData.topic,
            }),
        })
        if (!response.ok) throw new Error('Error al guardar feedback')
        return await response.json()
    } catch (error) {
        console.warn('Endpoint de feedbacks no disponible en modo render:', error)
        throw error
    }
}
