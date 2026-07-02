import React, { useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBook,
  cilUser,
  cilSchool,
  cilSettings,
  cilHome,
  cilChatBubble,
  cilChart,
  cilCheckCircle,
  cilInfo,
} from '@coreui/icons'

const UserManualModal = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState(1)

  // Estilos personalizados integrados para garantizar una estética premium
  const customStyles = {
    modalHeader: {
      background: 'linear-gradient(135deg, #1f4068 0%, #162447 100%)',
      color: '#ffffff',
      borderBottom: 'none',
      padding: '1.5rem',
    },
    title: {
      fontWeight: '700',
      letterSpacing: '0.5px',
      display: 'flex',
      alignItems: 'center',
    },
    navLink: (active) => ({
      cursor: 'pointer',
      fontWeight: '600',
      borderRadius: '8px',
      margin: '0 4px',
      transition: 'all 0.3s ease',
      color: active ? '#ffffff' : '#6c757d',
      backgroundColor: active ? '#1f4068' : 'transparent',
      boxShadow: active ? '0 4px 15px rgba(31, 64, 104, 0.2)' : 'none',
      border: 'none',
    }),
    cardHover: {
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      borderRadius: '12px',
      border: '1px solid rgba(0,0,0,0.08)',
    },
    accentBadge: {
      background: 'linear-gradient(45deg, #e94560, #ff6b8b)',
      color: '#fff',
      padding: '0.4rem 0.8rem',
      borderRadius: '30px',
      fontSize: '0.8rem',
    },
  }

  return (
    <CModal size="xl" visible={visible} onClose={onClose} scrollable className="user-manual-modal">
      <CModalHeader style={customStyles.modalHeader} className="text-white">
        <CModalTitle style={customStyles.title}>
          <CIcon icon={cilBook} className="me-3" size="xl" />
          Manual de Usuario: Plataforma Educativa de Historia de Venezuela IA
        </CModalTitle>
      </CModalHeader>
      
      <CModalBody className="bg-light-opacity p-4">
        {/* Pestañas superiores para navegación dinámica */}
        <CNav variant="pills" className="justify-content-center mb-4 p-2 bg-white rounded shadow-sm">
          <CNavItem>
            <CNavLink
              active={activeTab === 1}
              onClick={() => setActiveTab(1)}
              style={customStyles.navLink(activeTab === 1)}
            >
              <CIcon icon={cilHome} className="me-2" />
              General
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 2}
              onClick={() => setActiveTab(2)}
              style={customStyles.navLink(activeTab === 2)}
            >
              <CIcon icon={cilUser} className="me-2" />
              Estudiante
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 3}
              onClick={() => setActiveTab(3)}
              style={customStyles.navLink(activeTab === 3)}
            >
              <CIcon icon={cilSchool} className="me-2" />
              Profesor
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 4}
              onClick={() => setActiveTab(4)}
              style={customStyles.navLink(activeTab === 4)}
            >
              <CIcon icon={cilSettings} className="me-2" />
              Administración
            </CNavLink>
          </CNavItem>
        </CNav>

        {/* Contenido de cada pestaña */}
        <CTabContent>
          
          {/* PESTAÑA 1: BIENVENIDA Y GENERAL */}
          <CTabPane visible={activeTab === 1}>
            <div className="p-2">
              <div className="text-center mb-4">
                <CBadge style={customStyles.accentBadge}>¡Bienvenido al Futuro de la Educación!</CBadge>
                <h3 className="mt-2 fw-bold text-dark">Aprendizaje Inteligente de la Historia Venezolana</h3>
                <p className="text-muted mx-auto" style={{ maxWidth: '750px' }}>
                  Esta plataforma fusiona la riqueza de la historia de Venezuela con inteligencia artificial de vanguardia, 
                  ofreciendo un entorno educativo adaptativo y gamificado para estudiantes, profesores e instituciones.
                </p>
              </div>

              <CRow className="g-4">
                <CCol md={6}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0">
                    <CCardBody className="p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                          <CIcon icon={cilChatBubble} className="text-primary" size="lg" />
                        </div>
                        <h5 className="mb-0 fw-bold">Adaptabilidad con IA</h5>
                      </div>
                      <p className="text-muted">
                        Nuestro chatbot inteligente adapta dinámicamente sus respuestas sobre Historia de Venezuela 
                        al nivel escolar del estudiante y a su estilo de aprendizaje preferido:
                      </p>
                      <ul className="text-muted ps-3">
                        <li><strong>Visual:</strong> Respuestas enriquecidas con descripciones visuales detalladas, esquemas y líneas temporales.</li>
                        <li><strong>Auditivo:</strong> Narraciones claras, diálogos interactivos y explicaciones en formato de historia contada.</li>
                        <li><strong>Kinestésico:</strong> Retos prácticos, analogías dinámicas y escenarios interactivos de toma de decisiones.</li>
                      </ul>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={6}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0">
                    <CCardBody className="p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                          <CIcon icon={cilChart} className="text-success" size="lg" />
                        </div>
                        <h5 className="mb-0 fw-bold">Gamificación y Progreso</h5>
                      </div>
                      <p className="text-muted">
                        El aprendizaje se potencia a través de dinámicas lúdicas:
                      </p>
                      <ul className="text-muted ps-3">
                        <li><strong>Exámenes Gamificados:</strong> Quizzes interactivos autogenerados por la IA en base al rendimiento del estudiante.</li>
                        <li><strong>Línea de Tiempo Interactiva:</strong> Viaja a través de los hitos cruciales de nuestra historia patria de manera visual.</li>
                        <li><strong>Viajes de Campo Virtuales:</strong> Explora lugares históricos de Venezuela de forma inmersiva desde tu pantalla.</li>
                        <li><strong>Seguimiento en Tiempo Real:</strong> Monitoreo constante del desempeño con retroalimentación automática.</li>
                      </ul>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </div>
          </CTabPane>

          {/* PESTAÑA 2: ESTUDIANTE */}
          <CTabPane visible={activeTab === 2}>
            <div className="p-2">
              <h4 className="fw-bold mb-3 text-primary d-flex align-items-center">
                <CIcon icon={cilUser} className="me-2" /> Portal del Estudiante
              </h4>
              <p className="text-muted mb-4">
                Como estudiante, tu panel está diseñado para hacer del estudio de la historia una experiencia fascinante e interactiva. Aquí te explicamos tus principales herramientas:
              </p>

              <div className="timeline-steps">
                <div className="d-flex mb-4">
                  <div className="me-3 text-center">
                    <span className="badge bg-primary rounded-circle p-3 d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}>1</span>
                  </div>
                  <div>
                    <h5 className="fw-bold">Chatear con la IA de Historia</h5>
                    <p className="text-muted">
                      Accede al chat e interactúa con el Tutor de IA. Puedes hacer preguntas como <em>"¿Cómo fue la Campaña Admirable?"</em> o pedir que te explique un tema difícil. La IA te responderá usando tu <strong>estilo de aprendizaje</strong> configurado (Visual, Auditivo o Kinestésico) para que lo entiendas a la perfección.
                    </p>
                  </div>
                </div>

                <div className="d-flex mb-4">
                  <div className="me-3 text-center">
                    <span className="badge bg-primary rounded-circle p-3 d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}>2</span>
                  </div>
                  <div>
                    <h5 className="fw-bold">Explorar el Contenido Interactivo</h5>
                    <p className="text-muted">
                      Visita el menú de <strong>Contenido Interactivo</strong> para aprender jugando:
                    </p>
                    <ul className="text-muted ps-3">
                      <li><strong>Línea de Tiempo:</strong> Haz clic en los eventos históricos clave (como la Declaración de Independencia o la Batalla de Carabobo) para ver detalles y resúmenes multimedia.</li>
                      <li><strong>Viajes de Campo Virtuales:</strong> Visita monumentos emblemáticos nacionales de forma virtual.</li>
                    </ul>
                  </div>
                </div>

                <div className="d-flex mb-4">
                  <div className="me-3 text-center">
                    <span className="badge bg-primary rounded-circle p-3 d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}>3</span>
                  </div>
                  <div>
                    <h5 className="fw-bold">Tomar Exámenes Gamificados</h5>
                    <p className="text-muted">
                      Pon a prueba tus conocimientos con quizzes de 5 preguntas autogenerados por la IA en tiempo real. 
                      ¡Obtén puntuaciones perfectas de 20 puntos para demostrar tu dominio y desbloquear nuevos retos!
                    </p>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="me-3 text-center">
                    <span className="badge bg-primary rounded-circle p-3 d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}>4</span>
                  </div>
                  <div>
                    <h5 className="fw-bold">Verificar tu Historial y Progreso</h5>
                    <p className="text-muted">
                      En la sección de <strong>Calificaciones y Progreso</strong> podrás ver gráficos detallados de tu evolución, promedio de notas y las áreas que necesitas repasar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CTabPane>

          {/* PESTAÑA 3: PROFESOR */}
          <CTabPane visible={activeTab === 3}>
            <div className="p-2">
              <h4 className="fw-bold mb-3 text-success d-flex align-items-center">
                <CIcon icon={cilSchool} className="me-2" /> Portal del Profesor
              </h4>
              <p className="text-muted mb-4">
                La plataforma empodera a los educadores con potentes herramientas de seguimiento pedagógico y control sobre los parámetros de aprendizaje del estudiante.
              </p>

              <CRow className="g-4">
                <CCol md={6}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0">
                    <CCardBody>
                      <h5 className="fw-bold text-success mb-3">🔍 Monitoreo y Diagnóstico Pedagógico</h5>
                      <p className="text-muted">
                        Visualiza los grados y secciones bajo tu tutela. Al hacer clic en un estudiante, abrirás el 
                        <strong> Panel de Progreso</strong>, que muestra:
                      </p>
                      <ul className="text-muted ps-3">
                        <li>El estilo de aprendizaje detectado del estudiante.</li>
                        <li>Estadísticas de quizzes completados, promedio acumulado de calificaciones y nivel de desempeño.</li>
                        <li>Gráficos detallados de rendimiento por tema específico de Historia de Venezuela.</li>
                      </ul>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={6}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0">
                    <CCardBody>
                      <h5 className="fw-bold text-success mb-3">⚙️ Configuración Personalizada de IA</h5>
                      <p className="text-muted">
                        Como profesor, tienes control sobre el Tutor de IA para guiar la experiencia de tus estudiantes:
                      </p>
                      <ul className="text-muted ps-3">
                        <li><strong>Ajuste de Dificultad:</strong> Configura la complejidad pedagógica según el grado y las necesidades de la sección.</li>
                        <li><strong>Parámetros Temáticos:</strong> Prioriza épocas específicas (ej. Período Precolombino, Época de la Colonia, Gesta Emancipadora, República de Venezuela) en las conversaciones del chatbot.</li>
                      </ul>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </div>
          </CTabPane>

          {/* PESTAÑA 4: ADMINISTRACIÓN */}
          <CTabPane visible={activeTab === 4}>
            <div className="p-2">
              <h4 className="fw-bold mb-3 text-dark d-flex align-items-center">
                <CIcon icon={cilSettings} className="me-2" /> Roles de Administración y Gestión
              </h4>
              <p className="text-muted mb-4">
                La estructura del sistema incluye roles administrativos clave para coordinar la infraestructura escolar a nivel local y estatal.
              </p>

              <CRow className="g-4">
                <CCol md={6}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0">
                    <CCardBody>
                      <h5 className="fw-bold text-dark mb-3">🏢 Administración de la Escuela</h5>
                      <p className="text-muted">
                        El <strong>Admin de Escuela</strong> gestiona el corazón del plantel educativo:
                      </p>
                      <ul className="text-muted ps-3">
                        <li><strong>Registro de Personal:</strong> Da de alta y gestiona las cuentas de los profesores pertenecientes al plantel.</li>
                        <li><strong>Gestión de Matrícula:</strong> Registra a los estudiantes en sus grados, secciones y estilos de aprendizaje.</li>
                        <li><strong>Asignaciones:</strong> Vincula a los docentes con los grados que imparten clases de historia.</li>
                      </ul>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={6}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0">
                    <CCardBody>
                      <h5 className="fw-bold text-dark mb-3">🇻🇪 Zona Educativa</h5>
                      <p className="text-muted">
                        El nivel máximo de supervisión y gobernanza a nivel estatal:
                      </p>
                      <ul className="text-muted ps-3">
                        <li><strong>Control de Escuelas:</strong> Registra y audita las instituciones educativas bajo su jurisdicción.</li>
                        <li><strong>Asignación Directiva:</strong> Designa y administra las cuentas de los Directores / Administradores de las Escuelas.</li>
                        <li><strong>Métricas de Alto Nivel:</strong> Monitorea estadísticas globales de uso de la IA, rendimiento académico por zona y efectividad educativa.</li>
                      </ul>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </div>
          </CTabPane>

        </CTabContent>
      </CModalBody>
      
      <CModalFooter className="bg-light border-top-0 d-flex justify-content-between p-3">
        <div className="d-flex align-items-center text-muted small">
          <CIcon icon={cilInfo} className="me-1" />
          <span>Manual de Usuario - Versión 2.0 (Inteligencia Artificial Adaptativa)</span>
        </div>
        <CButton color="primary" onClick={onClose} style={{ borderRadius: '8px', padding: '0.5rem 1.5rem', fontWeight: '600' }}>
          <CIcon icon={cilCheckCircle} className="me-2" /> Entendido
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default UserManualModal
