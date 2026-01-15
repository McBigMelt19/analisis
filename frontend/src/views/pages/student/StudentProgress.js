import React, { useState, useEffect } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
    CSpinner,
    CBadge,
} from '@coreui/react'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import { useAuth } from '../../../context/AuthContext'
import CIcon from '@coreui/icons-react'
import { cilChart } from '@coreui/icons'

const StudentProgress = () => {
    const { currentUser } = useAuth()
    const [progressData, setProgressData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [stats, setStats] = useState({ average: 0, total: 0, excellent: 0, low: 0 })

    useEffect(() => {
        const fetchProgress = async () => {
            if (!currentUser || currentUser.role !== 'student') {
                setLoading(false)
                return
            }

            try {
                // 🎯 FILTRO: Solo el progreso del estudiante actual
                const response = await fetch(
                    `http://localhost:3001/progress?student_id=${currentUser.id}`,
                )

                if (!response.ok) {
                    throw new Error('Error al cargar progreso')
                }

                const data = await response.json()
                setProgressData(data)

                // Calcular estadísticas
                if (data.length > 0) {
                    const scores = data.map((p) => p.score)
                    const average = scores.reduce((a, b) => a + b, 0) / scores.length
                    const excellent = scores.filter((s) => s >= 90).length
                    const low = scores.filter((s) => s < 70).length

                    setStats({
                        average: average.toFixed(1),
                        total: data.length,
                        excellent,
                        low,
                    })
                }
            } catch (error) {
                console.error('Error cargando progreso:', error)
                setError('No se pudo cargar el progreso. Verifica que json-server esté corriendo.')
            } finally {
                setLoading(false)
            }
        }

        fetchProgress()
    }, [currentUser])

    // Preparar datos para la gráfica de barras
    const chartBarData = {
        labels: progressData.map((p) => p.topic),
        datasets: [
            {
                label: 'Calificaciones',
                data: progressData.map((p) => p.score),
                backgroundColor: progressData.map((p) =>
                    p.score >= 90
                        ? 'rgba(75, 192, 192, 0.6)' // Verde para excelente
                        : p.score >= 70
                            ? 'rgba(255, 206, 86, 0.6)' // Amarillo para aprobado
                            : 'rgba(255, 99, 132, 0.6)', // Rojo para bajo
                ),
                borderColor: progressData.map((p) =>
                    p.score >= 90
                        ? 'rgba(75, 192, 192, 1)'
                        : p.score >= 70
                            ? 'rgba(255, 206, 86, 1)'
                            : 'rgba(255, 99, 132, 1)',
                ),
                borderWidth: 2,
            },
        ],
    }

    // Preparar datos para la gráfica de línea (tendencia)
    const chartLineData = {
        labels: progressData.map((p, idx) => `Act. ${idx + 1}`),
        datasets: [
            {
                label: 'Tendencia de Notas',
                data: progressData.map((p) => p.score),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    }

    const chartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
            },
        },
    }

    if (loading) {
        return (
            <div className="text-center p-5">
                <CSpinner color="primary" />
                <p className="mt-3 text-muted">Cargando tu progreso...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="alert alert-warning m-4">
                {error}
                <br />
                <small>
                    Ejecuta: <code>npm run server</code> en otra terminal
                </small>
            </div>
        )
    }

    return (
        <div>
            <CRow className="mb-4">
                <CCol>
                    <h2>
                        <CIcon icon={cilChart} className="me-2" />
                        Mi Progreso Académico
                    </h2>
                    <p className="text-muted">
                        Estudiante: <strong>{currentUser?.name}</strong> | Grado:{' '}
                        <strong>{currentUser?.grade_id}°</strong>
                    </p>
                </CCol>
            </CRow>

            {/* Estadísticas Rápidas */}
            <CRow className="mb-4">
                <CCol xs={12} sm={6} lg={3}>
                    <CCard className="text-center">
                        <CCardBody>
                            <h3 className="text-primary">{stats.total}</h3>
                            <p className="text-muted mb-0">Actividades Completadas</p>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol xs={12} sm={6} lg={3}>
                    <CCard className="text-center">
                        <CCardBody>
                            <h3 className="text-success">{stats.average}</h3>
                            <p className="text-muted mb-0">Promedio General</p>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol xs={12} sm={6} lg={3}>
                    <CCard className="text-center">
                        <CCardBody>
                            <h3 className="text-info">{stats.excellent}</h3>
                            <p className="text-muted mb-0">Notas Excelentes (≥90)</p>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol xs={12} sm={6} lg={3}>
                    <CCard className="text-center">
                        <CCardBody>
                            <h3 className="text-warning">{stats.low}</h3>
                            <p className="text-muted mb-0">Notas Bajas (&lt;70)</p>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {progressData.length > 0 ? (
                <>
                    {/* Gráfica de Barras */}
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Calificaciones por Actividad</strong>
                        </CCardHeader>
                        <CCardBody>
                            <div style={{ height: '300px' }}>
                                <CChartBar data={chartBarData} options={chartOptions} />
                            </div>
                        </CCardBody>
                    </CCard>

                    {/* Gráfica de Línea */}
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Tendencia de Progreso</strong>
                        </CCardHeader>
                        <CCardBody>
                            <div style={{ height: '250px' }}>
                                <CChartLine data={chartLineData} options={chartOptions} />
                            </div>
                        </CCardBody>
                    </CCard>

                    {/* Tabla de Detalles */}
                    <CCard>
                        <CCardHeader>
                            <strong>Detalle de Actividades</strong>
                        </CCardHeader>
                        <CCardBody>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Tema</th>
                                            <th>Tipo</th>
                                            <th>Calificación</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {progressData.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.date}</td>
                                                <td>{item.topic}</td>
                                                <td>
                                                    <CBadge color={item.activity_type === 'quiz' ? 'info' : 'primary'}>
                                                        {item.activity_type === 'quiz' ? 'Quiz' : 'Actividad'}
                                                    </CBadge>
                                                </td>
                                                <td>
                                                    <strong>
                                                        {item.score}/{item.max_score}
                                                    </strong>
                                                </td>
                                                <td>
                                                    <CBadge
                                                        color={
                                                            item.score >= 90 ? 'success' : item.score >= 70 ? 'warning' : 'danger'
                                                        }
                                                    >
                                                        {item.score >= 90
                                                            ? 'Excelente'
                                                            : item.score >= 70
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
                        <p className="text-muted">Aún no tienes actividades completadas.</p>
                        <p className="text-muted">¡Comienza a explorar los contenidos de tu grado!</p>
                    </CCardBody>
                </CCard>
            )}
        </div>
    )
}

export default StudentProgress
