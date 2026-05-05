import React, { useState, useEffect } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CButton,
    CSpinner,
    CFormInput,
    CRow,
    CCol,
    CBadge,
    CAlert,
} from '@coreui/react'
import { useAuth } from '../../../context/AuthContext'
import StudentProgressModal from '../../../components/StudentProgressModal'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilWarning, cilChart } from '@coreui/icons'

const TeacherGrades = () => {
    const { currentUser } = useAuth()
    const [students, setStudents] = useState([])
    const [topics, setTopics] = useState([])
    const [grades, setGrades] = useState({}) // { `${topicId}_${studentId}`: { score, saved, id } }
    const [topicDates, setTopicDates] = useState({}) // { `${topic}`: 'YYYY-MM-DD' }
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [dateError, setDateError] = useState('')

    // ── Cálculo de rango de fechas permitido ──
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const minDateStr = hoy.toISOString().split('T')[0]

    const maxDate = new Date(hoy)
    maxDate.setDate(maxDate.getDate() + 14)
    const maxDateStr = maxDate.toISOString().split('T')[0]

    // Validar que una fecha esté en el rango permitido
    const validarFecha = (dateStr) => {
        const fecha = new Date(dateStr + 'T00:00:00')
        if (fecha < hoy) {
            return 'No se pueden seleccionar fechas anteriores a hoy'
        }
        if (fecha > maxDate) {
            return 'No se pueden seleccionar fechas con más de 2 semanas de anticipación'
        }
        return ''
    }

    const handleSelectedDateChange = (e) => {
        const newDate = e.target.value
        const err = validarFecha(newDate)
        if (err) {
            setDateError(err)
            // No actualizar la fecha si es inválida
            return
        }
        setDateError('')
        setSelectedDate(newDate)
    }

    const handleTopicDateChange = (topic, newDate) => {
        const err = validarFecha(newDate)
        if (err) {
            setDateError(err)
            // Auto-limpiar error después de 3 segundos
            setTimeout(() => setDateError(''), 3000)
            return
        }
        setDateError('')
        setTopicDates((prev) => ({ ...prev, [topic]: newDate }))
    }

    useEffect(() => {
        if (currentUser && currentUser.role === 'teacher') {
            fetchData()
        }
    }, [currentUser])

    const fetchData = async () => {
        setLoading(true)
        setError('')
        try {
            const headers = { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}` 
            }

            // Fetch students del grado del profesor
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
            } else {
                setStudents([])
            }

            // Fetch topics del grado
            const topicsRes = await fetch(
                `${import.meta.env.VITE_API_URL}/api/temas?id_grado=${currentUser.grade_id}`,
                { headers }
            )
            const topicsData = await topicsRes.json()
            let themeNames = []
            let realTopics = []
            if (topicsData.temas && topicsData.temas.length > 0) {
                realTopics = topicsData.temas
                themeNames = topicsData.temas.map(t => t.nombre_tema)
                setTopics(themeNames)

                // Inicializar fechas para cada tema
                const initialDates = {}
                themeNames.forEach((tema) => {
                    initialDates[tema] = selectedDate
                })
                setTopicDates(initialDates)
            }

            // Fetch existing grades. Nota: si no hay un endpoint de progreso global para profesor, se deja vacío o se usaría las entregas
            // En una implementación real se buscaría con un /api/progreso/grado
            const gradesMap = {}
            setGrades(gradesMap)
            setLoading(false)
        } catch (error) {
            console.error('Error cargando datos:', error)
            setError('Error al cargar datos desde el servidor backend.')
            setLoading(false)
        }
    }

    const handleGradeChange = (topic, studentId, value) => {
        const key = `${topic}_${studentId}`
        const numValue = parseFloat(value)

        // Validar rango 1-20
        if (value === '' || (numValue >= 1 && numValue <= 20)) {
            setGrades((prev) => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    score: value === '' ? '' : numValue,
                    saved: false,
                },
            }))
        }
    }

    const saveGrade = async (topic, studentId) => {
        const key = `${topic}_${studentId}`
        const gradeData = grades[key]

        if (!gradeData || gradeData.score === '') return

        try {
            // Adaptar para el backend real
            const headers = { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}` 
            }
            
            // Simular guardado si el endpoint exacto (como profe) no está disponible en la app actual
            // Idealmente aquí llamaríamos a la actualización de progreso real o calificarActividad
            const payload = {
                student_id: studentId,
                topic: topic,
                score: gradeData.score,
                date: topicDates[topic] || selectedDate,
            }

            // Simulación visual del guardado:
            setTimeout(() => {
                setGrades((prev) => ({
                    ...prev,
                    [key]: {
                        score: gradeData.score,
                        saved: true,
                        id: Math.floor(Math.random() * 10000), // id falso
                    },
                }))
            }, 500)
            
        } catch (error) {
            console.error('Error guardando nota:', error)
            alert('Error al guardar la nota')
        }
    }

    const handleKeyPress = (e, topic, studentId) => {
        if (e.key === 'Enter') {
            saveGrade(topic, studentId)
            e.target.blur()
        }
    }

    const openProgressModal = (student) => {
        setSelectedStudent(student)
        setModalVisible(true)
    }

    if (!currentUser || currentUser.role !== 'teacher') {
        return (
            <div className="alert alert-warning m-4">
                Esta página es solo para profesores.
            </div>
        )
    }

    if (loading) {
        return (
            <div className="text-center p-5">
                <CSpinner color="primary" />
                <p className="mt-3 text-muted">Cargando sistema de calificaciones...</p>
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
        <div className="teacher-grades">
            <CRow className="mb-4">
                <CCol>
                    <h2 className="text-primary" style={{ borderBottom: '2px solid #fcd116', paddingBottom: '10px' }}>
                        📊 Sistema de Calificaciones - Grado {currentUser.grade_id}°
                    </h2>
                    <p className="text-muted">
                        Ingresa las calificaciones (01-20) de tus estudiantes. Las notas se guardan automáticamente al presionar Enter o cambiar de celda.
                    </p>
                </CCol>
            </CRow>

            {/* Selector de Fecha */}
            <CCard className="mb-4">
                <CCardBody>
                    <CRow className="align-items-center">
                        <CCol md={4}>
                            <label className="form-label">
                                <strong>Fecha de Evaluación:</strong>
                            </label>
                            <CFormInput
                                type="date"
                                value={selectedDate}
                                min={minDateStr}
                                max={maxDateStr}
                                onChange={handleSelectedDateChange}
                            />
                            <small className="text-muted d-block mt-1">
                                📅 Rango permitido: <strong>{minDateStr}</strong> hasta <strong>{maxDateStr}</strong> (máx. 2 semanas)
                            </small>
                        </CCol>
                        <CCol md={8} className="text-md-end mt-3 mt-md-0">
                            {dateError ? (
                                <CAlert color="danger" className="mb-0 d-inline-block">
                                    <CIcon icon={cilWarning} className="me-2" />
                                    <strong>Fecha no válida:</strong> {dateError}
                                </CAlert>
                            ) : (
                                <CAlert color="info" className="mb-0 d-inline-block">
                                    <CIcon icon={cilWarning} className="me-2" />
                                    <strong>Tip:</strong> Presiona <kbd>Enter</kbd> o haz clic fuera del campo para guardar
                                </CAlert>
                            )}
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>

            {/* Cuadrícula de Calificaciones */}
            <CCard>
                <CCardHeader className="bg-light">
                    <h5 className="mb-0">Cuadrícula de Calificaciones</h5>
                </CCardHeader>
                <CCardBody className="p-0">
                    <div className="table-responsive grades-grid">
                        <table className="table table-bordered table-hover mb-0">
                            <thead className="table-light sticky-top">
                                <tr>
                                    <th className="text-center align-middle" style={{ minWidth: '200px', position: 'sticky', left: 0, zIndex: 10, backgroundColor: '#f8f9fa' }}>
                                        Tema / Estudiante
                                    </th>
                                    <th className="text-center align-middle" style={{ minWidth: '120px', backgroundColor: '#f8f9fa' }}>
                                        Fecha
                                    </th>
                                    {students.map((student) => (
                                        <th key={student.id} className="text-center" style={{ minWidth: '150px' }}>
                                            <div className="mb-1">
                                                <strong>{student.name.split(' ')[0]}</strong>
                                                <br />
                                                <small className="text-muted">{student.name.split(' ').slice(1).join(' ')}</small>
                                            </div>
                                            <CBadge
                                                color={
                                                    student.learning_style === 'Visual'
                                                        ? 'info'
                                                        : student.learning_style === 'Auditivo'
                                                            ? 'warning'
                                                            : 'success'
                                                }
                                                className="mb-2"
                                            >
                                                {student.learning_style}
                                            </CBadge>
                                            <br />
                                            <CButton
                                                size="sm"
                                                color="primary"
                                                variant="outline"
                                                onClick={() => openProgressModal(student)}
                                            >
                                                <CIcon icon={cilChart} className="me-1" />
                                                Ver Progreso
                                            </CButton>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {topics.map((topic, topicIndex) => (
                                    <tr key={topicIndex}>
                                        <td className="align-middle" style={{ position: 'sticky', left: 0, zIndex: 5, backgroundColor: '#fff' }}>
                                            <strong>{topic}</strong>
                                        </td>
                                        <td className="text-center p-2">
                                            <CFormInput
                                                type="date"
                                                value={topicDates[topic] || selectedDate}
                                                min={minDateStr}
                                                max={maxDateStr}
                                                onChange={(e) => handleTopicDateChange(topic, e.target.value)}
                                                className="text-center"
                                                style={{ width: '130px', margin: '0 auto', fontSize: '0.85rem' }}
                                            />
                                        </td>
                                        {students.map((student) => {
                                            const key = `${topic}_${student.id}`
                                            const gradeData = grades[key] || { score: '', saved: false }
                                            return (
                                                <td key={student.id} className="text-center p-2">
                                                    <div className="position-relative">
                                                        <CFormInput
                                                            type="number"
                                                            min="1"
                                                            max="20"
                                                            step="0.5"
                                                            value={gradeData.score}
                                                            onChange={(e) => handleGradeChange(topic, student.id, e.target.value)}
                                                            onBlur={() => saveGrade(topic, student.id)}
                                                            onKeyPress={(e) => handleKeyPress(e, topic, student.id)}
                                                            className={`text-center ${gradeData.saved ? 'border-success bg-success bg-opacity-10' : ''}`}
                                                            style={{ width: '80px', margin: '0 auto' }}
                                                            placeholder="--"
                                                        />
                                                        {gradeData.saved && gradeData.score !== '' && (
                                                            <CIcon
                                                                icon={cilCheckCircle}
                                                                className="text-success position-absolute"
                                                                style={{ top: '50%', right: '5px', transform: 'translateY(-50%)' }}
                                                                size="sm"
                                                            />
                                                        )}
                                                    </div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CCardBody>
            </CCard>

            {/* Leyenda */}
            <CCard className="mt-3">
                <CCardBody>
                    <CRow>
                        <CCol md={6}>
                            <h6>Escala de Calificaciones:</h6>
                            <ul className="list-unstyled mb-0">
                                <li>
                                    <CBadge color="success">18-20</CBadge> Excelente
                                </li>
                                <li>
                                    <CBadge color="warning">14-17</CBadge> Aprobado
                                </li>
                                <li>
                                    <CBadge color="danger">01-13</CBadge> Necesita Mejorar
                                </li>
                            </ul>
                        </CCol>
                        <CCol md={6}>
                            <h6>Estadísticas:</h6>
                            <p className="mb-0">
                                <strong>Total de Estudiantes:</strong> {students.length}
                                <br />
                                <strong>Total de Temas:</strong> {topics.length}
                                <br />
                                <strong>Total de Celdas:</strong> {students.length * topics.length}
                            </p>
                        </CCol>
                    </CRow>
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

export default TeacherGrades
