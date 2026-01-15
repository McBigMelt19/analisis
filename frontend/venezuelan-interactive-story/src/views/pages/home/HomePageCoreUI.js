import React from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardTitle, CCardText } from '@coreui/react';

const HomePageCoreUI = () => {
  return (
    <CContainer fluid>
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCard className="text-center">
            <CCardBody>
              <CCardTitle className="display-4">¡Bienvenidos a la Historia Interactiva de Venezuela!</CCardTitle>
              <CCardText>
                Sumérgete en una aventura llena de colores, cultura y diversión mientras exploras la hermosa tierra de Venezuela.
              </CCardText>
              <CCardText>
                Acompáñanos en este viaje donde aprenderás sobre la historia, la naturaleza y las tradiciones de nuestro país.
              </CCardText>
              <CCardText>
                ¡Haz clic en los enlaces de navegación para comenzar tu aventura!
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default HomePageCoreUI;