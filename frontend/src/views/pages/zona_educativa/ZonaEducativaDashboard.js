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

// ── Colores por estado ────────────────────────────────────────
const getBadgeColor = (accion) => {
  const map = { INSERT: 'success', UPDATE: 'warning', DELETE: 'danger', LOGIN: 'info', LOGOUT: 'secondary' }
  return map[accion] || 'primary'
}

// ── Hook genérico para fetch ──────────────────────────────────
const useFetch = (endpoint) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = async () => {
    setLoading(true)
    try {
      const res = await apiFetch(`${API()}${endpoint}`)
      const json = await res.json()
      setData(json)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { refetch() }, [endpoint])
  return { data, loading, error, refetch }
}

// ════════════════════════════════════════════════════════════
// TAB 1: GESTIÓN DE CONTENIDO (TEMAS)
// ════════════════════════════════════════════════════════════
const GestionContenido = () => {
  const { data: gradosData } = useFetch('/grados')
  const [temas, setTemas] = useState([])
  const [gradoFiltro, setGradoFiltro] = useState('')
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ grado_id: '', titulo: '', descripcion: '', material_pdf: '' })
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    const q = gradoFiltro ? `?grado_id=${gradoFiltro}` : ''
    apiFetch(`${API()}/zona-educativa/temas${q}`).then(r => r.json()).then(d => setTemas(d.temas || []))
  }, [gradoFiltro])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = editando ? 'PUT' : 'POST'
    const url = editando ? `${API()}/zona-educativa/temas/${editando.id}` : `${API()}/zona-educativa/temas`
    const res = await apiFetch(url, { method, body: JSON.stringify(form) })
    const data = await res.json()
    if (res.ok) {
      setMsg({ type: 'success', text: editando ? 'Tema actualizado' : 'Tema creado' })
      setModal(false); setEditando(null); setForm({ grado_id: '', titulo: '', descripcion: '', material_pdf: '' })
      const q = gradoFiltro ? `?grado_id=${gradoFiltro}` : ''
      apiFetch(`${API()}/zona-educativa/temas${q}`).then(r => r.json()).then(d => setTemas(d.temas || []))
    } else setMsg({ type: 'danger', text: data.error || 'Error' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este tema?')) return
    const res = await apiFetch(`${API()}/zona-educativa/temas/${id}`, { method: 'DELETE' })
    if (res.ok) setTemas(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div>
      {msg && <CAlert color={msg.type} dismissible onClose={() => setMsg(null)}>{msg.text}</CAlert>}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <CFormSelect style={{ maxWidth: 200 }} value={gradoFiltro} onChange={e => setGradoFiltro(e.target.value)}>
          <option value="">Todos los grados</option>
          {gradosData?.grados?.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
        </CFormSelect>
        <CButton color="primary" onClick={() => { setEditando(null); setForm({ grado_id: '', titulo: '', descripcion: '', material_pdf: '' }); setModal(true) }}>
          + Nuevo Tema
        </CButton>
      </div>

      <CTable responsive hover>
        <CTableHead style={{ background: '#f8f9fa' }}>
          <CTableRow>
            <CTableHeaderCell>Grado</CTableHeaderCell>
            <CTableHeaderCell>Título</CTableHeaderCell>
            <CTableHeaderCell>Descripción</CTableHeaderCell>
            <CTableHeaderCell>Acciones</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {temas.length === 0 ? (
            <CTableRow><CTableDataCell colSpan={4} className="text-center text-muted">Sin temas registrados</CTableDataCell></CTableRow>
          ) : temas.map(t => (
            <CTableRow key={t.id}>
              <CTableDataCell><CBadge color="info">{t.grado?.nombre}</CBadge></CTableDataCell>
              <CTableDataCell><strong>{t.titulo}</strong></CTableDataCell>
              <CTableDataCell style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.descripcion || '—'}</CTableDataCell>
              <CTableDataCell>
                <CButton size="sm" color="warning" className="me-2" onClick={() => { setEditando(t); setForm({ grado_id: t.grado_id, titulo: t.titulo, descripcion: t.descripcion || '', material_pdf: t.material_pdf || '' }); setModal(true) }}>Editar</CButton>
                <CButton size="sm" color="danger" onClick={() => handleDelete(t.id)}>Eliminar</CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CModal visible={modal} onClose={() => setModal(false)}>
        <CModalHeader><CModalTitle>{editando ? 'Editar Tema' : 'Nuevo Tema'}</CModalTitle></CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormSelect className="mb-3" value={form.grado_id} onChange={e => setForm(p => ({ ...p, grado_id: parseInt(e.target.value) }))} required>
              <option value="">Seleccionar grado...</option>
              {gradosData?.grados?.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
            </CFormSelect>
            <CFormInput className="mb-3" placeholder="Título del tema *" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} required />
            <CFormTextarea className="mb-3" rows={3} placeholder="Descripción" value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} />
            <CFormInput placeholder="URL del material PDF (opcional)" value={form.material_pdf} onChange={e => setForm(p => ({ ...p, material_pdf: e.target.value }))} />
            <CModalFooter className="px-0 pb-0 mt-3">
              <CButton color="secondary" onClick={() => setModal(false)}>Cancelar</CButton>
              <CButton type="submit" color="primary">{editando ? 'Actualizar' : 'Crear Tema'}</CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// TAB 2: GESTIÓN DE ADMINISTRADORES
// ════════════════════════════════════════════════════════════
const GestionAdmins = () => {
  const [admins, setAdmins] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const { data: escuelasData } = useFetch('/escuelas')
  const [form, setForm] = useState({ usuario_id: '', escuela_id: '' })
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    apiFetch(`${API()}/zona-educativa/admins`).then(r => r.json()).then(d => setAdmins(d.admins || []))
    apiFetch(`${API()}/usuarios`).then(r => r.json()).then(d => setUsuarios(d.usuarios || []))
  }, [])

  const handleAsignar = async (e) => {
    e.preventDefault()
    const res = await apiFetch(`${API()}/zona-educativa/admins`, { method: 'POST', body: JSON.stringify({ usuario_id: parseInt(form.usuario_id), escuela_id: parseInt(form.escuela_id) }) })
    const data = await res.json()
    if (res.ok) {
      setMsg({ type: 'success', text: 'Administrador asignado correctamente' })
      setAdmins(prev => [...prev, data.admin])
      setForm({ usuario_id: '', escuela_id: '' })
    } else setMsg({ type: 'danger', text: data.error || 'Error' })
  }

  const handleRemover = async (id) => {
    if (!window.confirm('¿Remover este administrador?')) return
    const res = await apiFetch(`${API()}/zona-educativa/admins/${id}`, { method: 'DELETE' })
    if (res.ok) setAdmins(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div>
      {msg && <CAlert color={msg.type} dismissible onClose={() => setMsg(null)}>{msg.text}</CAlert>}
      <CCard className="mb-4">
        <CCardHeader><strong>Asignar Nuevo Administrador de Escuela</strong></CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleAsignar}>
            <CRow>
              <CCol md={5}>
                <CFormSelect value={form.usuario_id} onChange={e => setForm(p => ({ ...p, usuario_id: e.target.value }))} required>
                  <option value="">Seleccionar usuario...</option>
                  {usuarios.map(u => <option key={u.id} value={u.id}>{u.persona?.nombre} {u.persona?.apellido} (@{u.username})</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={5}>
                <CFormSelect value={form.escuela_id} onChange={e => setForm(p => ({ ...p, escuela_id: e.target.value }))} required>
                  <option value="">Seleccionar escuela...</option>
                  {escuelasData?.escuelas?.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={2}><CButton type="submit" color="success" className="w-100">Asignar</CButton></CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>

      <CTable responsive hover>
        <CTableHead style={{ background: '#f8f9fa' }}>
          <CTableRow>
            <CTableHeaderCell>Nombre</CTableHeaderCell>
            <CTableHeaderCell>Username</CTableHeaderCell>
            <CTableHeaderCell>Escuela</CTableHeaderCell>
            <CTableHeaderCell>Acción</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {admins.map(a => (
            <CTableRow key={a.id}>
              <CTableDataCell>{a.usuario?.persona?.nombre} {a.usuario?.persona?.apellido}</CTableDataCell>
              <CTableDataCell>@{a.usuario?.username}</CTableDataCell>
              <CTableDataCell>{a.escuela?.nombre}</CTableDataCell>
              <CTableDataCell><CButton size="sm" color="danger" onClick={() => handleRemover(a.id)}>Remover</CButton></CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// TAB 3: AUDITORÍA GENERAL
// ════════════════════════════════════════════════════════════
const AuditoriaGeneral = () => {
  const [logs, setLogs] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filtros, setFiltros] = useState({ tabla: '', accion: '', desde: '', hasta: '' })
  const [loading, setLoading] = useState(false)

  const cargarLogs = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page, limit: 30, ...Object.fromEntries(Object.entries(filtros).filter(([, v]) => v)) })
    const res = await apiFetch(`${API()}/zona-educativa/auditoria?${params}`)
    const data = await res.json()
    setLogs(data.logs || [])
    setTotal(data.total || 0)
    setLoading(false)
  }

  useEffect(() => { cargarLogs() }, [page])

  return (
    <div>
      <CCard className="mb-3">
        <CCardBody>
          <CRow className="g-2">
            <CCol md={3}><CFormInput placeholder="Tabla (ej: temas)" value={filtros.tabla} onChange={e => setFiltros(p => ({ ...p, tabla: e.target.value }))} /></CCol>
            <CCol md={2}>
              <CFormSelect value={filtros.accion} onChange={e => setFiltros(p => ({ ...p, accion: e.target.value }))}>
                <option value="">Todas las acciones</option>
                {['INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'].map(a => <option key={a}>{a}</option>)}
              </CFormSelect>
            </CCol>
            <CCol md={2}><CFormInput type="date" value={filtros.desde} onChange={e => setFiltros(p => ({ ...p, desde: e.target.value }))} /></CCol>
            <CCol md={2}><CFormInput type="date" value={filtros.hasta} onChange={e => setFiltros(p => ({ ...p, hasta: e.target.value }))} /></CCol>
            <CCol md={2}><CButton color="primary" className="w-100" onClick={() => { setPage(1); cargarLogs() }}>Filtrar</CButton></CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <small className="text-muted d-block mb-2">Total: {total} registros</small>
      {loading ? <div className="text-center p-4"><CSpinner /></div> : (
        <CTable responsive hover small>
          <CTableHead style={{ background: '#f8f9fa' }}>
            <CTableRow>
              <CTableHeaderCell>Fecha</CTableHeaderCell>
              <CTableHeaderCell>Usuario</CTableHeaderCell>
              <CTableHeaderCell>Acción</CTableHeaderCell>
              <CTableHeaderCell>Tabla</CTableHeaderCell>
              <CTableHeaderCell>Reg. ID</CTableHeaderCell>
              <CTableHeaderCell>Datos Anteriores</CTableHeaderCell>
              <CTableHeaderCell>Datos Nuevos</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {logs.map(log => (
              <CTableRow key={log.id}>
                <CTableDataCell style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{new Date(log.created_at).toLocaleString('es-VE')}</CTableDataCell>
                <CTableDataCell style={{ fontSize: '0.85rem' }}>{log.usuario?.persona?.nombre || '—'} <small className="text-muted">(@{log.usuario?.username})</small></CTableDataCell>
                <CTableDataCell><CBadge color={getBadgeColor(log.accion)}>{log.accion}</CBadge></CTableDataCell>
                <CTableDataCell><code style={{ fontSize: '0.8rem' }}>{log.tabla}</code></CTableDataCell>
                <CTableDataCell>{log.registro_id || '—'}</CTableDataCell>
                <CTableDataCell><small style={{ color: '#c00', fontSize: '0.75rem' }}>{log.datos_anteriores ? JSON.stringify(log.datos_anteriores).slice(0, 80) + '...' : '—'}</small></CTableDataCell>
                <CTableDataCell><small style={{ color: '#050', fontSize: '0.75rem' }}>{log.datos_nuevos ? JSON.stringify(log.datos_nuevos).slice(0, 80) + '...' : '—'}</small></CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}
      <div className="d-flex gap-2 mt-2">
        <CButton size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Anterior</CButton>
        <CButton size="sm" onClick={() => setPage(p => p + 1)}>Siguiente →</CButton>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// TAB 4: DESEMPEÑO
// ════════════════════════════════════════════════════════════
const DesempenoGlobal = () => {
  const [escuelas, setEscuelas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch(`${API()}/zona-educativa/desempeno/escuelas`)
      .then(r => r.json()).then(d => { setEscuelas(d.escuelas || []); setLoading(false) })
  }, [])

  if (loading) return <div className="text-center p-4"><CSpinner /></div>

  return (
    <div>
      <CTable responsive hover>
        <CTableHead style={{ background: '#f8f9fa' }}>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Escuela</CTableHeaderCell>
            <CTableHeaderCell>Estudiantes</CTableHeaderCell>
            <CTableHeaderCell>Total Entregas</CTableHeaderCell>
            <CTableHeaderCell>Promedio General</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {escuelas.map((e, i) => (
            <CTableRow key={e.escuela_id}>
              <CTableDataCell>{i + 1}</CTableDataCell>
              <CTableDataCell><strong>{e.nombre}</strong></CTableDataCell>
              <CTableDataCell>{e.total_estudiantes}</CTableDataCell>
              <CTableDataCell>{e.total_entregas}</CTableDataCell>
              <CTableDataCell>
                <CBadge color={e.promedio >= 14 ? 'success' : e.promedio >= 10 ? 'warning' : 'danger'} style={{ fontSize: '0.9rem' }}>
                  {e.promedio ?? 'Sin datos'}
                </CBadge>
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
const ZonaEducativaDashboard = () => {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { label: '📚 Currículo', component: <GestionContenido /> },
    { label: '🏫 Administradores', component: <GestionAdmins /> },
    { label: '🔍 Auditoría General', component: <AuditoriaGeneral /> },
    { label: '📊 Desempeño Escuelas', component: <DesempenoGlobal /> },
  ]

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #003893, #002766)', color: '#FFD100', padding: '20px 24px', borderRadius: '12px', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontWeight: 700 }}>🏛️ Zona Educativa</h2>
        <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: '0.9rem' }}>Gestión curricular y supervisión institucional</p>
      </div>

      <CCard>
        <CCardHeader style={{ padding: 0, borderBottom: '2px solid #dee2e6' }}>
          <CNav variant="tabs">
            {tabs.map((t, i) => (
              <CNavItem key={i}>
                <CNavLink
                  active={activeTab === i}
                  onClick={() => setActiveTab(i)}
                  style={{ cursor: 'pointer', fontWeight: activeTab === i ? 700 : 400 }}
                >
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

export default ZonaEducativaDashboard
