import React from 'react';
import { CContainer, CRow, CCol } from '@coreui/react';

const AppFooter = () => {
  return (
    <footer className="footer">
      <CContainer fluid>
        <CRow>
          <CCol className="text-center">
            <p style={{ color: '#FFD700', fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>
              &copy; {new Date().getFullYear()} Historia Interactiva de Venezuela. Todos los derechos reservados.
            </p>
          </CCol>
        </CRow>
      </CContainer>
    </footer>
  );
};

export default AppFooter;