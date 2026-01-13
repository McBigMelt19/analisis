import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const TeacherDashboard = () => {
  return (
    <div>
      <CCard>
        <CCardHeader>
          <h4>Panel de Control del Profesor</h4>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <h5>Bienvenido al panel de control, profesor!</h5>
              <p>Aquí puedes gestionar tus clases, ver el progreso de los estudiantes y más.</p>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <h6>Acciones Rápidas:</h6>
              <ul>
                <li>Ver contenido de clase</li>
                <li>Subir notas</li>
                <li>Proporcionar retroalimentación</li>
                <li>Agregar nuevo contenido</li>
              </ul>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default TeacherDashboard;