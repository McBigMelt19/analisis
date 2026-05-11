// src/services/feedback.service.js
// Servicio de retroalimentación - maneja feedbacks/sugerencias en ambos modos

import { getBaseURL, isLocalMode, apiFetch } from './api.config'

/**
 * Obtiene los feedbacks/sugerencias.
 * - Modo local: GET /feedbacks?teacher_id=X
 * - Modo render: GET /api/sugerencias
 *   Backend returns: { sugerencias: [{ id_sugerencia, id_estudiante, id_tema, tipo, descripcion, respondida, respuesta_ia, estudiante: {...}, tema: {...} }] }
 */
export const getFeedbacksByTeacher = async (teacherId) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/feedbacks?teacher_id=${teacherId}`)
        if (!response.ok) throw new Error('Error al cargar feedbacks')
        return await response.json()
    }

    // Modo Render - usar endpoint de sugerencias
    // Backend endpoint: GET /api/sugerencias
    try {
        const response = await apiFetch(`${base}/sugerencias`)
        if (!response.ok) return []
        const data = await response.json()
        
        const sugerencias = data.sugerencias || (Array.isArray(data) ? data : [])
        
        // Adaptar sugerencias al formato de feedbacks del frontend
        return sugerencias.map(s => ({
            id: s.id_sugerencia,
            student_id: s.id_estudiante,
            teacher_id: teacherId,
            topic: s.tema?.nombre_tema || s.tipo || '',
            feedback: s.descripcion || '',
            date: s.fecha_creacion ? s.fecha_creacion.split('T')[0] : new Date().toISOString().split('T')[0],
            responded: s.respondida,
            response: s.respuesta_ia,
            // Nombre del estudiante si está disponible
            student_name: s.estudiante?.persona 
                ? `${s.estudiante.persona.nombre} ${s.estudiante.persona.apellido}` 
                : null,
        }))
    } catch {
        console.warn('Endpoint de sugerencias no disponible en modo render')
        return []
    }
}

/**
 * Crea un nuevo feedback/sugerencia.
 * - Modo local: POST /feedbacks
 * - Modo render: POST /api/chatbot/sugerir
 *   Backend expects: { id_tema, tipo, descripcion }
 *   Backend returns: { message, sugerencia }
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
    // Backend endpoint: POST /api/chatbot/sugerir
    // Backend expects: { id_tema, tipo, descripcion }
    const response = await apiFetch(`${base}/chatbot/sugerir`, {
        method: 'POST',
        body: JSON.stringify({
            id_tema: feedbackData.topic_id || feedbackData.id_tema || 1,
            tipo: feedbackData.tipo || 'mejora_contenido',
            descripcion: feedbackData.feedback || feedbackData.descripcion || '',
        }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al guardar feedback')
    }
    const data = await response.json()
    
    // Adaptar respuesta al formato del frontend
    const sugerencia = data.sugerencia || data
    return {
        id: sugerencia.id_sugerencia || sugerencia.id,
        student_id: feedbackData.student_id,
        teacher_id: feedbackData.teacher_id,
        topic: feedbackData.topic,
        feedback: feedbackData.feedback,
        date: new Date().toISOString().split('T')[0],
    }
}

/**
 * Responde a una sugerencia (solo profesores/admin).
 * Backend endpoint: PUT /api/sugerencias/:id_sugerencia/responder
 * Backend expects: { respuesta_ia }
 * Backend returns: { message, sugerencia }
 */
export const respondToSuggestion = async (sugerenciaId, respuesta) => {
    const base = getBaseURL()

    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/sugerencias/${sugerenciaId}/responder`, {
        method: 'PUT',
        body: JSON.stringify({ respuesta_ia: respuesta }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al responder sugerencia')
    }
    return await response.json()
}
