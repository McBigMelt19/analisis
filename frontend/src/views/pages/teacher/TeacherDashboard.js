import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
} from '@coreui/react'
import { auto } from '@popperjs/core'

const TeacherDashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Determina la sección activa por la ruta
  const getSectionFromPath = (pathname) => {
    if (pathname.includes('/teacher/upload-grades')) return 'upload-grades'
    if (pathname.includes('/teacher/feedback')) return 'feedback'
    if (pathname.includes('/teacher/add-content')) return 'add-content'
    return 'content'
  }

  const section = getSectionFromPath(location.pathname)

  useEffect(() => {
    // Si alguien accede a /teacher, redirigimos a /teacher/content
    if (location.pathname === '/teacher' || location.pathname === '/teacher/') {
      navigate('/teacher/content', { replace: true })
    }
  }, [location.pathname])

  return (
    <CContainer className="py-4">
      <CRow>
        <CCol>
          <div className="dashboard-header bg-white p-3 mb-3 d-flex justify-content-between align-items-center shadow-sm rounded">
            <div>
              <h2 className="h4 mb-0 text-primary">Módulo del Profesor</h2>
              <p className="mb-0 text-medium-emphasis">Panel de control para gestionar contenidos y evaluaciones</p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="user-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>CR</div>
              <div>Prof. Rosa Rodríguez</div>
            </div>
          </div>
        </CCol>
      </CRow>

      <CRow className="dashboard-content">

        <CCol xs={auto} >
          <div className="main-content bg-white p-4 rounded shadow-sm">
            {section === 'content' && (
              <section id="content">
                <h3 className="section-title text-primary">Gestión de Contenido</h3>
                <p>Desde aquí puedes gestionar todo el contenido educativo disponible para los estudiantes.</p>

                <div className="row row-cols-1 row-cols-md-3 g-3 mt-3">
                  <div className="col">
                    <CCard className="h-100">
                      <CCardBody>
                        <CCardTitle>Lecciones Publicadas</CCardTitle>
                        <CCardText>Gestiona las lecciones que están disponibles para los estudiantes.</CCardText>
                        <CButton color="primary">Ver Lecciones</CButton>
                      </CCardBody>
                    </CCard>
                  </div>

                  <div className="col">
                    <CCard className="h-100">
                      <CCardBody>
                        <CCardTitle>Material de Apoyo</CCardTitle>
                        <CCardText>Documentos, presentaciones y recursos adicionales para los estudiantes.</CCardText>
                        <CButton color="primary">Gestionar Material</CButton>
                      </CCardBody>
                    </CCard>
                  </div>

                  <div className="col">
                    <CCard className="h-100">
                      <CCardBody>
                        <CCardTitle>Actividades</CCardTitle>
                        <CCardText>Ejercicios, tareas y actividades de aprendizaje.</CCardText>
                        <CButton color="primary">Ver Actividades</CButton>
                      </CCardBody>
                    </CCard>
                  </div>
                </div>

                <div className="table-container mt-4">
                  <h5>Contenido Reciente</h5>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Título</th>
                          <th>Tipo</th>
                          <th>Fecha de Publicación</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Independencia de Venezuela</td>
                          <td>Lección</td>
                          <td>15/03/2025</td>
                          <td>Publicado</td>
                          <td>
                            <CButton size="sm" className="me-2">Editar</CButton>
                            <CButton size="sm" color="danger">Eliminar</CButton>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {section === 'upload-grades' && (
              <section id="upload-grades">
                <h3 className="section-title text-primary">Subir Notas</h3>
                <p>Gestiona y actualiza las calificaciones de los estudiantes.</p>
                <div className="mb-3">
                  <label className="form-label">Seleccionar Estudiante</label>
                  <select className="form-select">
                    <option>-- Selecciona un estudiante --</option>
                    <option>María González</option>
                    <option>José Martínez</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Calificación (0-20)</label>
                  <input type="number" className="form-control" min="0" max="20" step="0.5" />
                </div>
                <CButton color="primary">Guardar Calificación</CButton>
              </section>
            )}

            {section === 'feedback' && (
              <section id="feedback">
                <h3 className="section-title text-primary">Retroalimentación</h3>
                <p>Proporciona comentarios y sugerencias a los estudiantes sobre su desempeño.</p>
                <div className="mb-3">
                  <label className="form-label">Seleccionar Estudiante</label>
                  <select className="form-select">
                    <option>-- Selecciona un estudiante --</option>
                    <option>María González</option>
                    <option>José Martínez</option>
                  </select>
                <label className="form-label">Forma de aprendizaje del  Estudiante</label>
                  <select className="form-select">
                    <option>-- Seleccione la forma --</option>
                    <option>Auditivo</option>
                    <option>Visual</option>
                    <option>Kinestesico</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Retroalimentación</label>
                  <textarea className="form-control" rows="5" />
                </div>
                <CButton color="primary">Enviar Retroalimentación</CButton>
              </section>
            )}

            {section === 'add-content' && (
              <section id="add-content">
                <h3 className="section-title text-primary">Agregar Nuevo Contenido</h3>
                <p>Crea y publica nuevo material educativo para los estudiantes.</p>
                <div className="mb-3">
                  <label className="form-label">Tipo de Contenido</label>
                  <select className="form-select">
                    <option>Lección</option>
                    <option>Material de Apoyo</option>
                    <option>Actividad</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Título</label>
                  <input className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-control" rows="4" />
                </div>
                <CButton color="primary">Guardar Contenido</CButton>
              </section>
            )}
          </div>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default TeacherDashboard
