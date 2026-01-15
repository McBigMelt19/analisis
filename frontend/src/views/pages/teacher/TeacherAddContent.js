import React from 'react'
import {
    CCard,
    CCardBody,
    CButton,
    CForm,
    CFormLabel,
    CFormSelect,
    CFormInput,
    CFormTextarea,
} from '@coreui/react'

const TeacherAddContent = () => {
    return (
        <div className="teacher-add-content">
            <h2 className="text-primary mb-4" style={{ borderBottom: '2px solid #fcd116', paddingBottom: '10px' }}>Agregar Nuevo Contenido</h2>
            <p>Crea y publica nuevo material educativo para los estudiantes.</p>

            <CCard className="shadow-sm">
                <CCardBody>
                    <CForm>
                        <div className="mb-3">
                            <CFormLabel htmlFor="content-type">Tipo de Contenido:</CFormLabel>
                            <CFormSelect id="content-type">
                                <option value="">-- Selecciona el tipo --</option>
                                <option value="lesson">Lección</option>
                                <option value="material">Material de Apoyo</option>
                                <option value="activity">Actividad</option>
                                <option value="resource">Recurso Adicional</option>
                            </CFormSelect>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="content-title">Título:</CFormLabel>
                            <CFormInput type="text" id="content-title" placeholder="Título del contenido" />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="content-description">Descripción:</CFormLabel>
                            <CFormTextarea id="content-description" rows={4} placeholder="Descripción del contenido..."></CFormTextarea>
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="content-file">Subir Archivo (Opcional):</CFormLabel>
                            <CFormInput type="file" id="content-file" />
                        </div>

                        <div className="mb-4">
                            <CFormLabel htmlFor="content-visibility">Visibilidad:</CFormLabel>
                            <CFormSelect id="content-visibility">
                                <option value="published">Publicado (Visible para estudiantes)</option>
                                <option value="draft">Borrador (Solo visible para profesores)</option>
                            </CFormSelect>
                        </div>

                        <CButton color="secondary" className="text-white">Guardar Contenido</CButton>
                    </CForm>
                </CCardBody>
            </CCard>
        </div>
    )
}

export default TeacherAddContent
