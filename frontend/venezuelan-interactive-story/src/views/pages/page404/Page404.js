import React from 'react';
import { CContainer, CRow, CCol, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilWarning } from '@coreui/icons';

const Page404 = () => {
  return (
    <CContainer className="text-center">
      <CRow className="justify-content-center">
        <CCol md="6">
          <h1 className="display-1 fw-bold">404</h1>
          <h2 className="fs-3">¡Oops! Página no encontrada.</h2>
          <p className="fs-5">
            La página que estás buscando no existe. 
            <br />
            Verifica la URL o regresa a la página de inicio.
          </p>
          <CButton color="primary" href="/">
            Regresar a Inicio
          </CButton>
          <div className="mt-4">
            <CIcon icon={cilWarning} size="lg" />
          </div>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Page404;