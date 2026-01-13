import React from 'react'
import { Link } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CAvatar,
  CWidgetStatsF,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilList,
  cilCloudUpload,
  cilCommentSquare,
  cilPlus,
  cilArrowRight,
} from '@coreui/icons'

const TeacherDashboard = () => {
  return (
    <div className="teacher-dashboard-welcome">
      <CCard className="mb-4 shadow-sm border-0 bg-white">
        <CCardBody className="p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="welcome-message">
              <h2 className="text-secondary fw-bold mb-1">Bienvenido, Prof. Carlos Rodríguez</h2>
              <p className="text-muted mb-0">Panel de control y acceso rápido a tus herramientas.</p>
            </div>
            <div className="user-info d-flex align-items-center mt-3 mt-md-0">
              <div
                className="user-avatar rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2"
                style={{ width: '50px', height: '50px', backgroundColor: '#00247d', fontSize: '1.2em' }}
              >
                CR
              </div>
              <span className="fw-semibold text-dark">Prof. Carlos Rodríguez</span>
            </div>
          </div>
        </CCardBody>
      </CCard>

      <h4 className="mb-3 text-secondary">Acceso Rápido</h4>
      <CRow>
        <CCol xs={12} sm={6} lg={3}>
          <Link to="/teacher/content" className="text-decoration-none">
            <CCard className="mb-4 shadow-sm h-100 hover-effect border-top-primary border-top-3">
              <CCardBody className="d-flex flex-column align-items-center text-center p-4">
                <div className="p-3 bg-light rounded-circle mb-3 text-primary">
                  <CIcon icon={cilList} size="xl" />
                </div>
                <h5 className="text-dark">Gestión de Contenido</h5>
                <p className="text-muted small">Administra lecciones y materiales.</p>
                <div className="mt-auto text-primary fw-semibold d-flex align-items-center">
                  Acceder <CIcon icon={cilArrowRight} size="sm" className="ms-1" />
                </div>
              </CCardBody>
            </CCard>
          </Link>
        </CCol>

        <CCol xs={12} sm={6} lg={3}>
          <Link to="/teacher/upload-grades" className="text-decoration-none">
            <CCard className="mb-4 shadow-sm h-100 hover-effect border-top-info border-top-3">
              <CCardBody className="d-flex flex-column align-items-center text-center p-4">
                <div className="p-3 bg-light rounded-circle mb-3 text-info">
                  <CIcon icon={cilCloudUpload} size="xl" />
                </div>
                <h5 className="text-dark">Subir Notas</h5>
                <p className="text-muted small">Registra calificaciones de estudiantes.</p>
                <div className="mt-auto text-info fw-semibold d-flex align-items-center">
                  Acceder <CIcon icon={cilArrowRight} size="sm" className="ms-1" />
                </div>
              </CCardBody>
            </CCard>
          </Link>
        </CCol>

        <CCol xs={12} sm={6} lg={3}>
          <Link to="/teacher/feedback" className="text-decoration-none">
            <CCard className="mb-4 shadow-sm h-100 hover-effect border-top-warning border-top-3">
              <CCardBody className="d-flex flex-column align-items-center text-center p-4">
                <div className="p-3 bg-light rounded-circle mb-3 text-warning">
                  <CIcon icon={cilCommentSquare} size="xl" />
                </div>
                <h5 className="text-dark">Retroalimentación</h5>
                <p className="text-muted small">Envía comentarios y sugerencias.</p>
                <div className="mt-auto text-warning fw-semibold d-flex align-items-center">
                  Acceder <CIcon icon={cilArrowRight} size="sm" className="ms-1" />
                </div>
              </CCardBody>
            </CCard>
          </Link>
        </CCol>

        <CCol xs={12} sm={6} lg={3}>
          <Link to="/teacher/add-content" className="text-decoration-none">
            <CCard className="mb-4 shadow-sm h-100 hover-effect border-top-success border-top-3">
              <CCardBody className="d-flex flex-column align-items-center text-center p-4">
                <div className="p-3 bg-light rounded-circle mb-3 text-success">
                  <CIcon icon={cilPlus} size="xl" />
                </div>
                <h5 className="text-dark">Agregar Contenido</h5>
                <p className="text-muted small">Crea nuevo material educativo.</p>
                <div className="mt-auto text-success fw-semibold d-flex align-items-center">
                  Acceder <CIcon icon={cilArrowRight} size="sm" className="ms-1" />
                </div>
              </CCardBody>
            </CCard>
          </Link>
        </CCol>
      </CRow>
    </div>
  )
}

export default TeacherDashboard