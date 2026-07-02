// src/services/chatbot.service.js
// Servicio de chatbot IA - consume /api/chatbot/*, /api/config-ia, /api/progreso, /api/sugerencias

import { getBaseURL, isLocalMode, apiFetch } from './api.config'

// ═══════════════════════════════════════════════
// CHAT IA
// ═══════════════════════════════════════════════

/**
 * Envía un mensaje al chatbot IA.
 * Backend: POST /api/chatbot/chat
 * Expects: { mensaje, id_tema?, modo? }
 * Returns: { respuesta, uso_tokens }
 */
export const enviarMensaje = async (mensaje, idTema = null, modo = 'tutor') => {
    const base = getBaseURL()

    if (isLocalMode()) {
        return {
            respuesta: `[Modo local] Respuesta simulada a: "${mensaje}"`,
            uso_tokens: { prompt: 0, completion: 0, total: 0 },
        }
    }

    const response = await apiFetch(`${base}/chatbot/chat`, {
        method: 'POST',
        body: JSON.stringify({
            mensaje,
            id_tema: idTema,
            modo,
        }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al comunicarse con el chatbot')
    }
    return await response.json()
}

/**
 * Genera un quiz con IA.
 * Backend: POST /api/chatbot/quiz
 * Expects: { id_tema?, cantidad?, dificultad? }
 * Returns: quiz object con preguntas
 */
export const generarQuiz = async (idTema = null, cantidad = 5, dificultad = 'media') => {
    const base = getBaseURL()

    if (isLocalMode()) {
        return {
            preguntas: [
                {
                    pregunta: '[Modo local] ¿Pregunta de ejemplo?',
                    opciones: ['A', 'B', 'C', 'D'],
                    respuesta_correcta: 'A',
                },
            ],
        }
    }

    const response = await apiFetch(`${base}/chatbot/quiz`, {
        method: 'POST',
        body: JSON.stringify({ id_tema: idTema, cantidad, dificultad }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al generar quiz')
    }
    return await response.json()
}

/**
 * Evalúa una respuesta del estudiante con IA.
 * Backend: POST /api/chatbot/evaluar
 * Expects: { pregunta, respuesta_usuario, respuesta_correcta, id_tema? }
 * Returns: evaluación con feedback
 */
export const evaluarRespuesta = async (pregunta, respuestaUsuario, respuestaCorrecta, idTema = null) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        return {
            correcta: respuestaUsuario === respuestaCorrecta,
            feedback: '[Modo local] Evaluación simulada.',
        }
    }

    const response = await apiFetch(`${base}/chatbot/evaluar`, {
        method: 'POST',
        body: JSON.stringify({
            pregunta,
            respuesta_usuario: respuestaUsuario,
            respuesta_correcta: respuestaCorrecta,
            id_tema: idTema,
        }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al evaluar respuesta')
    }
    return await response.json()
}

// ═══════════════════════════════════════════════
// CONFIGURACIÓN IA
// ═══════════════════════════════════════════════

/**
 * Obtiene la configuración IA.
 * Backend: GET /api/config-ia?id_grado=X&id_tema=X
 * Returns: { configs: [...] }
 */
export const getConfigIA = async (idGrado = null, idTema = null) => {
    const base = getBaseURL()

    if (isLocalMode()) return []

    const params = new URLSearchParams()
    if (idGrado) params.set('id_grado', idGrado)
    if (idTema) params.set('id_tema', idTema)

    const queryStr = params.toString()
    const response = await apiFetch(`${base}/config-ia${queryStr ? `?${queryStr}` : ''}`)
    if (!response.ok) throw new Error('Error al cargar configuración IA')
    const data = await response.json()
    return data.configs || []
}

/**
 * Configura la IA para un grado/tema (solo profesores/admin).
 * Backend: POST /api/config-ia
 * Expects: { id_grado, id_tema?, nivel_simplificacion, permitir_respuestas_directas, preguntas_sugeridas_por_entrega, metodo_pedagogico }
 * Returns: { message, config }
 */
export const setConfigIA = async (configData) => {
    const base = getBaseURL()

    if (isLocalMode()) return { message: 'No disponible en modo local' }

    const response = await apiFetch(`${base}/config-ia`, {
        method: 'POST',
        body: JSON.stringify({
            id_grado: configData.id_grado,
            id_tema: configData.id_tema || null,
            nivel_simplificacion: configData.nivel_simplificacion,
            permitir_respuestas_directas: configData.permitir_respuestas_directas,
            preguntas_sugeridas_por_entrega: configData.preguntas_sugeridas_por_entrega,
            metodo_pedagogico: configData.metodo_pedagogico,
        }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al guardar configuración IA')
    }
    return await response.json()
}

// ═══════════════════════════════════════════════
// PROGRESO DEL ESTUDIANTE
// ═══════════════════════════════════════════════

/**
 * Obtiene el progreso del estudiante autenticado.
 * Backend: GET /api/progreso
 * Returns: { progresos: [{ id_progreso, id_estudiante, id_tema, actividades_completadas, tema }] }
 */
export const getProgreso = async () => {
    const base = getBaseURL()

    if (isLocalMode()) return []

    const response = await apiFetch(`${base}/progreso`)
    if (!response.ok) throw new Error('Error al cargar progreso')
    const data = await response.json()
    return data.progresos || []
}

/**
 * Actualiza/crea progreso del estudiante.
 * Backend: POST /api/progreso
 * Expects: { id_tema, actividades_completadas, tiempo_estudiado_minutos, nivel_comprension }
 * Returns: { message, progreso }
 */
export const actualizarProgreso = async (progresoData) => {
    const base = getBaseURL()

    if (isLocalMode()) return { message: 'No disponible en modo local' }

    const response = await apiFetch(`${base}/progreso`, {
        method: 'POST',
        body: JSON.stringify({
            id_tema: progresoData.id_tema,
            actividades_completadas: progresoData.actividades_completadas || 0,
            tiempo_estudiado_minutos: progresoData.tiempo_estudiado_minutos || 0,
            nivel_comprension: progresoData.nivel_comprension || 'intermedio',
        }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al actualizar progreso')
    }
    return await response.json()
}

// ═══════════════════════════════════════════════
// SUGERENCIAS DEL ESTUDIANTE
// ═══════════════════════════════════════════════

/**
 * Envía una sugerencia/feedback.
 * Backend: POST /api/sugerencias
 * Expects: { id_tema, tipo, descripcion }
 * Returns: { message, sugerencia }
 */
export const enviarSugerencia = async (sugerenciaData) => {
    const base = getBaseURL()

    if (isLocalMode()) return { message: 'No disponible en modo local' }

    const response = await apiFetch(`${base}/sugerencias`, {
        method: 'POST',
        body: JSON.stringify({
            id_tema: sugerenciaData.id_tema,
            tipo: sugerenciaData.tipo || 'mejora_contenido',
            descripcion: sugerenciaData.descripcion,
        }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al enviar sugerencia')
    }
    return await response.json()
}

/**
 * Obtiene todas las sugerencias (profesores/admin).
 * Backend: GET /api/sugerencias
 * Returns: { sugerencias: [...] }
 */
export const getSugerencias = async () => {
    const base = getBaseURL()

    if (isLocalMode()) return []

    const response = await apiFetch(`${base}/sugerencias`)
    if (!response.ok) throw new Error('Error al cargar sugerencias')
    const data = await response.json()
    return data.sugerencias || []
}

/**
 * Responde a una sugerencia (profesores/admin).
 * Backend: PUT /api/sugerencias/:id/responder
 * Expects: { respuesta_ia }
 */
export const responderSugerencia = async (sugerenciaId, respuesta) => {
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
