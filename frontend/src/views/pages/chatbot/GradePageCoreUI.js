import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CCard, CCardBody, CNav, CNavItem, CNavLink, CTabContent, CTabPane, CRow, CCol } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBook, cilHistory, cilPuzzle, cilCompass, cilChart } from '@coreui/icons';

import PersonalizedContent from '../../../components/PersonalizedContent';
import InteractiveTimeline from '../../../components/InteractiveTimeline';
import GamifiedQuiz from '../../../components/GamifiedQuiz';
import VirtualFieldTrip from '../../../components/VirtualFieldTrip';
import ProgressTracker from '../../../components/ProgressTracker';

const VALID_GRADES = [1, 2, 3, 4, 5, 6];
const TABS = {
  CONTENT: 'contenido',
  TIMELINE: 'linea-tiempo',
  QUIZ: 'examen',
  TRIP: 'viaje-virtual',
  PROGRESS: 'progreso',
};

const GradePageCoreUI = () => {
  const { grade } = useParams();
  const [activeTab, setActiveTab] = useState(TABS.CONTENT);

  const gradeNumber = parseInt(grade);
  const isValidGrade = VALID_GRADES.includes(gradeNumber);

  useEffect(() => {
    setActiveTab(TABS.CONTENT);
  }, [grade]);

  if (!isValidGrade) {
    return (
      <CRow className="justify-content-center py-5">
        <CCol md={8}>
          <CCard className="text-center">
            <CCardBody>
              <h1 className="display-4">Grado no Válido</h1>
              <p className="lead">El grado {grade} no existe. Selecciona entre 1° y 6°.</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  }

  return (
    <>
      <CRow className="mb-4">
        <CCol>
          <h1 className="text-primary">Portal del {gradeNumber}° Grado</h1>
          <p className="text-medium-emphasis">¡Bienvenido a tu aventura por la historia de Venezuela!</p>
        </CCol>
      </CRow>

      <CCard>
        <CCardBody>
          <CNav variant="tabs" role="tablist">
            <CNavItem>
              <CNavLink
                href="#"
                active={activeTab === TABS.CONTENT}
                onClick={() => setActiveTab(TABS.CONTENT)}
              >
                <CIcon icon={cilBook} className="me-2" />
                Contenido
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="#"
                active={activeTab === TABS.TIMELINE}
                onClick={() => setActiveTab(TABS.TIMELINE)}
              >
                <CIcon icon={cilHistory} className="me-2" />
                Contenido Interactivo
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="#"
                active={activeTab === TABS.QUIZ}
                onClick={() => setActiveTab(TABS.QUIZ)}
              >
                <CIcon icon={cilPuzzle} className="me-2" />
                Examen
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="#"
                active={activeTab === TABS.TRIP}
                onClick={() => setActiveTab(TABS.TRIP)}
              >
                <CIcon icon={cilCompass} className="me-2" />
                Actividades y Juegos
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="#"
                active={activeTab === TABS.PROGRESS}
                onClick={() => setActiveTab(TABS.PROGRESS)}
              >
                <CIcon icon={cilChart} className="me-2" />
                Progreso
              </CNavLink>
            </CNavItem>
          </CNav>

          <CTabContent className="mt-4">
            <CTabPane role="tabpanel" visible={activeTab === TABS.CONTENT}>
              <PersonalizedContent gradeLevel={grade} />
            </CTabPane>
            <CTabPane role="tabpanel" visible={activeTab === TABS.TIMELINE}>
              <InteractiveTimeline gradeLevel={grade} />
            </CTabPane>
            <CTabPane role="tabpanel" visible={activeTab === TABS.QUIZ}>
              <GamifiedQuiz gradeLevel={grade} />
            </CTabPane>
            <CTabPane role="tabpanel" visible={activeTab === TABS.TRIP}>
              <VirtualFieldTrip gradeLevel={grade} />
            </CTabPane>
            <CTabPane role="tabpanel" visible={activeTab === TABS.PROGRESS}>
              <ProgressTracker gradeLevel={grade} />
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </>
  );
};

export default GradePageCoreUI;