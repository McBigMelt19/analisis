// src/services/zonaEducativa.service.js
// Servicio de Zona Educativa (Super Admin) - consume /api/zona-educativa/*

import { getBaseURL, isLocalMode, apiFetch } from './api.config'

// ═══════════════════════════════════════════════
// PERÍODOS ESCOLARES
// ═══════════════════════════════════════════════

/**
 * Obtiene todos los períodos escolares.
 * Backend: GET /api/zona-educativa/periodos
 * Returns: { periodos: [...] }
 */
export const getPeriodos = async () => {
    const base = getBaseURL()
    if (isLocalMode()) return []

    const response = await apiFetch(`${base}/zona-educativa/periodos`)
    if (!response.ok) throw new Error('Error al cargar períodos')
    const data = await response.json()
    return data.periodos || []
}

/**
 * Crea un nuevo período escolar.
 * Backend: POST /api/zona-educativa/periodos
 * Expects: { nombre, fecha_inicio, fecha_fin, activo }
 */
export const crearPeriodo = async (periodoData) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/zona-educativa/periodos`, {
        method: 'POST',
        body: JSON.stringify(periodoData),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al crear período')
    }
    return await response.json()
}

/**
 * Actualiza un período escolar.
 * Backend: PUT /api/zona-educativa/periodos/:id
 */
export const actualizarPeriodo = async (periodoId, updateData) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/zona-educativa/periodos/${periodoId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al actualizar período')
    }
    return await response.json()
}

// ═══════════════════════════════════════════════
// ESCUELAS
// ═══════════════════════════════════════════════

/**
 * Obtiene todas las escuelas.
 * Backend: GET /api/zona-educativa/escuelas (autenticado) o GET /api/escuelas (público)
 */
export const getEscuelas = async (autenticado = true) => {
    const base = getBaseURL()
    if (isLocalMode()) return []

    const url = autenticado ? `${base}/zona-educativa/escuelas` : `${base}/escuelas`
    const response = autenticado ? await apiFetch(url) : await fetch(url)
    if (!response.ok) throw new Error('Error al cargar escuelas')
    const data = await response.json()
    return data.escuelas || []
}

/**
 * Crea una nueva escuela.
 * Backend: POST /api/zona-educativa/escuelas
 * Expects: { nombre, direccion }
 */
export const crearEscuela = async (escuelaData) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/zona-educativa/escuelas`, {
        method: 'POST',
        body: JSON.stringify({
            nombre: escuelaData.nombre,
            direccion: escuelaData.direccion || '',
        }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al crear escuela')
    }
    return await response.json()
}

// ═══════════════════════════════════════════════
// ADMINS DE ESCUELA
// ═══════════════════════════════════════════════

/**
 * Obtiene todos los administradores de escuela.
 * Backend: GET /api/zona-educativa/admins?escuela_id=X
 * Returns: { admins: [{ id, usuario, escuela }] }
 */
export const getAdmins = async (escuelaId = null) => {
    const base = getBaseURL()
    if (isLocalMode()) return []

    const params = escuelaId ? `?escuela_id=${escuelaId}` : ''
    const response = await apiFetch(`${base}/zona-educativa/admins${params}`)
    if (!response.ok) throw new Error('Error al cargar administradores')
    const data = await response.json()
    return data.admins || []
}

/**
 * Asigna un usuario existente como admin de escuela.
 * Backend: POST /api/zona-educativa/admins
 * Expects: { usuario_id, escuela_id }
 */
export const asignarAdmin = async (usuarioId, escuelaId) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/zona-educativa/admins`, {
        method: 'POST',
        body: JSON.stringify({ usuario_id: usuarioId, escuela_id: escuelaId }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al asignar administrador')
    }
    return await response.json()
}

/**
 * Registra un nuevo admin de escuela (crea usuario + persona + admin).
 * Backend: POST /api/zona-educativa/registrar-admin
 * Expects: { username, contrasena, nombre, apellido, email_recuperacion, ci, telefono, escuela_id }
 */
export const registrarAdmin = async (adminData) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/zona-educativa/registrar-admin`, {
        method: 'POST',
        body: JSON.stringify(adminData),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al registrar administrador')
    }
    return await response.json()
}

/**
 * Remueve un admin de escuela.
 * Backend: DELETE /api/zona-educativa/admins/:id
 */
export const removerAdmin = async (adminId) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/zona-educativa/admins/${adminId}`, { method: 'DELETE' })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al remover administrador')
    }
    return await response.json()
}

// ═══════════════════════════════════════════════
// PROFESORES (gestión desde Zona Educativa)
// ═══════════════════════════════════════════════

/**
 * Registra un nuevo profesor (crea usuario + persona + profesor).
 * Backend: POST /api/zona-educativa/registrar-profesor
 * Expects: { username, contrasena, nombre, apellido, email_recuperacion, ci, telefono, especialidad, escuela_id }
 */
export const registrarProfesor = async (profesorData) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/zona-educativa/registrar-profesor`, {
        method: 'POST',
        body: JSON.stringify(profesorData),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al registrar profesor')
    }
    return await response.json()
}

/**
 * Asigna un usuario existente como profesor en una escuela.
 * Backend: POST /api/zona-educativa/asignar-profesor
 * Expects: { usuario_id, escuela_id, especialidad? }
 */
export const asignarProfesorEscuela = async (usuarioId, escuelaId, especialidad = null) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/zona-educativa/asignar-profesor`, {
        method: 'POST',
        body: JSON.stringify({ usuario_id: usuarioId, escuela_id: escuelaId, especialidad }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al asignar profesor')
    }
    return await response.json()
}

/**
 * Asigna el rol de zona_educativa a otro usuario.
 * Backend: POST /api/zona-educativa/asignar-zona
 * Expects: { usuario_id, cargo }
 */
export const asignarZonaEducativa = async (usuarioId, cargo) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/zona-educativa/asignar-zona`, {
        method: 'POST',
        body: JSON.stringify({ usuario_id: usuarioId, cargo }),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al asignar zona educativa')
    }
    return await response.json()
}

// ═══════════════════════════════════════════════
// TEMAS / CURRÍCULO
// ═══════════════════════════════════════════════

/**
 * Obtiene temas (con filtro por grado_id).
 * Backend: GET /api/zona-educativa/temas?grado_id=X
 * Returns: { temas: [...] }
 */
export const getTemas = async (gradoId = null) => {
    const base = getBaseURL()
    if (isLocalMode()) return []

    const params = gradoId ? `?grado_id=${gradoId}` : ''
    const response = await apiFetch(`${base}/zona-educativa/temas${params}`)
    if (!response.ok) throw new Error('Error al cargar temas')
    const data = await response.json()
    return data.temas || []
}

/**
 * Crea un nuevo tema del currículo.
 * Backend: POST /api/zona-educativa/temas
 * Expects: { grado_id, titulo, descripcion, material_pdf? }
 */
export const crearTema = async (temaData) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/zona-educativa/temas`, {
        method: 'POST',
        body: JSON.stringify(temaData),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al crear tema')
    }
    return await response.json()
}

/**
 * Actualiza un tema.
 * Backend: PUT /api/zona-educativa/temas/:id
 */
export const actualizarTema = async (temaId, updateData) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/zona-educativa/temas/${temaId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
    })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al actualizar tema')
    }
    return await response.json()
}

/**
 * Elimina un tema.
 * Backend: DELETE /api/zona-educativa/temas/:id
 */
export const eliminarTema = async (temaId) => {
    const base = getBaseURL()
    if (isLocalMode()) return null

    const response = await apiFetch(`${base}/zona-educativa/temas/${temaId}`, { method: 'DELETE' })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error al eliminar tema')
    }
    return await response.json()
}

// ═══════════════════════════════════════════════
// AUDITORÍA
// ═══════════════════════════════════════════════

/**
 * Obtiene logs de auditoría general.
 * Backend: GET /api/zona-educativa/auditoria?tabla=X&accion=X&usuario_id=X&desde=X&hasta=X&page=X&limit=X
 * Returns: { total, page, totalPages, logs: [...] }
 */
export const getAuditoria = async (filters = {}) => {
    const base = getBaseURL()
    if (isLocalMode()) return { total: 0, page: 1, totalPages: 0, logs: [] }

    const params = new URLSearchParams()
    if (filters.tabla) params.set('tabla', filters.tabla)
    if (filters.accion) params.set('accion', filters.accion)
    if (filters.usuario_id) params.set('usuario_id', filters.usuario_id)
    if (filters.desde) params.set('desde', filters.desde)
    if (filters.hasta) params.set('hasta', filters.hasta)
    if (filters.page) params.set('page', filters.page)
    if (filters.limit) params.set('limit', filters.limit)

    const queryStr = params.toString()
    const response = await apiFetch(`${base}/zona-educativa/auditoria${queryStr ? `?${queryStr}` : ''}`)
    if (!response.ok) throw new Error('Error al cargar auditoría')
    return await response.json()
}

// ═══════════════════════════════════════════════
// ESTADÍSTICAS / DESEMPEÑO
// ═══════════════════════════════════════════════

/**
 * Obtiene desempeño de estudiantes a nivel global.
 * Backend: GET /api/zona-educativa/desempeno/estudiantes?escuela_id=X&grado_id=X&periodo_escolar_id=X
 * Returns: { total_estudiantes, promedio_global, estudiantes: [...] }
 */
export const getDesempenoEstudiantes = async (filters = {}) => {
    const base = getBaseURL()
    if (isLocalMode()) return { total_estudiantes: 0, promedio_global: 0, estudiantes: [] }

    const params = new URLSearchParams()
    if (filters.escuela_id) params.set('escuela_id', filters.escuela_id)
    if (filters.grado_id) params.set('grado_id', filters.grado_id)
    if (filters.periodo_escolar_id) params.set('periodo_escolar_id', filters.periodo_escolar_id)

    const queryStr = params.toString()
    const response = await apiFetch(`${base}/zona-educativa/desempeno/estudiantes${queryStr ? `?${queryStr}` : ''}`)
    if (!response.ok) throw new Error('Error al cargar desempeño')
    return await response.json()
}

/**
 * Obtiene desempeño por escuela.
 * Backend: GET /api/zona-educativa/desempeno/escuelas
 * Returns: { escuelas: [{ escuela_id, nombre, total_estudiantes, total_entregas, promedio }] }
 */
export const getDesempenoEscuelas = async () => {
    const base = getBaseURL()
    if (isLocalMode()) return { escuelas: [] }

    const response = await apiFetch(`${base}/zona-educativa/desempeno/escuelas`)
    if (!response.ok) throw new Error('Error al cargar desempeño por escuelas')
    return await response.json()
}
