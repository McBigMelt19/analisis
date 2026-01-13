import React from 'react'
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
} from '@coreui/react'

const TeacherContent = () => {
    return (
        <div className="teacher-content">
            <h2 className="text-primary mb-4" style={{ borderBottom: '2px solid #fcd116', paddingBottom: '10px' }}>Gestión de Contenido</h2>
            <p>Desde aquí puedes gestionar todo el contenido educativo disponible para los estudiantes.</p>

            <CRow className="mb-4">
                <CCol md={4} className="mb-3">
                    <CCard className="h-100 shadow-sm hover-effect">
                        <CCardBody>
                            <h3 className="text-secondary">Lecciones Publicadas</h3>
                            <p>Gestiona las lecciones que están disponibles para los estudiantes.</p>
                            <CButton color="secondary" className="text-white">Ver Lecciones</CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol md={4} className="mb-3">
                    <CCard className="h-100 shadow-sm hover-effect">
                        <CCardBody>
                            <h3 className="text-secondary">Material de Apoyo</h3>
                            <p>Documentos, presentaciones y recursos adicionales para los estudiantes.</p>
                            <CButton color="secondary" className="text-white">Gestionar Material</CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol md={4} className="mb-3">
                    <CCard className="h-100 shadow-sm hover-effect">
                        <CCardBody>
                            <h3 className="text-secondary">Actividades</h3>
                            <p>Ejercicios, tareas y actividades de aprendizaje.</p>
                            <CButton color="secondary" className="text-white">Ver Actividades</CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CCard className="shadow-sm">
                <CCardHeader className="bg-light">
                    <h3 className="mb-0 text-secondary">Contenido Reciente</h3>
                </CCardHeader>
                <CCardBody>
                    <div className="table-responsive">
                        <CTable hover bordered>
                            <CTableHead color="light">
                                <CTableRow>
                                    <CTableHeaderCell>Título</CTableHeaderCell>
                                    <CTableHeaderCell>Tipo</CTableHeaderCell>
                                    <CTableHeaderCell>Fecha de Publicación</CTableHeaderCell>
                                    <CTableHeaderCell>Estado</CTableHeaderCell>
                                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                <CTableRow>
                                    <CTableDataCell>Independencia de Venezuela</CTableDataCell>
                                    <CTableDataCell>Lección</CTableDataCell>
                                    <CTableDataCell>15/03/2025</CTableDataCell>
                                    <CTableDataCell>Publicado</CTableDataCell>
                                    <CTableDataCell>
                                        <CButton size="sm" color="secondary" className="me-2 text-white">Editar</CButton>
                                        <CButton size="sm" color="danger" className="text-white">Eliminar</CButton>
                                    </CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableDataCell>Simón Bolívar - Biografía</CTableDataCell>
                                    <CTableDataCell>Material de Apoyo</CTableDataCell>
                                    <CTableDataCell>10/03/2025</CTableDataCell>
                                    <CTableDataCell>Publicado</CTableDataCell>
                                    <CTableDataCell>
                                        <CButton size="sm" color="secondary" className="me-2 text-white">Editar</CButton>
                                        <CButton size="sm" color="danger" className="text-white">Eliminar</CButton>
                                    </CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableDataCell>Ejercicio: Línea de Tiempo</CTableDataCell>
                                    <CTableDataCell>Actividad</CTableDataCell>
                                    <CTableDataCell>05/03/2025</CTableDataCell>
                                    <CTableDataCell>Borrador</CTableDataCell>
                                    <CTableDataCell>
                                        <CButton size="sm" color="secondary" className="me-2 text-white">Editar</CButton>
                                        <CButton size="sm" color="danger" className="text-white">Eliminar</CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                    </div>
                </CCardBody>
            </CCard>
        </div>
    )
}

export default TeacherContent
