import React from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardTitle, CCardText } from '@coreui/react';

const Proveedors = () => {
  return (
    <CContainer>
      <CRow className="mt-4">
        <CCol>
          <h1 className="text-center">Proveedores de Venezuela</h1>
          <p className="text-center">Descubre los mejores proveedores en el país.</p>
        </CCol>
      </CRow>
      <CRow>
        <CCol md="4">
          <CCard>
            <CCardBody>
              <CCardTitle>Proveedor 1</CCardTitle>
              <CCardText>
                Información sobre el proveedor 1. Este proveedor ofrece productos de alta calidad.
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md="4">
          <CCard>
            <CCardBody>
              <CCardTitle>Proveedor 2</CCardTitle>
              <CCardText>
                Información sobre el proveedor 2. Este proveedor es conocido por su excelente servicio al cliente.
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md="4">
          <CCard>
            <CCardBody>
              <CCardTitle>Proveedor 3</CCardTitle>
              <CCardText>
                Información sobre el proveedor 3. Este proveedor tiene una amplia gama de productos.
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Proveedors;