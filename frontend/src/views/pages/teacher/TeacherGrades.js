import React, { useState } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
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
    CFormInput,
    CFormTextarea,
} from '@coreui/react'

const TeacherGrades = () => {
    // Basic state for simulation
    const [grades, setGrades] = useState([
        { student: 'María González', activity: 'Examen: Independencia', grade: 18.5, date: '10/03/2025' },
        { student: 'José Martínez', activity: 'Trabajo: Simón Bolívar', grade: 16.0, date: '08/03/2025' },
        { student: 'Ana López', activity: 'Proyecto: Historia Local', grade: 19.0, date: '05/03/2025' },
    ]);

    return (
        <div className="teacher-grades">
            <h2 className="text-primary mb-4" style={{ borderBottom: '2px solid #fcd116', paddingBottom: '10px' }}>Subir Notas</h2>
            <p>Gestiona y actualiza las calificaciones de los estudiantes.</p>

            <CCard className="mb-4 shadow-sm">
                <CCardBody>
                    <CForm>
                        <div className="mb-3">
                            <CFormLabel htmlFor="student-select">Seleccionar Estudiante:</CFormLabel>
                            <CFormSelect id="student-select">
                                <option value="">-- Selecciona un estudiante --</option>
                                <option value="1">María González</option>
                                <option value="2">José Martínez</option>
                                <option value="3">Ana López</option>
                                <option value="4">Carlos Pérez</option>
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="activity-select">Seleccionar Actividad:</CFormLabel>
                            <CFormSelect id="activity-select">
                                <option value="">-- Selecciona una actividad --</option>
                                <option value="1">Examen: Independencia</option>
                                <option value="2">Trabajo: Simón Bolívar</option>
                                <option value="3">Proyecto: Historia Local</option>
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="grade">Calificación (0-20):</CFormLabel>
                            <CFormInput type="number" id="grade" min="0" max="20" step="0.5" />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="comments">Comentarios:</CFormLabel>
                            <CFormTextarea id="comments" rows={3} placeholder="Observaciones sobre la calificación..."></CFormTextarea>
                        </div>

                        <CButton color="secondary" className="text-white">Guardar Calificación</CButton>
                    </CForm>
                </CCardBody>
            </CCard>

            <CCard className="shadow-sm">
                <CCardHeader className="bg-light">
                    <h3 className="mb-0 text-secondary">Calificaciones Registradas</h3>
                </CCardHeader>
                <CCardBody>
                    <div className="table-responsive">
                        <CTable hover bordered>
                            <CTableHead color="light">
                                <CTableRow>
                                    <CTableHeaderCell>Estudiante</CTableHeaderCell>
                                    <CTableHeaderCell>Actividad</CTableHeaderCell>
                                    <CTableHeaderCell>Calificación</CTableHeaderCell>
                                    <CTableHeaderCell>Fecha</CTableHeaderCell>
                                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {grades.map((g, index) => (
                                    <CTableRow key={index}>
                                        <CTableDataCell>{g.student}</CTableDataCell>
                                        <CTableDataCell>{g.activity}</CTableDataCell>
                                        <CTableDataCell>{g.grade}</CTableDataCell>
                                        <CTableDataCell>{g.date}</CTableDataCell>
                                        <CTableDataCell>
                                            <CButton size="sm" color="secondary" className="text-white">Editar</CButton>
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

export default TeacherGrades
