import React, { useState } from 'react'
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
} from '@coreui/react'

const TeacherFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([
        { student: 'María González', activity: 'Examen: Independencia', date: '12/03/2025', comments: 'Excelente trabajo en el análisis de causas de la independencia.' },
        { student: 'José Martínez', activity: 'Trabajo: Simón Bolívar', date: '09/03/2025', comments: 'Buen trabajo, pero podrías profundizar más en la influencia de Bolívar.' },
    ]);

    return (
        <div className="teacher-feedback">
            <h2 className="text-primary mb-4" style={{ borderBottom: '2px solid #fcd116', paddingBottom: '10px' }}>Retroalimentación</h2>
            <p>Proporciona comentarios y sugerencias a los estudiantes sobre su desempeño.</p>

            <CCard className="mb-4 shadow-sm">
                <CCardBody>
                    <CForm>
                        <div className="mb-3">
                            <CFormLabel htmlFor="feedback-student">Seleccionar Estudiante:</CFormLabel>
                            <CFormSelect id="feedback-student">
                                <option value="">-- Selecciona un estudiante --</option>
                                <option value="1">María González</option>
                                <option value="2">José Martínez</option>
                                <option value="3">Ana López</option>
                                <option value="4">Carlos Pérez</option>
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="feedback-activity">Actividad Relacionada:</CFormLabel>
                            <CFormSelect id="feedback-activity">
                                <option value="">-- Selecciona una actividad --</option>
                                <option value="1">Examen: Independencia</option>
                                <option value="2">Trabajo: Simón Bolívar</option>
                                <option value="3">Proyecto: Historia Local</option>
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="feedback-content">Retroalimentación:</CFormLabel>
                            <CFormTextarea id="feedback-content" rows={4} placeholder="Escribe aquí tus comentarios para el estudiante..."></CFormTextarea>
                        </div>

                        <CButton color="secondary" className="text-white">Enviar Retroalimentación</CButton>
                    </CForm>
                </CCardBody>
            </CCard>

            <CCard className="shadow-sm">
                <CCardHeader className="bg-light">
                    <h3 className="mb-0 text-secondary">Historial de Retroalimentación</h3>
                </CCardHeader>
                <CCardBody>
                    <div className="table-responsive">
                        <CTable hover bordered>
                            <CTableHead color="light">
                                <CTableRow>
                                    <CTableHeaderCell>Estudiante</CTableHeaderCell>
                                    <CTableHeaderCell>Actividad</CTableHeaderCell>
                                    <CTableHeaderCell>Fecha</CTableHeaderCell>
                                    <CTableHeaderCell>Comentarios</CTableHeaderCell>
                                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {feedbacks.map((f, index) => (
                                    <CTableRow key={index}>
                                        <CTableDataCell>{f.student}</CTableDataCell>
                                        <CTableDataCell>{f.activity}</CTableDataCell>
                                        <CTableDataCell>{f.date}</CTableDataCell>
                                        <CTableDataCell>{f.comments}</CTableDataCell>
                                        <CTableDataCell>
                                            <CButton size="sm" color="secondary" className="text-white">Ver</CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </div>
                </CCardBody>
            </CCard>
        </div>
    )
}

export default TeacherFeedback
