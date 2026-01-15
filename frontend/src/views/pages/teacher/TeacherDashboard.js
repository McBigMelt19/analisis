import React, { useState, useEffect } from 'react'
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
import { useAuth } from '../../../context/AuthContext'
import StudentProgressModal from '../../../components/StudentProgressModal'

const TeacherDashboard = () => {
  const { currentUser } = useAuth()
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