import React from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import MainChart from './MainChart';

const Dashboard = () => {
  return (
    <div>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h5>Bienvenido a la Historia Interactiva de Venezuela</h5>
            </CCardHeader>
            <CCardBody>
              <p>
                Esta es una historia interactiva diseñada para que los niños aprendan sobre la cultura, la geografía y la historia de Venezuela de una manera divertida y educativa.
              </p>
              <MainChart />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Dashboard;