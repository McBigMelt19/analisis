import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const PersonalizedContent = () => {
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <h4>¡Bienvenido a la Historia Interactiva de Venezuela!</h4>
          </CCardHeader>
          <CCardBody>
            <p>
              En esta historia, explorarás los hermosos paisajes, la rica cultura y la historia fascinante de Venezuela. 
              ¡Prepárate para una aventura llena de diversión y aprendizaje!
            </p>
            <p>
              A medida que avances, encontrarás personajes amigables que te guiarán y te ayudarán a descubrir más sobre 
              este maravilloso país. ¡Haz clic en los enlaces a continuación para comenzar tu viaje!
            </p>
            <ul>
              <li><a href="/venezuela/landmarks">Lugares Emblemáticos</a></li>
              <li><a href="/venezuela/culture">Cultura y Tradiciones</a></li>
              <li><a href="/venezuela/animals">Fauna y Flora</a></li>
              <li><a href="/venezuela/history">Historia de Venezuela</a></li>
            </ul>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default PersonalizedContent;