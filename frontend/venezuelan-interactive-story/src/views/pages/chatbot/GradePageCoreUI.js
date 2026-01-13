import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const GradePageCoreUI = () => {
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <h4>Grados Interactivos</h4>
          </CCardHeader>
          <CCardBody>
            <p>¡Bienvenido a la historia interactiva sobre Venezuela!</p>
            <p>Selecciona un grado para comenzar tu aventura:</p>
            {/* Aquí puedes agregar botones o enlaces a diferentes grados */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default GradePageCoreUI;