import React, { useState, useEffect, useMemo } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CSpinner,
  CBadge,
  CProgress,
  CProgressBar,
  CAlert,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilChart,
  cilStar,
  cilCheckCircle,
  cilWarning,
  cilXCircle,
  cilCalendar,
} from '@coreui/icons'
import { useAuth } from '../../../context/AuthContext'

const StudentGrades = () => {
  const { currentUser } = useAuth()
  const [progressData, setProgressData] = useState([])
  const [gradeName, setGradeName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (currentUser && currentUser.role === 'student') {
      fetchGrades()
    }
  }, [currentUser])

  const fetchGrades = async () => {
    setLoading(true)
    setError('')
    try {
      // Obtener las notas del estudiante
      const progressRes = await fetch(
        `http://localhost:3001/progress?student_id=${currentUser.id}`,
      )
      if (!progressRes.ok) throw new Error('Error al obtener las notas')
      const progressList = await progressRes.json()
      setProgressData(progressList)

      // Obtener el nombre del grado
      const gradeRes = await fetch(
        `http://localhost:3001/grades?id=${currentUser.grade_id}`,
      )
      if (gradeRes.ok) {
        const gradeData = await gradeRes.json()
        if (gradeData.length > 0) {
          setGradeName(gradeData[0].name)
        }
      }
    } catch (err) {
      console.error('Error cargando notas:', err)
      setError('No se pudieron cargar las notas. Verifica que el servidor esté activo.')
    } finally {
      setLoading(false)
    }
  }

  // Separar por tipo de actividad
  const evaluaciones = useMemo(
    () => progressData.filter((p) => p.activity_type === 'evaluacion'),
    [progressData],
  )
  const quizzes = useMemo(
    () => progressData.filter((p) => p.activity_type === 'quiz'),
    [progressData],
  )
  const actividades = useMemo(
    () => progressData.filter((p) => p.activity_type === 'activity'),
    [progressData],
  )

  // Calcular promedios
  const calcPromedio = (items) => {
    if (items.length === 0) return 0
    const total = items.reduce((sum, item) => {
      // Normalizar a escala 20
      const normalized = (item.score / item.max_score) * 20
      return sum + normalized
    }, 0)
    return (total / items.length).toFixed(1)
  }

  const promedioEval = calcPromedio(evaluaciones)
  const promedioQuiz = calcPromedio(quizzes)
  const promedioAct = calcPromedio(actividades)
  const promedioGeneral = calcPromedio(progressData)

  // Función para obtener color y label según la nota (escala 1-20)
  const getGradeInfo = (score, maxScore) => {
    const normalized = (score / maxScore) * 20
    if (normalized >= 18) return { color: 'success', label: 'Excelente', emoji: '🌟' }
    if (normalized >= 14) return { color: 'warning', label: 'Aprobado', emoji: '✅' }
    if (normalized >= 10) return { color: 'info', label: 'Regular', emoji: '📘' }
    return { color: 'danger', label: 'Necesita Mejorar', emoji: '📕' }
  }

  const getProgressColor = (value) => {
    if (value >= 18) return 'success'
    if (value >= 14) return 'warning'
    if (value >= 10) return 'info'
    return 'danger'
  }

  // Formatear fecha
  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-VE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  // Tipo de actividad legible
  const getActivityLabel = (type) => {
    switch (type) {
      case 'evaluacion':
        return { label: 'Evaluación', color: 'primary', icon: '📝' }
      case 'quiz':
        return { label: 'Quiz', color: 'info', icon: '🧩' }
      case 'activity':
        return { label: 'Actividad', color: 'success', icon: '🎯' }
      default:
        return { label: type, color: 'secondary', icon: '📋' }
    }
  }

  if (!currentUser || currentUser.role !== 'student') {
    return (
      <CAlert color="warning" className="m-4">
        Esta página es solo para estudiantes.
      </CAlert>
    )
  }

  if (loading) {
    return (
      <div className="text-center p-5">
        <CSpinner color="primary" />
        <p className="mt-3 text-muted">Cargando tus notas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <CAlert color="danger" className="m-4">
        {error}
        <br />
        <small>
          Ejecuta: <code>npm run server</code>
        </small>
      </CAlert>
    )
  }

  return (
    <div className="student-grades" style={{ animation: 'fadeIn 0.5s ease-in' }}>
      {/* Header */}
      <CRow className="mb-4">
        <CCol>
          <h2
            className="text-primary"
            style={{ borderBottom: '3px solid #fcd116', paddingBottom: '10px' }}
          >
            📒 Mis Notas — {gradeName || `Grado ${currentUser.grade_id}°`}
          </h2>
          <p className="text-muted">
            ¡Hola, {currentUser.name?.split(' ')[0]}! Aquí puedes ver todas tus calificaciones.
          </p>
        </CCol>
      </CRow>

      {/* Tarjetas de Promedio */}
      <CRow className="mb-4 g-3">
        {/* Promedio General */}
        <CCol xs={12} sm={6} lg={3}>
          <CCard
            className="h-100 border-0 shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <CCardBody className="text-center py-4">
              <div style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1 }}>
                {promedioGeneral}
              </div>
              <div className="mt-2 opacity-75" style={{ fontSize: '0.85rem' }}>
                PROMEDIO GENERAL
              </div>
              <CProgress className="mt-3" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <CProgressBar
                  value={(promedioGeneral / 20) * 100}
                  style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                />
              </CProgress>
              <div className="mt-2">
                <span style={{ fontSize: '1.2rem' }}>
                  {getGradeInfo(promedioGeneral, 20).emoji}
                </span>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Promedio Evaluaciones */}
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="h-100 border-0 shadow-sm">
            <CCardBody className="text-center py-4">
              <div className="text-primary" style={{ fontSize: '2rem', fontWeight: '700' }}>
                📝 {promedioEval}
              </div>
              <div className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
                EVALUACIONES ({evaluaciones.length})
              </div>
              <CProgress className="mt-3" style={{ height: '5px' }}>
                <CProgressBar
                  color={getProgressColor(promedioEval)}
                  value={(promedioEval / 20) * 100}
                />
              </CProgress>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Promedio Quizzes */}
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="h-100 border-0 shadow-sm">
            <CCardBody className="text-center py-4">
              <div className="text-info" style={{ fontSize: '2rem', fontWeight: '700' }}>
                🧩 {promedioQuiz}
              </div>
              <div className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
                QUIZZES ({quizzes.length})
              </div>
              <CProgress className="mt-3" style={{ height: '5px' }}>
                <CProgressBar
                  color={getProgressColor(promedioQuiz)}
                  value={(promedioQuiz / 20) * 100}
                />
              </CProgress>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Promedio Actividades */}
        <CCol xs={12} sm={6} lg={3}>
          <CCard className="h-100 border-0 shadow-sm">
            <CCardBody className="text-center py-4">
              <div className="text-success" style={{ fontSize: '2rem', fontWeight: '700' }}>
                🎯 {promedioAct}
              </div>
              <div className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>
                ACTIVIDADES ({actividades.length})
              </div>
              <CProgress className="mt-3" style={{ height: '5px' }}>
                <CProgressBar
                  color={getProgressColor(promedioAct)}
                  value={(promedioAct / 20) * 100}
                />
              </CProgress>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Tabla de Notas Detallada */}
      <CCard className="shadow-sm border-0 mb-4">
        <CCardHeader
          className="border-0"
          style={{
            background: 'linear-gradient(135deg, #00247d 0%, #cf142b 100%)',
            color: 'white',
          }}
        >
          <h5 className="mb-0">
            <CIcon icon={cilChart} className="me-2" />
            Detalle de Calificaciones
          </h5>
        </CCardHeader>
        <CCardBody className="p-0">
          {progressData.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '3rem' }}>📭</div>
              <h5 className="text-muted mt-3">Aún no tienes notas registradas</h5>
              <p className="text-muted">
                Tu profesor aún no ha subido calificaciones. ¡Sigue practicando!
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <CTable hover striped align="middle" className="mb-0">
                <CTableHead>
                  <CTableRow className="bg-light">
                    <CTableHeaderCell className="ps-4">#</CTableHeaderCell>
                    <CTableHeaderCell>Tema</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Tipo</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Nota</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Escala</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Estado</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      <CIcon icon={cilCalendar} className="me-1" />
                      Fecha
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {progressData
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((item, index) => {
                      const gradeInfo = getGradeInfo(item.score, item.max_score)
                      const activityInfo = getActivityLabel(item.activity_type)
                      const normalizedScore = ((item.score / item.max_score) * 20).toFixed(1)

                      return (
                        <CTableRow key={item.id || index}>
                          <CTableDataCell className="ps-4 text-muted">
                            {index + 1}
                          </CTableDataCell>
                          <CTableDataCell>
                            <strong>{item.topic}</strong>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CBadge color={activityInfo.color} shape="rounded-pill">
                              {activityInfo.icon} {activityInfo.label}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <span
                              style={{
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                color:
                                  gradeInfo.color === 'success'
                                    ? '#2eb85c'
                                    : gradeInfo.color === 'warning'
                                      ? '#f9b115'
                                      : gradeInfo.color === 'danger'
                                        ? '#e55353'
                                        : '#3399ff',
                              }}
                            >
                              {item.score}
                            </span>
                            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                              /{item.max_score}
                            </span>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <div style={{ width: '80px', margin: '0 auto' }}>
                              <CProgress style={{ height: '8px' }}>
                                <CProgressBar
                                  color={gradeInfo.color}
                                  value={(item.score / item.max_score) * 100}
                                />
                              </CProgress>
                              <small className="text-muted">{normalizedScore}/20</small>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CBadge color={gradeInfo.color} shape="rounded-pill">
                              {gradeInfo.emoji} {gradeInfo.label}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell className="text-center text-muted">
                            {formatDate(item.date)}
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
                </CTableBody>
              </CTable>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Leyenda de Escala */}
      <CCard className="shadow-sm border-0">
        <CCardBody>
          <CRow>
            <CCol md={6}>
              <h6 className="mb-3">
                <CIcon icon={cilStar} className="me-2 text-warning" />
                Escala de Calificaciones (1-20):
              </h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <CBadge color="success" className="me-2" style={{ width: '55px' }}>
                    18-20
                  </CBadge>
                  🌟 Excelente — ¡Sigue así!
                </li>
                <li className="mb-2">
                  <CBadge color="warning" className="me-2" style={{ width: '55px' }}>
                    14-17
                  </CBadge>
                  ✅ Aprobado — ¡Muy bien!
                </li>
                <li className="mb-2">
                  <CBadge color="info" className="me-2" style={{ width: '55px' }}>
                    10-13
                  </CBadge>
                  📘 Regular — ¡Puedes mejorar!
                </li>
                <li className="mb-2">
                  <CBadge color="danger" className="me-2" style={{ width: '55px' }}>
                    01-09
                  </CBadge>
                  📕 Necesita Mejorar — ¡No te rindas!
                </li>
              </ul>
            </CCol>
            <CCol md={6}>
              <h6 className="mb-3">📊 Resumen:</h6>
              <p className="mb-1">
                <strong>Total de notas:</strong> {progressData.length}
              </p>
              <p className="mb-1">
                <strong>Evaluaciones:</strong> {evaluaciones.length}
              </p>
              <p className="mb-1">
                <strong>Quizzes:</strong> {quizzes.length}
              </p>
              <p className="mb-0">
                <strong>Actividades:</strong> {actividades.length}
              </p>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* CSS de animación */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default StudentGrades
