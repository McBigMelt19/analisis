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
                Como estudiante, cuentas con un panel diseñado para hacer del aprendizaje de la Historia de Venezuela una experiencia inmersiva y adaptativa. A continuación, se detallan las funciones de cada módulo y modal:
              </p>

              <CRow className="g-4 mb-4">
                <CCol md={12}>
                  <h5 className="fw-bold text-primary mb-3">🖥️ Módulos Principales (Secciones y Pantallas)</h5>
                </CCol>
                
                <CCol md={6}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0">
                    <CCardBody className="p-4">
                      <h6 className="fw-bold text-primary mb-2">🏠 Inicio / Dashboard</h6>
                      <p className="text-muted small mb-0">
                        Tu punto de partida personalizado. Muestra un saludo dinámico, una ilustración temática de Venezuela y accesos rápidos a tus últimas lecciones. Además, te indica tu Estilo de Aprendizaje actual para guiarte en el estudio.
                      </p>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={6}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0">
                    <CCardBody className="p-4">
                      <h6 className="fw-bold text-primary mb-2">🤖 Chatbot de IA Adaptativo</h6>
                      <p className="text-muted small mb-0">
                        Un tutor virtual inteligente con el que puedes chatear para consultar cualquier tema histórico. Adapta sus explicaciones (lenguaje, metáforas y recursos) a tu **Estilo de Aprendizaje**:
                      </p>
                      <ul className="text-muted small ps-3 mt-2 mb-0">
                        <li><strong>Visual:</strong> Respuestas enriquecidas con esquemas detallados, descripciones gráficas e hitos estructurados.</li>
                        <li><strong>Auditivo:</strong> Narraciones claras, metáforas poéticas o explicaciones tipo cuento dialogado.</li>
                        <li><strong>Kinestésico:</strong> Retos prácticos, analogías con la vida cotidiana y decisiones históricas hipotéticas.</li>
                      </ul>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={6}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0">
                    <CCardBody className="p-4">
                      <h6 className="fw-bold text-primary mb-2">🎮 Contenido Interactivo</h6>
                      <p className="text-muted small mb-0">
                        Tu espacio de exploración multimedia e interactiva, donde accedes a dos herramientas didácticas:
                      </p>
                      <ul className="text-muted small ps-3 mt-2 mb-0">
                        <li><strong>Línea de Tiempo Interactiva:</strong> Viaja cronológicamente a través de los hitos cruciales de Venezuela (Independencia, Batallas, etc.) y haz clic en ellos para ver explicaciones.</li>
                        <li><strong>Viajes de Campo Virtuales:</strong> Recorre monumentos históricos y lugares patrios emblemáticos de forma interactiva.</li>
                      </ul>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={6}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0">
                    <CCardBody className="p-4">
                      <h6 className="fw-bold text-primary mb-2">📊 Mi Progreso y Calificaciones</h6>
                      <p className="text-muted small mb-0">
                        Un espacio visual donde puedes consultar tus calificaciones históricas asentadas por tus docentes o acumuladas en las actividades gamificadas. Muestra tus promedios, porcentajes de logro y gráficos de evolución.
                      </p>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              <CRow className="g-4">
                <CCol md={12}>
                  <h5 className="fw-bold text-primary mb-3">🪟 Modales Interactivos (Ventanas Emergentes)</h5>
                </CCol>

                <CCol md={6}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0 border-start border-primary border-3">
                    <CCardBody className="p-4">
                      <h6 className="fw-bold text-primary mb-2">📝 Modal de Examen (Quizzes de IA)</h6>
                      <p className="text-muted small mb-0">
                        Ventana emergente interactiva autogenerada por la IA al iniciar un quiz. Presenta un cuestionario interactivo de 5 preguntas de selección múltiple sobre la Historia de Venezuela. Al finalizar, calcula tu nota de inmediato en una escala de 20 puntos y te ofrece retroalimentación detallada de tus respuestas.
                      </p>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={6}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0 border-start border-primary border-3">
                    <CCardBody className="p-4">
                      <h6 className="fw-bold text-primary mb-2">📖 Modal de Manual de Usuario</h6>
                      <p className="text-muted small mb-0">
                        Este modal informativo (en el que te encuentras) que despliega la guía didáctica de la plataforma en cualquier momento desde el encabezado superior para resolver tus dudas sobre la navegación y el rol escolar.
                      </p>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </div>
          </CTabPane>

          {/* PESTAÑA 3: PROFESOR */}
          <CTabPane visible={activeTab === 3}>
            <div className="p-2">
              <h4 className="fw-bold mb-3 text-success d-flex align-items-center">
                <CIcon icon={cilSchool} className="me-2" /> Portal del Profesor
              </h4>
              <p className="text-muted mb-4">
                Como docente, dispones de herramientas avanzadas para la gestión del aula virtual y el control del comportamiento pedagógico de la Inteligencia Artificial:
              </p>

              <CRow className="g-4 mb-4">
                <CCol md={12}>
                  <h5 className="fw-bold text-success mb-3">🖥️ Módulos Principales (Secciones y Pantallas)</h5>
                </CCol>

                <CCol md={4}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0">
                    <CCardBody className="p-4">
                      <h6 className="fw-bold text-success mb-2">🏠 Inicio / Dashboard Docente</h6>
                      <p className="text-muted small mb-0">
                        Vista globalizada que muestra tu grado escolar a cargo, tarjetas estadísticas rápidas de acceso directo y el listado general de tus estudiantes matriculados con su respectivo estilo de aprendizaje detectado.
                      </p>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={4}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0">
                    <CCardBody className="p-4">
                      <h6 className="fw-bold text-success mb-2">📚 Gestión y Carga de Contenido</h6>
                      <p className="text-muted small mb-0">
                        Sección donde administras y visualizas la lista de temas y unidades curriculares de historia nacional. Permite añadir nuevos textos, lecturas de apoyo y pautas generales para actualizar la base de conocimientos.
                      </p>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={4}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0">
                    <CCardBody className="p-4">
                      <h6 className="fw-bold text-success mb-2">✍️ Calificaciones y Feedback</h6>
                      <p className="text-muted small mb-0">
                        Módulos integrados de <strong>Subir Notas</strong> para ingresar manualmente las calificaciones de tareas tradicionales, y <strong>Retroalimentación</strong> para enviar observaciones y consejos personalizados que los alumnos verán directamente en sus perfiles.
                      </p>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>

              <CRow className="g-4">
                <CCol md={12}>
                  <h5 className="fw-bold text-success mb-3">🪟 Modales Interactivos (Ventanas Emergentes)</h5>
                </CCol>

                <CCol md={6}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0 border-start border-success border-3">
                    <CCardBody className="p-4">
                      <h6 className="fw-bold text-success mb-2">👤 Modal de Registro de Estudiante</h6>
                      <p className="text-muted small mb-0">
                        Formulario interactivo en dos pasos que permite matricular alumnos de forma ágil y segura:
                      </p>
                      <ul className="text-muted small ps-3 mt-2 mb-0">
                        <li><strong>Paso 1 (Representante):</strong> Datos de contacto del adulto responsable (Cédula, nombre, correo, teléfono).</li>
                        <li><strong>Paso 2 (Estudiante):</strong> Registro de los datos del alumno (Cédula opcional, nombre, grado, parentesco). El sistema genera automáticamente el nombre de usuario y una clave temporal de 6 dígitos.</li>
                      </ul>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={6}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0 border-start border-success border-3">
                    <CCardBody className="p-4">
                      <h6 className="fw-bold text-success mb-2">📊 Modal de Progreso Estudiantil (Detalles del Alumno)</h6>
                      <p className="text-muted small mb-0">
                        Se despliega al hacer clic en "Ver Progreso" de cualquier estudiante. Muestra en tiempo real:
                      </p>
                      <ul className="text-muted small ps-3 mt-2 mb-0">
                        <li>Estadísticas rápidas: total de evaluaciones, promedio académico general, notas de excelencia (&gt;=18) e insuficiencias (&lt;14).</li>
                        <li>Gráficos analíticos de rendimiento histórico por cada tema curricular.</li>
                        <li>Historial detallado con fecha, actividad, tipo, nota y estado (Aprobado, Excelente, Necesita repasar).</li>
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
                El sistema cuenta con un ecosistema de gobernanza multinivel que garantiza la correcta administración de la infraestructura escolar y el monitoreo pedagógico general:
              </p>

              <CRow className="g-4 mb-4">
                <CCol md={6}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0">
                    <CCardBody className="p-4">
                      <h5 className="fw-bold text-dark mb-3">🏫 Administración de la Escuela (Director/Subdirector)</h5>
                      <h6 className="fw-semibold text-muted">🖥️ Módulos:</h6>
                      <p className="text-muted small">
                        <strong>Dashboard de Gestión Escolar:</strong> Panel principal para supervisar la matrícula escolar global del plantel, revisar la nómina de profesores activos, grados y secciones configuradas.
                      </p>
                      <h6 className="fw-semibold text-muted">🪟 Modales:</h6>
                      <p className="text-muted small mb-0">
                        <strong>Modal de Registro de Estudiante:</strong> Ventana emergente idéntica a la del profesor, permitiendo al administrador registrar estudiantes junto con sus representantes de manera institucional.
                      </p>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CCol md={6}>
                  <CCard style={customStyles.cardHover} className="h-100 shadow-sm border-0">
                    <CCardBody className="p-4">
                      <h5 className="fw-bold text-dark mb-3">🏛️ Zona Educativa (Super Admin Regional)</h5>
                      <h6 className="fw-semibold text-muted">🖥️ Módulos:</h6>
                      <p className="text-muted small">
                        <strong>Dashboard de Control de Zona:</strong> Centro de mando a nivel estatal. Audita las escuelas activas de su zona, visualiza tasas globales de interacción con la Inteligencia Artificial y estadísticas académicas agregadas.
                      </p>
                      <h6 className="fw-semibold text-muted">🪟 Modales:</h6>
                      <ul className="text-muted small ps-3 mb-0">
                        <li><strong>Registrar Administrador de Escuela:</strong> Modal para crear cuentas a Directores escolares y asignarlos a planteles.</li>
                        <li><strong>Registrar Profesor:</strong> Modal para dar de alta docentes e integrarlos en la base general de la Zona Educativa.</li>
                        <li><strong>Malla Curricular (Crear/Editar Tema):</strong> Modal para agregar o corregir los temas oficiales de la Historia de Venezuela que regirán el comportamiento de los tutores de IA.</li>
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
