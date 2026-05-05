// src/services/progress.service.js
// Servicio de progreso - maneja consultas de progreso/calificaciones en ambos modos

import { getBaseURL, isLocalMode, apiFetch } from './api.config'

/**
 * Obtiene el progreso de un estudiante.
 * - Modo local: GET /progress?student_id=X
 * - Modo render: GET /progreso (el backend filtra automáticamente por el usuario autenticado)
 */
export const getStudentProgress = async (studentId) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/progress?student_id=${studentId}`)
        if (!response.ok) throw new Error('Error al cargar progreso')
        return await response.json()
    }

    // Modo Render
    const response = await apiFetch(`${base}/progreso`)
    if (!response.ok) throw new Error('Error al cargar progreso')
    const data = await response.json()
    
    // Adaptar formato si es necesario
    const progressList = Array.isArray(data) ? data : (data.progreso || [])
    return progressList.map(adaptRenderProgressToLocal)
}

/**
 * Obtiene progreso por grado (para profesores).
 * - Modo local: GET /progress?grade_id=X
 * - Modo render: GET /progreso (con filtro)
 */
export const getProgressByGrade = async (gradeId, activityType = null) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        let url = `${base}/progress?grade_id=${gradeId}`
        if (activityType) {
            url += `&activity_type=${activityType}`
        }
        const response = await fetch(url)
        if (!response.ok) throw new Error('Error al cargar progreso')
        return await response.json()
    }

    // Modo Render
    const response = await apiFetch(`${base}/progreso`)
    if (!response.ok) throw new Error('Error al cargar progreso')
    const data = await response.json()
    
    let progressList = Array.isArray(data) ? data : (data.progreso || [])
    progressList = progressList.map(adaptRenderProgressToLocal)
    
    // Filtrar por activity_type si se especifica
    if (activityType) {
        progressList = progressList.filter(p => p.activity_type === activityType)
    }
    
    return progressList
}

/**
 * Crea o actualiza un registro de progreso.
 * - Modo local: POST /progress o PUT /progress/:id
 * - Modo render: POST /progreso
 */
export const saveProgress = async (progressData, existingId = null) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        if (existingId) {
            // Update
            const response = await fetch(`${base}/progress/${existingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...progressData, id: existingId }),
            })
            if (!response.ok) throw new Error('Error al guardar progreso')
            return await response.json()
        } else {
            // Create
            const response = await fetch(`${base}/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(progressData),
            })
            if (!response.ok) throw new Error('Error al guardar progreso')
            return await response.json()
        }
    }

    // Modo Render
    const renderPayload = adaptLocalProgressToRender(progressData)
    const response = await apiFetch(`${base}/progreso`, {
        method: 'POST',
        body: JSON.stringify(renderPayload),
    })
    if (!response.ok) throw new Error('Error al guardar progreso')
    const data = await response.json()
    return adaptRenderProgressToLocal(data)
}

/**
 * Obtiene grados (solo modo local).
 * - Modo local: GET /grades?id=X
 * - Modo render: GET /grados
 */
export const getGradeById = async (gradeId) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/grades?id=${gradeId}`)
        if (!response.ok) throw new Error('Error al cargar grado')
        return await response.json()
    }

    // Modo Render
    const response = await apiFetch(`${base}/grados`)
    if (!response.ok) throw new Error('Error al cargar grados')
    const grados = await response.json()
    
    // Adaptar y filtrar
    const grado = (Array.isArray(grados) ? grados : (grados.grados || [])).find(g => g.id_grado == gradeId)
    if (grado) {
        return [{
            id: grado.id_grado,
            name: grado.nombre || `${gradeId}° Grado`,
            description: grado.descripcion || '',
        }]
    }
    return []
}

/**
 * Adapta progreso del backend Render al formato json-server
 */
const adaptRenderProgressToLocal = (renderProgress) => {
    if (!renderProgress) return renderProgress
    
    // Si ya tiene el formato local (modo local), devolver tal cual
    if (renderProgress.student_id !== undefined) return renderProgress
    
    return {
        id: renderProgress.id_progreso || renderProgress.id,
        student_id: renderProgress.id_estudiante,
        grade_id: renderProgress.id_grado,
        activity_type: renderProgress.tipo_actividad || renderProgress.activity_type,
        topic: renderProgress.tema || renderProgress.topic,
        score: renderProgress.puntaje || renderProgress.score,
        max_score: renderProgress.puntaje_maximo || renderProgress.max_score || 20,
        date: renderProgress.fecha || renderProgress.date,
        completed: renderProgress.completado !== undefined ? renderProgress.completado : renderProgress.completed,
    }
}

/**
 * Adapta progreso del formato local al formato Render
 */
const adaptLocalProgressToRender = (localProgress) => {
    return {
        id_estudiante: localProgress.student_id,
        tipo_actividad: localProgress.activity_type,
        tema: localProgress.topic,
        puntaje: localProgress.score,
        puntaje_maximo: localProgress.max_score || 20,
        fecha: localProgress.date,
        completado: localProgress.completed,
    }
}
