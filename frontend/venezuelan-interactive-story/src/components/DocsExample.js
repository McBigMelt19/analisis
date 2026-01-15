import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const DocsExample = () => {
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <h5>Ejemplo Interactivo: Historia de Venezuela</h5>
          </CCardHeader>
          <CCardBody>
            <p>Bienvenido a la historia interactiva de Venezuela. Aquí podrás explorar diferentes aspectos de la cultura, geografía y tradiciones de este hermoso país.</p>
            <h6>¿Qué aprenderás?</h6>
            <ul>
              <li>Geografía de Venezuela</li>
              <li>Cultura y tradiciones</li>
              <li>Personajes históricos importantes</li>
              <li>Comida típica</li>
            </ul>
            <p>Haz clic en los enlaces de navegación para comenzar tu aventura.</p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default DocsExample;