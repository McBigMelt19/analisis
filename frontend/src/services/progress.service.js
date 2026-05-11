// src/services/progress.service.js
// Servicio de progreso - maneja consultas de progreso/calificaciones en ambos modos

import { getBaseURL, isLocalMode, apiFetch } from './api.config'

/**
 * Obtiene el progreso de un estudiante.
 * - Modo local: GET /progress?student_id=X
 * - Modo render: GET /api/progreso
 *   Backend returns: { progresos: [{ id_progreso, id_estudiante, id_tema, actividades_completadas, tiempo_estudiado_minutos, nivel_comprension, tema: {...} }] }
 */
export const getStudentProgress = async (studentId) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/progress?student_id=${studentId}`)
        if (!response.ok) throw new Error('Error al cargar progreso')
        return await response.json()
    }

    // Modo Render
    // Backend endpoint: GET /api/progreso (filtra por el usuario autenticado via JWT)
    const response = await apiFetch(`${base}/progreso`)
    if (!response.ok) throw new Error('Error al cargar progreso')
    const data = await response.json()
    
    // Adaptar formato
    const progressList = data.progresos || (Array.isArray(data) ? data : [])
    return progressList.map(adaptRenderProgressToLocal)
}

/**
 * Obtiene progreso por grado (para profesores).
 * - Modo local: GET /progress?grade_id=X
 * - Modo render: GET /api/progreso (el backend devuelve solo el progreso del usuario autenticado)
 *   Para profesores, necesitamos usar /api/estadisticas o /api/mis-entregas
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

    // Modo Render - Los profesores usan /api/estadisticas para ver datos de sus estudiantes
    // Backend endpoint: GET /api/estadisticas
    // Backend returns: { estadisticas: {...} }
    try {
        const response = await apiFetch(`${base}/estadisticas`)
        if (!response.ok) {
            // Si estadísticas no está disponible, devolver array vacío
            console.warn('Endpoint de estadísticas no disponible, devolviendo array vacío')
            return []
        }
        const data = await response.json()
        
        // Las estadísticas del backend tienen un formato diferente
        // Devolvemos lo que tengamos adaptado
        if (data.estadisticas) {
            return adaptEstadisticasToProgressList(data.estadisticas)
        }
        return []
    } catch (error) {
        console.warn('Error al cargar estadísticas:', error)
        return []
    }
}

/**
 * Crea o actualiza un registro de progreso.
 * - Modo local: POST /progress o PUT /progress/:id
 * - Modo render: POST /api/progreso
 *   Backend expects: { id_tema, actividades_completadas, tiempo_estudiado_minutos, nivel_comprension }
 *   Backend returns: { message, progreso }
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
    // Backend endpoint: POST /api/progreso
    // Backend expects: { id_tema, actividades_completadas, tiempo_estudiado_minutos, nivel_comprension }
    const renderPayload = adaptLocalProgressToRender(progressData)
    const response = await apiFetch(`${base}/progreso`, {
        method: 'POST',
        body: JSON.stringify(renderPayload),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al guardar progreso')
    }
    const data = await response.json()
    return adaptRenderProgressToLocal(data.progreso || data)
}

/**
 * Obtiene grados (solo modo local).
 * - Modo local: GET /grades?id=X
 * - Modo render: GET /api/grados
 *   Backend returns: { grados: [{ id_grado, nombre_grado }] }
 */
export const getGradeById = async (gradeId) => {
    const base = getBaseURL()

    if (isLocalMode()) {
        const response = await fetch(`${base}/grades?id=${gradeId}`)
        if (!response.ok) throw new Error('Error al cargar grado')
        return await response.json()
    }

    // Modo Render
    // Backend endpoint: GET /api/grados (no requiere autenticación)
    const response = await apiFetch(`${base}/grados`)
    if (!response.ok) throw new Error('Error al cargar grados')
    const data = await response.json()
    
    // Adaptar y filtrar
    const grados = data.grados || (Array.isArray(data) ? data : [])
    const grado = grados.find(g => g.id_grado == gradeId)
    if (grado) {
        return [{
            id: grado.id_grado,
            name: grado.nombre_grado || grado.nombre || `${gradeId}° Grado`,
            description: grado.descripcion || '',
        }]
    }
    return []
}

/**
 * Obtiene las entregas del estudiante autenticado.
 * Backend endpoint: GET /api/mis-entregas
 * Backend returns: { entregas: [{ id_entrega, id_estudiante, id_actividad, fecha_entrega, nota_obtenida, actividad: {...}, retroalimentaciones: [...] }] }
 */
export const getMySubmissions = async () => {
    const base = getBaseURL()

    if (isLocalMode()) return []

    const response = await apiFetch(`${base}/mis-entregas`)
    if (!response.ok) throw new Error('Error al cargar entregas')
    const data = await response.json()
    return data.entregas || []
}

/**
 * Obtiene estadísticas del usuario autenticado.
 * Backend endpoint: GET /api/estadisticas
 * Backend returns: { estadisticas: {...} }
 */
export const getStatistics = async () => {
    const base = getBaseURL()

    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/estadisticas`)
    if (!response.ok) throw new Error('Error al cargar estadísticas')
    const data = await response.json()
    return data.estadisticas || data
}

/**
 * Adapta progreso del backend Render al formato json-server
 * Backend format: { id_progreso, id_estudiante, id_tema, actividades_completadas, tiempo_estudiado_minutos, nivel_comprension, fecha_actualizacion, tema: { nombre_tema } }
 */
const adaptRenderProgressToLocal = (renderProgress) => {
    if (!renderProgress) return renderProgress
    
    // Si ya tiene el formato local (modo local), devolver tal cual
    if (renderProgress.student_id !== undefined) return renderProgress
    
    return {
        id: renderProgress.id_progreso || renderProgress.id,
        student_id: renderProgress.id_estudiante,
        grade_id: renderProgress.id_grado,
        activity_type: renderProgress.tipo_actividad || renderProgress.activity_type || 'activity',
        topic: renderProgress.tema?.nombre_tema || renderProgress.tema || renderProgress.topic || '',
        score: renderProgress.puntaje || renderProgress.score || renderProgress.actividades_completadas || 0,
        max_score: renderProgress.puntaje_maximo || renderProgress.max_score || 20,
        date: renderProgress.fecha_actualizacion || renderProgress.fecha || renderProgress.date || '',
        completed: renderProgress.completado !== undefined ? renderProgress.completado : renderProgress.completed,
        // Datos adicionales del backend
        actividades_completadas: renderProgress.actividades_completadas,
        tiempo_estudiado_minutos: renderProgress.tiempo_estudiado_minutos,
        nivel_comprension: renderProgress.nivel_comprension,
    }
}

/**
 * Adapta progreso del formato local al formato Render
 * Backend expects: { id_tema, actividades_completadas, tiempo_estudiado_minutos, nivel_comprension }
 */
const adaptLocalProgressToRender = (localProgress) => {
    let nivel = 'intermedio';
    if (localProgress.score >= 15) nivel = 'avanzado';
    else if (localProgress.score < 10) nivel = 'basico';

    return {
        id_tema: localProgress.topic_id || localProgress.id_tema || 1,
        actividades_completadas: localProgress.actividades_completadas || 1,
        tiempo_estudiado_minutos: localProgress.tiempo_estudiado_minutos || 30,
        nivel_comprension: localProgress.nivel_comprension || nivel
    }
}

/**
 * Adapta estadísticas del backend a lista de progress items para el frontend
 */
const adaptEstadisticasToProgressList = (estadisticas) => {
    // Si las estadísticas son un resumen, devolvemos array vacío
    // ya que no contienen items individuales de progreso
    if (!estadisticas || typeof estadisticas !== 'object') return []
    
    // Si tiene una lista de entregas, adaptarlas
    if (Array.isArray(estadisticas)) {
        return estadisticas.map(item => ({
            id: item.id_entrega || item.id,
            student_id: item.id_estudiante,
            activity_type: item.actividad?.tipoActividad?.nombre || 'evaluacion',
            topic: item.actividad?.leccion?.tema?.nombre_tema || '',
            score: item.nota_obtenida || 0,
            max_score: item.actividad?.puntaje_maximo || 20,
            date: item.fecha_entrega || '',
            completed: true,
        }))
    }

    return []
}
