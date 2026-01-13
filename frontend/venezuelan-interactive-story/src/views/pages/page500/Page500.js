import React from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardTitle, CCardText } from '@coreui/react';

const Page500 = () => {
  return (
    <CContainer className="mt-5">
      <CRow className="justify-content-center">
        <CCol md="6">
          <CCard className="text-center">
            <CCardBody>
              <CCardTitle className="display-1">500</CCardTitle>
              <CCardText className="lead">¡Ups! Algo salió mal.</CCardText>
              <CCardText>
                Por favor, intenta recargar la página o vuelve más tarde.
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Page500;