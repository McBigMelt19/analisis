import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const Parts = () => {
  return (
    <CCard>
      <CCardHeader>
        <h5>Partes del Vehículo</h5>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol>
            <h6>1. Motor</h6>
            <p>Descripción: El motor es el corazón del vehículo, responsable de su movimiento.</p>
          </CCol>
          <CCol>
            <h6>2. Transmisión</h6>
            <p>Descripción: La transmisión se encarga de transferir la potencia del motor a las ruedas.</p>
          </CCol>
          <CCol>
            <h6>3. Frenos</h6>
            <p>Descripción: Los frenos son esenciales para detener el vehículo de manera segura.</p>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <h6>4. Suspensión</h6>
            <p>Descripción: La suspensión proporciona estabilidad y confort al conducir.</p>
          </CCol>
          <CCol>
            <h6>5. Ruedas</h6>
            <p>Descripción: Las ruedas son fundamentales para el movimiento y la dirección del vehículo.</p>
          </CCol>
          <CCol>
            <h6>6. Sistema Eléctrico</h6>
            <p>Descripción: El sistema eléctrico alimenta todos los componentes electrónicos del vehículo.</p>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default Parts;