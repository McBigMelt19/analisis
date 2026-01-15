import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const DocsComponents = () => {
  return (
    <div>
      <h1 className="text-center mb-4">Ejemplos de Componentes</h1>
      <CRow>
        <CCol xs="12" md="6" lg="4">
          <CCard>
            <CCardHeader>
              Componente 1
            </CCardHeader>
            <CCardBody>
              <p>Descripción del Componente 1.</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs="12" md="6" lg="4">
          <CCard>
            <CCardHeader>
              Componente 2
            </CCardHeader>
            <CCardBody>
              <p>Descripción del Componente 2.</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs="12" md="6" lg="4">
          <CCard>
            <CCardHeader>
              Componente 3
            </CCardHeader>
            <CCardBody>
              <p>Descripción del Componente 3.</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default DocsComponents;