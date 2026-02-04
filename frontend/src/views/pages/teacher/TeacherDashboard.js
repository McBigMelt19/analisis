import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CBadge,
  CSpinner,
  CAvatar,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBook,
  cilClipboard,
  cilCommentSquare,
  cilCloudUpload,
  cilChartLine,
} from '@coreui/icons'
import { useAuth } from '../../../context/AuthContext'
import StudentProgressModal from '../../../components/StudentProgressModal'

const TeacherDashboard = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    if (currentUser && currentUser.role === 'teacher') {
      fetchStudents()
    }
  }, [currentUser])

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users?role=student&grade_id=${currentUser.grade_id}`,
      )

      if (!response.ok) {
        throw new Error('Error al cargar estudiantes')
      }

      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Error cargando estudiantes:', error)
      setError('No se pudieron cargar los estudiantes. Verifica que json-server esté corriendo.')
    } finally {
      setLoading(false)
    }
  }

  const getLearningStyleColor = (style) => {
    switch (style) {
      case 'Visual':
        return 'info'
      case 'Auditivo':
        return 'warning'
      case 'Kinestésico':
        return 'success'
      default:
        return 'secondary'
    }
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const openProgressModal = (student) => {
    setSelectedStudent(student)
    setModalVisible(true)
  }

  // Tarjetas de navegación rápida
  const quickAccessCards = [
    {
      title: 'Contenidos',
      description: 'Ver y gestionar contenidos educativos',
      icon: cilBook,
      color: 'primary',
      path: '/teacher/content',
      gradient: 'linear-gradient(135deg, #004587 0%, #0066cc 100%)',
    },
    {
      title: 'Calificaciones',
      description: 'Subir y gestionar calificaciones',
      icon: cilClipboard,
      color: 'success',
      path: '/teacher/upload-grades',
      gradient: 'linear-gradient(135deg, #FFC72C 0%, #FFD966 100%)',
    },
    {
      title: 'Retroalimentación',
      description: 'Dar feedback a estudiantes',
      icon: cilCommentSquare,
      color: 'warning',
      path: '/teacher/feedback',
      gradient: 'linear-gradient(135deg, #E64A19 0%, #FF6B3D 100%)',
    },
    {
      title: 'Agregar Contenido',
      description: 'Subir nuevo material educativo',
      icon: cilCloudUpload,
      color: 'info',
      path: '/teacher/add-content',
      gradient: 'linear-gradient(135deg, #006699 0%, #0088cc 100%)',
    },
  ]

  if (!currentUser || currentUser.role !== 'teacher') {
    return <div className="alert alert-warning m-4">Esta página es solo para profesores.</div>
  }

  if (loading) {
    return (
      <div className="text-center p-5">
        <CSpinner color="primary" />
        <p className="mt-3 text-muted">Cargando dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4">
        {error}
        <br />
        <small>
          Ejecuta: <code>npm run server</code>
        </small>
      </div>
    )
  }

  return (
    <div>
      <CRow className="mb-4">
        <CCol>
          <h2>Bienvenido, {currentUser.name}</h2>
          <p className="text-muted">Grado: {currentUser.grade_id}°</p>
        </CCol>
      </CRow>

      {/* Tarjetas de Acceso Rápido */}
      <CRow className="mb-4">
        {quickAccessCards.map((card, index) => (
          <CCol xs={12} sm={6} lg={3} key={index} className="mb-3">
            <CCard
              className="h-100 shadow-sm border-0"
              style={{
                background: card.gradient,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onClick={() => navigate(card.path)}
            >
              <CCardBody className="text-center text-white p-4">
                <div className="mb-3">
                  <CIcon icon={card.icon} size="3xl" />
                </div>
                <h5 className="fw-bold mb-2">{card.title}</h5>
                <p className="small mb-0" style={{ opacity: 0.9 }}>
                  {card.description}
                </p>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      <CCard>
        <CCardHeader>
          <strong>Mis Estudiantes ({students.length})</strong>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Estudiante</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Estilo de Aprendizaje</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {students.map((student) => (
                <CTableRow key={student.id}>
                  <CTableDataCell>
                    <div className="d-flex align-items-center">
                      <CAvatar color="primary" textColor="white" className="me-2">
                        {getInitials(student.name)}
                      </CAvatar>
                      <strong>{student.name}</strong>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>{student.email}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getLearningStyleColor(student.learning_style)}>
                      {student.learning_style}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" size="sm" onClick={() => openProgressModal(student)}>
                      Ver Progreso
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal de Progreso */}
      {selectedStudent && (
        <StudentProgressModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          studentId={selectedStudent.id}
        />
      )}
    </div>
  )
}

export default TeacherDashboard