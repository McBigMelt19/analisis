import React, { useState, useEffect } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CButton,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CForm,
    CFormLabel,
    CFormSelect,
    CFormTextarea,
    CSpinner,
    CBadge,
    CAlert,
    CRow,
    CCol,
} from '@coreui/react'
import { useAuth } from '../../../context/AuthContext'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle } from '@coreui/icons'

const TeacherFeedback = () => {
    const { currentUser } = useAuth()
    const [students, setStudents] = useState([])
    const [topics, setTopics] = useState([])
    const [feedbacks, setFeedbacks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Form state
    const [selectedStudent, setSelectedStudent] = useState('')
    const [selectedTopic, setSelectedTopic] = useState('')
    const [feedbackText, setFeedbackText] = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (currentUser && currentUser.role === 'teacher') {
            fetchData()
        }
    }, [currentUser])

    const fetchData = async () => {
        setLoading(true)
        try {
            const headers = { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}` 
            }

            // Fetch students del grado
            const studentsRes = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/usuarios?rol=estudiante`,
                { headers }
            )
            const studentsData = await studentsRes.json()
            if (studentsData.usuarios) {
                const mappedStudents = studentsData.usuarios.map(u => ({
                    id: u.id_usuario,
                    name: u.persona ? `${u.persona.nombre} ${u.persona.apellido}` : u.email,
                    learning_style: u.persona?.estudiante?.estiloAprendizaje?.nombre_estilo || 'Visual',
                    grade_id: u.persona?.estudiante?.id_grado,
                    role: 'student'
                })).filter(u => u.grade_id == currentUser.grade_id || !u.grade_id)
                setStudents(mappedStudents)
            }

            // Fetch topics del grado
            const topicsRes = await fetch(
                `${import.meta.env.VITE_API_URL}/api/temas?id_grado=${currentUser.grade_id}`,
                { headers }
            )
            const topicsData = await topicsRes.json()
            if (topicsData.temas && topicsData.temas.length > 0) {
                setTopics(topicsData.temas.map(t => t.nombre_tema))
            }

            // Simular feedbacks del profesor (el backend no tiene /api/feedbacks explícito en api.routes.js para profesores hacia estudiantes fuera de progreso)
            setFeedbacks([])
        } catch (error) {
            console.error('Error cargando datos:', error)
            setError('Error al cargar datos desde el servidor backend.')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!selectedStudent || !selectedTopic || !feedbackText.trim()) {
            setError('Por favor completa todos los campos')
            return
        }

        setSubmitting(true)

        try {
            const payload = {
                id: Math.floor(Math.random() * 10000), // falso ID
                student_id: parseInt(selectedStudent),
                teacher_id: currentUser.id,
                topic: selectedTopic,
                feedback: feedbackText,
                date: new Date().toISOString().split('T')[0],
            }

            // Simular guardado ya que /api/feedbacks no existe
            setTimeout(() => {
                setFeedbacks([payload, ...feedbacks])
                setSuccess('✅ Retroalimentación enviada exitosamente (Simulación)')

                // Reset form
                setSelectedStudent('')
                setSelectedTopic('')
                setFeedbackText('')

                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(''), 3000)
            }, 500)
        } catch (error) {
            console.error('Error enviando feedback:', error)
            setError('Error al enviar la retroalimentación')
        } finally {
            setSubmitting(false)
        }
    }

    const getStudentName = (studentId) => {
        const student = students.find((s) => s.id === studentId)
        return student ? student.name : 'Desconocido'
    }

    if (!currentUser || currentUser.role !== 'teacher') {
        return <div className="alert alert-warning m-4">Esta página es solo para profesores.</div>
    }

    if (loading) {
        return (
            <div className="text-center p-5">
                <CSpinner color="primary" />
                <p className="mt-3 text-muted">Cargando retroalimentación...</p>
            </div>
        )
    }

    return (
        <div className="teacher-feedback">
            <CRow className="mb-4">
                <CCol>
                    <h2
                        className="text-primary"
                        style={{ borderBottom: '2px solid #fcd116', paddingBottom: '10px' }}
                    >
                        💬 Retroalimentación a Estudiantes
                    </h2>
                    <p className="text-muted">
                        Proporciona comentarios y sugerencias personalizadas a tus estudiantes sobre su
                        desempeño en los diferentes temas.
                    </p>
                </CCol>
            </CRow>

            {/* Formulario de Retroalimentación */}
            <CCard className="mb-4 shadow-sm">
                <CCardHeader className="bg-light">
                    <h5 className="mb-0">Nueva Retroalimentación</h5>
                </CCardHeader>
                <CCardBody>
                    {error && <CAlert color="danger">{error}</CAlert>}
                    {success && (
                        <CAlert color="success">
                            <CIcon icon={cilCheckCircle} className="me-2" />
                            {success}
                        </CAlert>
                    )}

                    <CForm onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <CFormLabel htmlFor="feedback-student">
                                <strong>Seleccionar Estudiante:</strong>
                            </CFormLabel>
                            <CFormSelect
                                id="feedback-student"
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                                required
                            >
                                <option value="">-- Selecciona un estudiante --</option>
                                {students.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.name} ({student.learning_style})
                                    </option>
                                ))}
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="feedback-topic">
                                <strong>Tema Relacionado:</strong>
                            </CFormLabel>
                            <CFormSelect
                                id="feedback-topic"
                                value={selectedTopic}
                                onChange={(e) => setSelectedTopic(e.target.value)}
                                required
                            >
                                <option value="">-- Selecciona un tema --</option>
                                {topics.map((topic, index) => (
                                    <option key={index} value={topic}>
                                        {topic}
                                    </option>
                                ))}
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="feedback-content">
                                <strong>Retroalimentación:</strong>
                            </CFormLabel>
                            <CFormTextarea
                                id="feedback-content"
                                rows={4}
                                placeholder="Escribe aquí tus comentarios para el estudiante..."
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                required
                            />
                            <small className="text-muted">
                                Sé específico y constructivo. Destaca fortalezas y áreas de mejora.
                            </small>
                        </div>

                        <CButton color="primary" type="submit" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <CSpinner size="sm" className="me-2" />
                                    Enviando...
                                </>
                            ) : (
                                'Enviar Retroalimentación'
                            )}
                        </CButton>
                    </CForm>
                </CCardBody>
            </CCard>

            {/* Historial de Retroalimentación */}
            <CCard className="shadow-sm">
                <CCardHeader className="bg-light">
                    <h5 className="mb-0">Historial de Retroalimentación ({feedbacks.length})</h5>
                </CCardHeader>
                <CCardBody>
                    {feedbacks.length > 0 ? (
                        <div className="table-responsive">
                            <CTable hover bordered>
                                <CTableHead color="light">
                                    <CTableRow>
                                        <CTableHeaderCell>Fecha</CTableHeaderCell>
                                        <CTableHeaderCell>Estudiante</CTableHeaderCell>
                                        <CTableHeaderCell>Tema</CTableHeaderCell>
                                        <CTableHeaderCell>Comentarios</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {feedbacks.map((f) => (
                                        <CTableRow key={f.id}>
                                            <CTableDataCell>
                                                <CBadge color="info">{f.date}</CBadge>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <strong>{getStudentName(f.student_id)}</strong>
                                            </CTableDataCell>
                                            <CTableDataCell>{f.topic}</CTableDataCell>
                                            <CTableDataCell>{f.feedback}</CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </div>
                    ) : (
                        <div className="alert alert-info mb-0">
                            <p className="mb-0">
                                Aún no has enviado retroalimentación. Usa el formulario arriba para comenzar.
                            </p>
                        </div>
                    )}
                </CCardBody>
            </CCard>
        </div>
    )
}

export default TeacherFeedback
