import React from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardTitle, CCardText } from '@coreui/react';

const Stock = () => {
  return (
    <CContainer>
      <CRow className="mt-4">
        <CCol>
          <h1 className="text-center">Bienvenido a la Historia Interactiva de Venezuela</h1>
          <p className="text-center">Aquí podrás explorar diferentes aspectos de la cultura y geografía de Venezuela a través de historias interactivas.</p>
        </CCol>
      </CRow>
      <CRow className="mt-4">
        <CCol md="4">
          <CCard>
            <CCardBody>
              <CCardTitle>Explora la Naturaleza</CCardTitle>
              <CCardText>Descubre la biodiversidad de Venezuela, desde los Andes hasta la selva amazónica.</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md="4">
          <CCard>
            <CCardBody>
              <CCardTitle>Cultura y Tradiciones</CCardTitle>
              <CCardText>Conoce las tradiciones, música y danzas que hacen única a Venezuela.</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md="4">
          <CCard>
            <CCardBody>
              <CCardTitle>Gastronomía</CCardTitle>
              <CCardText>Sumérgete en los sabores de la comida venezolana y aprende a preparar platos típicos.</CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Stock;