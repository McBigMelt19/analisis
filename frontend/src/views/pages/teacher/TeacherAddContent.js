import React, { useState, useEffect } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CButton,
    CForm,
    CFormLabel,
    CFormSelect,
    CFormInput,
    CFormTextarea,
    CAlert,
    CSpinner,
    CRow,
    CCol,
} from '@coreui/react'
import { useAuth } from '../../../context/AuthContext'
import { apiFetch, getBaseURL } from '../../../services/api.config'

const API = () => getBaseURL()

const TeacherAddContent = () => {
    const { currentUser } = useAuth()
    const [contentType, setContentType] = useState('')
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState(null)

    // Datos de referencia
    const [temas, setTemas] = useState([])
    const [periodos, setPeriodos] = useState([])

    // Form para Sesión
    const [sesionForm, setSesionForm] = useState({ tema_id: '', periodo_escolar_id: '', fecha: '', resumen: '' })

    // Form para Asignación
    const [asignacionForm, setAsignacionForm] = useState({ sesion_id: '', tipo: 'tarea', titulo: '', descripcion: '', ponderacion: '', fecha_limite: '' })
    const [sesiones, setSesiones] = useState([])

    useEffect(() => {
        // Cargar temas disponibles
        apiFetch(`${API()}/temas`).then(r => r.json()).then(d => setTemas(d.temas || []))
        // Cargar períodos escolares
        apiFetch(`${API()}/zona-educativa/periodos`).then(r => r.json()).then(d => setPeriodos(d.periodos || [])).catch(() => {})
    }, [])

    useEffect(() => {
        if (contentType === 'asignacion') {
            // Cargar sesiones del profesor
            apiFetch(`${API()}/sesiones`).then(r => r.json()).then(d => setSesiones(d.sesiones || []))
        }
    }, [contentType])

    const handleCrearSesion = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMsg(null)
        try {
            const res = await apiFetch(`${API()}/sesiones`, {
                method: 'POST',
                body: JSON.stringify({
                    tema_id: parseInt(sesionForm.tema_id),
                    periodo_escolar_id: parseInt(sesionForm.periodo_escolar_id),
                    fecha: sesionForm.fecha,
                    resumen: sesionForm.resumen,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                setMsg({ type: 'success', text: '✅ Sesión creada exitosamente' })
                setSesionForm({ tema_id: '', periodo_escolar_id: '', fecha: '', resumen: '' })
            } else {
                setMsg({ type: 'danger', text: data.error || 'Error al crear sesión' })
            }
        } catch (err) {
            setMsg({ type: 'danger', text: 'Error de red' })
        } finally {
            setLoading(false)
        }
    }

    const handleCrearAsignacion = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMsg(null)
        try {
            const res = await apiFetch(`${API()}/asignaciones`, {
                method: 'POST',
                body: JSON.stringify({
                    sesion_id: parseInt(asignacionForm.sesion_id),
                    tipo: asignacionForm.tipo,
                    titulo: asignacionForm.titulo,
                    descripcion: asignacionForm.descripcion,
                    ponderacion: parseFloat(asignacionForm.ponderacion) || 0,
                    fecha_limite: asignacionForm.fecha_limite,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                setMsg({ type: 'success', text: '✅ Asignación creada exitosamente' })
                setAsignacionForm({ sesion_id: '', tipo: 'tarea', titulo: '', descripcion: '', ponderacion: '', fecha_limite: '' })
            } else {
                setMsg({ type: 'danger', text: data.error || 'Error al crear asignación' })
            }
        } catch (err) {
            setMsg({ type: 'danger', text: 'Error de red' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="teacher-add-content">
            <div style={{ background: 'linear-gradient(135deg, #003893, #002766)', color: '#FFD100', padding: '20px 24px', borderRadius: '12px', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontWeight: 700 }}>📝 Agregar Nuevo Contenido</h2>
                <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: '0.9rem' }}>Crea sesiones de clase y asignaciones para tus estudiantes</p>
            </div>

            {msg && <CAlert color={msg.type} dismissible onClose={() => setMsg(null)}>{msg.text}</CAlert>}

            <CCard className="mb-4">
                <CCardBody>
                    <CFormLabel className="fw-bold">¿Qué deseas crear?</CFormLabel>
                    <CFormSelect value={contentType} onChange={e => setContentType(e.target.value)}>
                        <option value="">-- Selecciona el tipo --</option>
                        <option value="sesion">📅 Sesión de Clase</option>
                        <option value="asignacion">📋 Asignación (Tarea/Prueba)</option>
                    </CFormSelect>
                </CCardBody>
            </CCard>

            {/* ── FORMULARIO DE SESIÓN ── */}
            {contentType === 'sesion' && (
                <CCard className="shadow-sm">
                    <CCardHeader style={{ background: '#004587', color: '#fff' }}>
                        <strong>📅 Nueva Sesión de Clase</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CForm onSubmit={handleCrearSesion}>
                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <CFormLabel>Tema *</CFormLabel>
                                    <CFormSelect value={sesionForm.tema_id} onChange={e => setSesionForm(p => ({ ...p, tema_id: e.target.value }))} required>
                                        <option value="">Seleccionar tema...</option>
                                        {temas.map(t => <option key={t.id} value={t.id}>{t.titulo} ({t.grado?.nombre || `Grado ${t.grado_id}`})</option>)}
                                    </CFormSelect>
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel>Período Escolar *</CFormLabel>
                                    <CFormSelect value={sesionForm.periodo_escolar_id} onChange={e => setSesionForm(p => ({ ...p, periodo_escolar_id: e.target.value }))} required>
                                        <option value="">Seleccionar período...</option>
                                        {periodos.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.activo ? '(Activo)' : ''}</option>)}
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <CFormLabel>Fecha de la Sesión *</CFormLabel>
                                    <CFormInput type="date" value={sesionForm.fecha} onChange={e => setSesionForm(p => ({ ...p, fecha: e.target.value }))} required />
                                </CCol>
                            </CRow>
                            <div className="mb-3">
                                <CFormLabel>Resumen / Notas de Clase</CFormLabel>
                                <CFormTextarea rows={3} placeholder="Resumen de lo que se cubrirá en la sesión..." value={sesionForm.resumen} onChange={e => setSesionForm(p => ({ ...p, resumen: e.target.value }))} />
                            </div>
                            <CButton type="submit" color="primary" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : 'Crear Sesión'}
                            </CButton>
                        </CForm>
                    </CCardBody>
                </CCard>
            )}

            {/* ── FORMULARIO DE ASIGNACIÓN ── */}
            {contentType === 'asignacion' && (
                <CCard className="shadow-sm">
                    <CCardHeader style={{ background: '#006699', color: '#fff' }}>
                        <strong>📋 Nueva Asignación</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CForm onSubmit={handleCrearAsignacion}>
                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <CFormLabel>Sesión de Clase *</CFormLabel>
                                    <CFormSelect value={asignacionForm.sesion_id} onChange={e => setAsignacionForm(p => ({ ...p, sesion_id: e.target.value }))} required>
                                        <option value="">Seleccionar sesión...</option>
                                        {sesiones.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.tema?.titulo || `Sesión #${s.id}`} — {s.fecha ? new Date(s.fecha).toLocaleDateString('es-VE') : ''}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel>Tipo *</CFormLabel>
                                    <CFormSelect value={asignacionForm.tipo} onChange={e => setAsignacionForm(p => ({ ...p, tipo: e.target.value }))}>
                                        <option value="tarea">Tarea</option>
                                        <option value="prueba">Prueba</option>
                                        <option value="proyecto">Proyecto</option>
                                        <option value="exposicion">Exposición</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <div className="mb-3">
                                <CFormLabel>Título *</CFormLabel>
                                <CFormInput placeholder="Título de la asignación" value={asignacionForm.titulo} onChange={e => setAsignacionForm(p => ({ ...p, titulo: e.target.value }))} required />
                            </div>
                            <div className="mb-3">
                                <CFormLabel>Descripción</CFormLabel>
                                <CFormTextarea rows={3} placeholder="Instrucciones para el estudiante..." value={asignacionForm.descripcion} onChange={e => setAsignacionForm(p => ({ ...p, descripcion: e.target.value }))} />
                            </div>
                            <CRow className="mb-3">
                                <CCol md={6}>
                                    <CFormLabel>Ponderación (puntos)</CFormLabel>
                                    <CFormInput type="number" min="0" max="100" placeholder="Ej: 20" value={asignacionForm.ponderacion} onChange={e => setAsignacionForm(p => ({ ...p, ponderacion: e.target.value }))} />
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel>Fecha Límite *</CFormLabel>
                                    <CFormInput type="date" value={asignacionForm.fecha_limite} onChange={e => setAsignacionForm(p => ({ ...p, fecha_limite: e.target.value }))} required />
                                </CCol>
                            </CRow>
                            <CButton type="submit" color="primary" disabled={loading}>
                                {loading ? <CSpinner size="sm" /> : 'Crear Asignación'}
                            </CButton>
                        </CForm>
                    </CCardBody>
                </CCard>
            )}
        </div>
    )
}

export default TeacherAddContent
