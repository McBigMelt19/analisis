import React, { useState, useEffect } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CNav, CNavItem, CNavLink,
  CTabContent, CTabPane, CButton, CForm, CFormInput, CFormSelect,
  CFormTextarea, CTable, CTableHead, CTableRow, CTableHeaderCell,
  CTableBody, CTableDataCell, CBadge, CAlert, CSpinner, CModal,
  CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/react'
import { apiFetch, getBaseURL } from '../../../services/api.config'

const API = () => getBaseURL()

// ════════════════════════════════════════════════════════════
// TAB 1: GESTIÓN DE PROFESORES
// ════════════════════════════════════════════════════════════
const GestionProfesores = () => {
  const [profesores, setProfesores] = useState([])
  const [grados, setGrados] = useState([])
  const [periodos, setPeriodos] = useState([])
  const [form, setForm] = useState({ profesor_id: '', grado_id: '', periodo_escolar_id: '' })
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiFetch(`${API()}/admin-escuela/profesores`).then(r => r.json()),
      apiFetch(`${API()}/grados`).then(r => r.json()),
      apiFetch(`${API()}/zona-educativa/periodos`).then(r => r.json()),
    ]).then(([p, g, pe]) => {
      setProfesores(p.profesores || [])
      setGrados(g.grados || [])
      setPeriodos(pe.periodos || [])
      setLoading(false)
    })
  }, [])

  const handleAsignar = async (e) => {
    e.preventDefault()
    const res = await apiFetch(`${API()}/admin-escuela/asignar-profesor`, {
      method: 'POST',
      body: JSON.stringify({ profesor_id: parseInt(form.profesor_id), grado_id: parseInt(form.grado_id), periodo_escolar_id: parseInt(form.periodo_escolar_id) })
    })
    const data = await res.json()
    if (res.ok) { setMsg({ type: 'success', text: 'Profesor asignado al grado' }); setForm({ profesor_id: '', grado_id: '', periodo_escolar_id: '' }) }
    else setMsg({ type: 'danger', text: data.error || 'Error al asignar' })
  }

  if (loading) return <div className="text-center p-4"><CSpinner /></div>

  return (
    <div>
      {msg && <CAlert color={msg.type} dismissible onClose={() => setMsg(null)}>{msg.text}</CAlert>}
      <CCard className="mb-4">
        <CCardHeader><strong>Asignar Profesor a Grado</strong></CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleAsignar}>
            <CRow className="g-2">
              <CCol md={4}>
                <CFormSelect value={form.profesor_id} onChange={e => setForm(p => ({ ...p, profesor_id: e.target.value }))} required>
                  <option value="">Seleccionar profesor...</option>
                  {profesores.map(p => <option key={p.id} value={p.id}>{p.usuario?.persona?.nombre} {p.usuario?.persona?.apellido}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect value={form.grado_id} onChange={e => setForm(p => ({ ...p, grado_id: e.target.value }))} required>
                  <option value="">Seleccionar grado...</option>
                  {grados.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect value={form.periodo_escolar_id} onChange={e => setForm(p => ({ ...p, periodo_escolar_id: e.target.value }))} required>
                  <option value="">Seleccionar período...</option>
                  {periodos.map(pe => <option key={pe.id} value={pe.id}>{pe.nombre}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={2}><CButton type="submit" color="success" className="w-100">Asignar</CButton></CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>

      <h5 className="mb-3">Profesores de la Escuela</h5>
      <CTable responsive hover>
        <CTableHead style={{ background: '#f8f9fa' }}>
          <CTableRow>
            <CTableHeaderCell>Nombre</CTableHeaderCell>
            <CTableHeaderCell>Username</CTableHeaderCell>
            <CTableHeaderCell>Especialidad</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {profesores.map(p => (
            <CTableRow key={p.id}>
              <CTableDataCell>{p.usuario?.persona?.nombre} {p.usuario?.persona?.apellido}</CTableDataCell>
              <CTableDataCell><code>@{p.usuario?.username}</code></CTableDataCell>
              <CTableDataCell>{p.especialidad || '—'}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// TAB 2: PREVISUALIZACIÓN DEL CURRÍCULO
// ════════════════════════════════════════════════════════════
const PrevisualizacionCurriculo = () => {
  const [temas, setTemas] = useState([])
  const [gradoFiltro, setGradoFiltro] = useState('')
  const [grados, setGrados] = useState([])

  useEffect(() => {
    apiFetch(`${API()}/grados`).then(r => r.json()).then(d => setGrados(d.grados || []))
  }, [])

  useEffect(() => {
    const q = gradoFiltro ? `?grado_id=${gradoFiltro}` : ''
    apiFetch(`${API()}/admin-escuela/curriculo${q}`).then(r => r.json()).then(d => setTemas(d.temas || []))
  }, [gradoFiltro])

  return (
    <div>
      <CAlert color="info" className="mb-3">
        📖 <strong>Vista de solo lectura.</strong> El contenido curricular lo define y actualiza la Zona Educativa.
      </CAlert>
      <div className="mb-3">
        <CFormSelect style={{ maxWidth: 220 }} value={gradoFiltro} onChange={e => setGradoFiltro(e.target.value)}>
          <option value="">Todos los grados</option>
          {grados.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
        </CFormSelect>
      </div>
      <CRow>
        {temas.map(t => (
          <CCol key={t.id} md={6} lg={4} className="mb-3">
            <CCard style={{ borderLeft: '4px solid #003893' }}>
              <CCardBody>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <CBadge color="primary">{t.grado?.nombre}</CBadge>
                </div>
                <h6 style={{ fontWeight: 700 }}>{t.titulo}</h6>
                {t.descripcion && <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>{t.descripcion.slice(0, 120)}{t.descripcion.length > 120 ? '...' : ''}</p>}
                {t.material_pdf && <a href={t.material_pdf} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#003893' }}>📄 Ver material</a>}
              </CCardBody>
            </CCard>
          </CCol>
        ))}
        {temas.length === 0 && <CCol><p className="text-muted text-center p-4">Sin temas para el filtro seleccionado</p></CCol>}
      </CRow>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// TAB 3: REGISTRO DE ESTUDIANTES
// ════════════════════════════════════════════════════════════
const RegistroEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([])
  const [grados, setGrados] = useState([])
  const [periodos, setPeriodos] = useState([])
  const [modal, setModal] = useState(false)
  const [msg, setMsg] = useState(null)
  const [form, setForm] = useState({
    username: '', contrasena: '', nombre: '', apellido: '', ci: '',
    representante_nombre: '', representante_email: '', representante_telefono: '',
    relacion_representante: 'tutor', grado_id: '', periodo_escolar_id: ''
  })

  useEffect(() => {
    apiFetch(`${API()}/admin-escuela/estudiantes`).then(r => r.json()).then(d => setEstudiantes(d.estudiantes || []))
    apiFetch(`${API()}/grados`).then(r => r.json()).then(d => setGrados(d.grados || []))
    apiFetch(`${API()}/zona-educativa/periodos`).then(r => r.json()).then(d => setPeriodos(d.periodos || []))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, grado_id: form.grado_id ? parseInt(form.grado_id) : undefined, periodo_escolar_id: form.periodo_escolar_id ? parseInt(form.periodo_escolar_id) : undefined }
    const res = await apiFetch(`${API()}/admin-escuela/registrar-estudiante`, { method: 'POST', body: JSON.stringify(payload) })
    const data = await res.json()
    if (res.ok) {
      setMsg({ type: 'success', text: `✅ Estudiante creado. Username: @${data.credenciales?.username}` })
      setModal(false)
      apiFetch(`${API()}/admin-escuela/estudiantes`).then(r => r.json()).then(d => setEstudiantes(d.estudiantes || []))
    } else setMsg({ type: 'danger', text: data.error || 'Error al registrar' })
  }

  return (
    <div>
      {msg && <CAlert color={msg.type} dismissible onClose={() => setMsg(null)}>{msg.text}</CAlert>}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <strong>Total: {estudiantes.length} estudiantes</strong>
        <CButton color="primary" onClick={() => setModal(true)}>+ Registrar Estudiante</CButton>
      </div>
      <CTable responsive hover>
        <CTableHead style={{ background: '#f8f9fa' }}>
          <CTableRow>
            <CTableHeaderCell>Nombre</CTableHeaderCell>
            <CTableHeaderCell>Username</CTableHeaderCell>
            <CTableHeaderCell>Grado</CTableHeaderCell>
            <CTableHeaderCell>Representante</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {estudiantes.map(e => (
            <CTableRow key={e.id}>
              <CTableDataCell>{e.usuario?.persona?.nombre} {e.usuario?.persona?.apellido}</CTableDataCell>
              <CTableDataCell><code>@{e.usuario?.username}</code></CTableDataCell>
              <CTableDataCell>{e.matriculas?.[0]?.grado?.nombre || <span className="text-muted">Sin matrícula</span>}</CTableDataCell>
              <CTableDataCell>{e.representante?.nombre_completo}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CModal visible={modal} onClose={() => setModal(false)} size="lg">
        <CModalHeader><CModalTitle>Registrar Nuevo Estudiante</CModalTitle></CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <h6 className="text-muted mb-2">DATOS DE ACCESO</h6>
            <CRow className="mb-3">
              <CCol md={6}><CFormInput placeholder="Username *" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required /></CCol>
              <CCol md={6}><CFormInput type="password" placeholder="Contraseña *" value={form.contrasena} onChange={e => setForm(p => ({ ...p, contrasena: e.target.value }))} required /></CCol>
            </CRow>
            <h6 className="text-muted mb-2">DATOS PERSONALES</h6>
            <CRow className="mb-3">
              <CCol md={6}><CFormInput placeholder="Nombre *" value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} required /></CCol>
              <CCol md={6}><CFormInput placeholder="Apellido *" value={form.apellido} onChange={e => setForm(p => ({ ...p, apellido: e.target.value }))} required /></CCol>
            </CRow>
            <CFormInput className="mb-3" placeholder="Cédula (opcional, ej: V-12345678)" value={form.ci} onChange={e => setForm(p => ({ ...p, ci: e.target.value }))} />
            <h6 className="text-muted mb-2">REPRESENTANTE</h6>
            <CRow className="mb-3">
              <CCol md={6}><CFormInput placeholder="Nombre completo del representante *" value={form.representante_nombre} onChange={e => setForm(p => ({ ...p, representante_nombre: e.target.value }))} required /></CCol>
              <CCol md={6}><CFormInput type="email" placeholder="Email del representante *" value={form.representante_email} onChange={e => setForm(p => ({ ...p, representante_email: e.target.value }))} required /></CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormSelect value={form.relacion_representante} onChange={e => setForm(p => ({ ...p, relacion_representante: e.target.value }))}>
                  {['madre', 'padre', 'tutor', 'tio', 'abuelo', 'otro'].map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </CFormSelect>
              </CCol>
            </CRow>
            <h6 className="text-muted mb-2">MATRÍCULA (opcional)</h6>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormSelect value={form.grado_id} onChange={e => setForm(p => ({ ...p, grado_id: e.target.value }))}>
                  <option value="">Sin matrícula por ahora</option>
                  {grados.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormSelect value={form.periodo_escolar_id} onChange={e => setForm(p => ({ ...p, periodo_escolar_id: e.target.value }))}>
                  <option value="">Seleccionar período...</option>
                  {periodos.map(pe => <option key={pe.id} value={pe.id}>{pe.nombre}</option>)}
                </CFormSelect>
              </CCol>
            </CRow>
            <CModalFooter className="px-0 pb-0">
              <CButton color="secondary" onClick={() => setModal(false)}>Cancelar</CButton>
              <CButton type="submit" color="primary">Registrar Estudiante</CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// TAB 4: AUDITORÍA DE PROFESORES (NOTAS)
// ════════════════════════════════════════════════════════════
const AuditoriaProfesores = () => {
  const [resumen, setResumen] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch(`${API()}/admin-escuela/notas-profesores`)
      .then(r => r.json()).then(d => { setResumen(d.resumen_profesores || []); setLoading(false) })
  }, [])

  if (loading) return <div className="text-center p-4"><CSpinner /></div>

  return (
    <div>
      <CTable responsive hover>
        <CTableHead style={{ background: '#f8f9fa' }}>
          <CTableRow>
            <CTableHeaderCell>Profesor</CTableHeaderCell>
            <CTableHeaderCell>Especialidad</CTableHeaderCell>
            <CTableHeaderCell>Sesiones</CTableHeaderCell>
            <CTableHeaderCell>Calificaciones Registradas</CTableHeaderCell>
            <CTableHeaderCell>Promedio de Notas</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {resumen.map(p => (
            <CTableRow key={p.profesor_id}>
              <CTableDataCell><strong>{p.nombre}</strong></CTableDataCell>
              <CTableDataCell>{p.especialidad || '—'}</CTableDataCell>
              <CTableDataCell>{p.total_sesiones}</CTableDataCell>
              <CTableDataCell>{p.total_calificaciones}</CTableDataCell>
              <CTableDataCell>
                {p.promedio_notas != null
                  ? <CBadge color={p.promedio_notas >= 14 ? 'success' : p.promedio_notas >= 10 ? 'warning' : 'danger'}>{p.promedio_notas}</CBadge>
                  : <span className="text-muted">Sin calificaciones</span>}
              </CTableDataCell>
            </CTableRow>
          ))}
          {resumen.length === 0 && <CTableRow><CTableDataCell colSpan={5} className="text-center text-muted">Sin datos disponibles</CTableDataCell></CTableRow>}
        </CTableBody>
      </CTable>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// TAB 5: DESEMPEÑO DE ESTUDIANTES
// ════════════════════════════════════════════════════════════
const DesempenoEstudiantes = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch(`${API()}/admin-escuela/desempeno-estudiantes`)
      .then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return <div className="text-center p-4"><CSpinner /></div>

  return (
    <div>
      <CAlert color="info" className="mb-3">Total: <strong>{data?.total}</strong> estudiantes con entregas calificadas</CAlert>
      <CTable responsive hover>
        <CTableHead style={{ background: '#f8f9fa' }}>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Estudiante</CTableHeaderCell>
            <CTableHeaderCell>Username</CTableHeaderCell>
            <CTableHeaderCell>Grado</CTableHeaderCell>
            <CTableHeaderCell>Entregas</CTableHeaderCell>
            <CTableHeaderCell>Promedio</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data?.estudiantes?.map((e, i) => (
            <CTableRow key={e.estudiante_id}>
              <CTableDataCell>{i + 1}</CTableDataCell>
              <CTableDataCell><strong>{e.nombre}</strong></CTableDataCell>
              <CTableDataCell><code>@{e.username}</code></CTableDataCell>
              <CTableDataCell>{e.grado}</CTableDataCell>
              <CTableDataCell>{e.total_entregas}</CTableDataCell>
              <CTableDataCell>
                {e.promedio != null
                  ? <CBadge color={e.promedio >= 14 ? 'success' : e.promedio >= 10 ? 'warning' : 'danger'}>{e.promedio}</CBadge>
                  : <span className="text-muted">—</span>}
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════════
const AdminEscuelaDashboard = () => {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { label: '👩‍🏫 Profesores', component: <GestionProfesores /> },
    { label: '📚 Currículo', component: <PrevisualizacionCurriculo /> },
    { label: '🎓 Estudiantes', component: <RegistroEstudiantes /> },
    { label: '📝 Auditoría Notas', component: <AuditoriaProfesores /> },
    { label: '📊 Desempeño', component: <DesempenoEstudiantes /> },
  ]

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #CF142B, #A0102B)', color: '#FFD100', padding: '20px 24px', borderRadius: '12px', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontWeight: 700 }}>🏫 Administración de Escuela</h2>
        <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: '0.9rem' }}>Gestión de profesores, estudiantes y auditoría de desempeño</p>
      </div>
      <CCard>
        <CCardHeader style={{ padding: 0, borderBottom: '2px solid #dee2e6' }}>
          <CNav variant="tabs">
            {tabs.map((t, i) => (
              <CNavItem key={i}>
                <CNavLink active={activeTab === i} onClick={() => setActiveTab(i)} style={{ cursor: 'pointer', fontWeight: activeTab === i ? 700 : 400 }}>
                  {t.label}
                </CNavLink>
              </CNavItem>
            ))}
          </CNav>
        </CCardHeader>
        <CCardBody>
          <CTabContent>
            {tabs.map((t, i) => (
              <CTabPane key={i} visible={activeTab === i}>
                {activeTab === i && t.component}
              </CTabPane>
            ))}
          </CTabContent>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default AdminEscuelaDashboard
