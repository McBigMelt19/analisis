import React, { useState, useEffect } from 'react'
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CSpinner,
    CBadge,
} from '@coreui/react'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilUser, cilChart } from '@coreui/icons'
import * as usersService from '../services/users.service'
import * as progressService from '../services/progress.service'

const StudentProgressModal = ({ visible, onClose, studentId }) => {
    const [student, setStudent] = useState(null)
    const [progressData, setProgressData] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ average: 0, total: 0, excellent: 0, low: 0 })

    useEffect(() => {
        if (visible && studentId) {
            fetchStudentData()
        }
    }, [visible, studentId])

    const fetchStudentData = async () => {
        setLoading(true)
        try {
            // Fetch student info
            const studentData = await usersService.getUserById(studentId)
            setStudent(studentData)

            // Fetch progress
            const progressList = await progressService.getStudentProgress(studentId)

            // Simulamos el progreso porque la API no expone el progreso de los estudiantes para profesores aún.
            const filteredProgress = []
            setProgressData(filteredProgress)

            // Calculate stats
            if (filteredProgress.length > 0) {
                const scores = filteredProgress.map((p) => p.score)
                const average = scores.reduce((a, b) => a + b, 0) / scores.length
                const excellent = scores.filter((s) => s >= 18).length
                const low = scores.filter((s) => s < 14).length

                setStats({
                    average: average.toFixed(1),
                    total: filteredProgress.length,
                    excellent,
                    low,
                })
            } else {
                setStats({ average: 0, total: 0, excellent: 0, low: 0 })
            }
        } catch (error) {
            console.error('Error cargando datos del estudiante:', error)
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

    // Preparar datos para gráfica de barras
    const chartBarData = {
        labels: progressData.map((p) => p.topic.substring(0, 20) + '...'),
        datasets: [
            {
                label: 'Calificaciones',
                data: progressData.map((p) => p.score),
                backgroundColor: progressData.map((p) =>
                    p.score >= 18
                        ? 'rgba(75, 192, 192, 0.6)'
                        : p.score >= 14
                            ? 'rgba(255, 206, 86, 0.6)'
                            : 'rgba(255, 99, 132, 0.6)',
                ),
                borderColor: progressData.map((p) =>
                    p.score >= 18
                        ? 'rgba(75, 192, 192, 1)'
                        : p.score >= 14
                            ? 'rgba(255, 206, 86, 1)'
                            : 'rgba(255, 99, 132, 1)',
                ),
                borderWidth: 2,
            },
        ],
    }

    const chartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 20,
            },
        },
    }

    return (
        <CModal size="xl" visible={visible} onClose={onClose} backdrop="static">
            <CModalHeader>
                <CModalTitle>
                    <CIcon icon={cilUser} className="me-2" />
                    Progreso del Estudiante
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                {loading ? (
                    <div className="text-center p-5">
                        <CSpinner color="primary" />
                        <p className="mt-3 text-muted">Cargando datos del estudiante...</p>
                    </div>
                ) : student ? (
                    <>
                        {/* Información del Estudiante */}
                        <CCard className="mb-4 border-primary">
                            <CCardBody>
                                <CRow>
                                    <CCol md={6}>
                                        <h4 className="text-primary">{student.name}</h4>
                                        <p className="mb-1">
                                            <strong>Email:</strong> {student.email}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Grado:</strong> {student.grade_id}°
                                        </p>
                                    </CCol>
                                    <CCol md={6} className="text-md-end">
                                        <p className="mb-2">
                                            <strong>Estilo de Aprendizaje:</strong>
                                        </p>
                                        <CBadge color={getLearningStyleColor(student.learning_style)} className="p-2">
                                            {student.learning_style}
                                        </CBadge>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>

                        {/* Estadísticas Rápidas */}
                        <CRow className="mb-4">
                            <CCol xs={6} md={3}>
                                <CCard className="text-center bg-light">
                                    <CCardBody>
                                        <h3 className="text-primary mb-0">{stats.total}</h3>
                                        <small className="text-muted">Evaluaciones</small>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                            <CCol xs={6} md={3}>
                                <CCard className="text-center bg-light">
                                    <CCardBody>
                                        <h3 className="text-success mb-0">{stats.average}</h3>
                                        <small className="text-muted">Promedio</small>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                            <CCol xs={6} md={3}>
                                <CCard className="text-center bg-light">
                                    <CCardBody>
                                        <h3 className="text-info mb-0">{stats.excellent}</h3>
                                        <small className="text-muted">Excelentes (≥18)</small>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                            <CCol xs={6} md={3}>
                                <CCard className="text-center bg-light">
                                    <CCardBody>
                                        <h3 className="text-warning mb-0">{stats.low}</h3>
                                        <small className="text-muted">Bajas (&lt;14)</small>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                        </CRow>

                        {/* Gráfica de Progreso */}
                        {progressData.length > 0 ? (
                            <>
                                <CCard className="mb-4">
                                    <CCardBody>
                                        <h5 className="mb-3">
                                            <CIcon icon={cilChart} className="me-2" />
                                            Calificaciones por Tema
                                        </h5>
                                        <div style={{ height: '300px' }}>
                                            <CChartBar data={chartBarData} options={chartOptions} />
                                        </div>
                                    </CCardBody>
                                </CCard>

                                {/* Tabla de Detalles */}
                                <CCard>
                                    <CCardBody>
                                        <h5 className="mb-3">Detalle de Evaluaciones</h5>
                                        <div className="table-responsive">
                                            <table className="table table-hover table-sm">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Fecha</th>
                                                        <th>Tema</th>
                                                        <th>Tipo</th>
                                                        <th className="text-center">Nota</th>
                                                        <th className="text-center">Estado</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {progressData.map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td>{item.date}</td>
                                                            <td>{item.topic}</td>
                                                            <td>
                                                                <CBadge color={item.activity_type === 'quiz' ? 'info' : 'primary'}>
                                                                    {item.activity_type === 'quiz' ? 'Quiz' : 'Evaluación'}
                                                                </CBadge>
                                                            </td>
                                                            <td className="text-center">
                                                                <strong>
                                                                    {item.score}/{item.max_score}
                                                                </strong>
                                                            </td>
                                                            <td className="text-center">
                                                                <CBadge
                                                                    color={
                                                                        item.score >= 18
                                                                            ? 'success'
                                                                            : item.score >= 14
                                                                                ? 'warning'
                                                                                : 'danger'
                                                                    }
                                                                >
                                                                    {item.score >= 18
                                                                        ? 'Excelente'
                                                                        : item.score >= 14
                                                                            ? 'Aprobado'
                                                                            : 'Necesita Mejorar'}
                                                                </CBadge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CCardBody>
                                </CCard>
                            </>
                        ) : (
                            <CCard>
                                <CCardBody className="text-center p-5">
                                    <p className="text-muted">Este estudiante aún no tiene evaluaciones registradas.</p>
                                </CCardBody>
                            </CCard>
                        )}
                    </>
                ) : (
                    <div className="alert alert-warning">No se pudo cargar la información del estudiante.</div>
                )}
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>
                    Cerrar
                </CButton>
            </CModalFooter>
        </CModal>
    )
}

export default StudentProgressModal
