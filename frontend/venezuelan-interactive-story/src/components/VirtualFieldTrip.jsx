import React from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardTitle, CCardText } from '@coreui/react';

const VirtualFieldTrip = () => {
  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCard className="mt-4">
            <CCardBody>
              <CCardTitle className="text-center">¡Bienvenidos a un Viaje Virtual por Venezuela!</CCardTitle>
              <CCardText>
                En este viaje, exploraremos la rica cultura, la hermosa naturaleza y la historia fascinante de Venezuela. 
                Prepárense para aprender sobre los paisajes impresionantes, la música vibrante y la deliciosa comida que 
                este país tiene para ofrecer. ¡Vamos a comenzar nuestra aventura!
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default VirtualFieldTrip;