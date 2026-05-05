import React, { useState, useEffect } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CSpinner,
    CBadge,
    CListGroup,
    CListGroupItem,
} from '@coreui/react'
import { useAuth } from '../../../context/AuthContext'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilX } from '@coreui/icons'
import * as usersService from '../../../services/users.service'
import * as topicsService from '../../../services/topics.service'
import * as progressService from '../../../services/progress.service'

const TeacherContent = () => {
    const { currentUser } = useAuth()
    const [topics, setTopics] = useState([])
    const [students, setStudents] = useState([])
    const [progress, setProgress] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (currentUser && currentUser.role === 'teacher') {
            fetchData()
        }
    }, [currentUser])

    const fetchData = async () => {
        setLoading(true)
        try {
            // Fetch topics del grado
            const topicsData = await topicsService.getTopicsByGrade(currentUser.grade_id)
            if (topicsData.length > 0) {
                setTopics(topicsData[0])
            }

            // Fetch students del grado
            const studentsData = await usersService.getStudentsByGrade(currentUser.grade_id)
            setStudents(studentsData)

            // Fetch progress del grado
            const progressData = await progressService.getProgressByGrade(currentUser.grade_id, 'evaluacion')
            setProgress(progressData)
        } catch (error) {
            console.error('Error cargando datos:', error)
            setError('Error al cargar contenido. Verifica la conexión al servidor.')
        } finally {
            setLoading(false)
        }
    }

    const getTopicCompletionCount = (topicName) => {
        // Contar cuántos estudiantes completaron este tema
        const completedStudents = new Set(
            progress.filter((p) => p.topic === topicName).map((p) => p.student_id),
        )
        return completedStudents.size
    }

    if (!currentUser || currentUser.role !== 'teacher') {
        return <div className="alert alert-warning m-4">Esta página es solo para profesores.</div>
    }

    if (loading) {
        return (
            <div className="text-center p-5">
                <CSpinner color="primary" />
                <p className="mt-3 text-muted">Cargando contenido...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="alert alert-danger m-4">
                {error}
            </div>
        )
    }

    return (
        <div className="teacher-content">
            <CRow className="mb-4">
                <CCol>
                    <h2
                        className="text-primary"
                        style={{ borderBottom: '2px solid #fcd116', paddingBottom: '10px' }}
                    >
                        📚 Gestión de Contenido - {topics.grade_name}
                    </h2>
                    <p className="text-muted">
                        Administra los temas y contenidos educativos de tu grado. Aquí puedes ver qué temas
                        han sido evaluados y cuántos estudiantes los han completado.
                    </p>
                </CCol>
            </CRow>

            {/* Información del Grado */}
            <CCard className="mb-4">
                <CCardHeader className="bg-light">
                    <h5 className="mb-0">Información del Grado</h5>
                </CCardHeader>
                <CCardBody>
                    <CRow>
                        <CCol md={4}>
                            <p className="mb-1">
                                <strong>Grado:</strong> {topics.grade_name}
                            </p>
                        </CCol>
                        <CCol md={4}>
                            <p className="mb-1">
                                <strong>Edad Objetivo:</strong> {topics.edad_objetivo}
                            </p>
                        </CCol>
                        <CCol md={4}>
                            <p className="mb-1">
                                <strong>Nivel:</strong> {topics.nivel_complejidad}
                            </p>
                        </CCol>
                    </CRow>
                    <CRow className="mt-3">
                        <CCol>
                            <p className="mb-1">
                                <strong>Total de Temas:</strong> {topics.temas?.length || 0}
                            </p>
                            <p className="mb-0">
                                <strong>Total de Estudiantes:</strong> {students.length}
                            </p>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>

            {/* Lista de Temas */}
            <CCard>
                <CCardHeader className="bg-light">
                    <h5 className="mb-0">Temas del Grado</h5>
                </CCardHeader>
                <CCardBody>
                    {topics.temas && topics.temas.length > 0 ? (
                        <CListGroup>
                            {topics.temas.map((tema, index) => {
                                const completedCount = getTopicCompletionCount(tema)
                                const completionPercentage =
                                    students.length > 0 ? (completedCount / students.length) * 100 : 0

                                return (
                                    <CListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                                        <div className="flex-grow-1">
                                            <strong>{index + 1}. {tema}</strong>
                                            <div className="mt-1">
                                                <small className="text-muted">
                                                    {completedCount} de {students.length} estudiantes evaluados (
                                                    {completionPercentage.toFixed(0)}%)
                                                </small>
                                            </div>
                                            {/* Barra de progreso */}
                                            <div className="progress mt-2" style={{ height: '8px' }}>
                                                <div
                                                    className={`progress-bar ${completionPercentage === 100
                                                            ? 'bg-success'
                                                            : completionPercentage > 50
                                                                ? 'bg-info'
                                                                : 'bg-warning'
                                                        }`}
                                                    role="progressbar"
                                                    style={{ width: `${completionPercentage}%` }}
                                                    aria-valuenow={completionPercentage}
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="ms-3">
                                            {completedCount === students.length ? (
                                                <CBadge color="success">
                                                    <CIcon icon={cilCheckCircle} className="me-1" />
                                                    Completo
                                                </CBadge>
                                            ) : completedCount > 0 ? (
                                                <CBadge color="info">En Progreso</CBadge>
                                            ) : (
                                                <CBadge color="secondary">
                                                    <CIcon icon={cilX} className="me-1" />
                                                    Pendiente
                                                </CBadge>
                                            )}
                                        </div>
                                    </CListGroupItem>
                                )
                            })}
                        </CListGroup>
                    ) : (
                        <div className="alert alert-info">No hay temas disponibles para este grado.</div>
                    )}
                </CCardBody>
            </CCard>

            {/* Restricciones de IA */}
            {topics.restricciones_ia && (
                <CCard className="mt-4">
                    <CCardHeader className="bg-light">
                        <h5 className="mb-0">Restricciones de IA para este Grado</h5>
                    </CCardHeader>
                    <CCardBody>
                        <p className="mb-0 text-muted">{topics.restricciones_ia}</p>
                    </CCardBody>
                </CCard>
            )}
        </div>
    )
}

export default TeacherContent
