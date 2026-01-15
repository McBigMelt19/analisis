import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const Cars = () => {
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <h5>Autos en el Stock</h5>
          </CCardHeader>
          <CCardBody>
            <p>Bienvenido a la sección de autos. Aquí podrás explorar diferentes modelos de autos disponibles.</p>
            {/* Aquí puedes agregar más contenido interactivo relacionado con los autos */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Cars;