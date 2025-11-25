import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { CCard, CCardBody, CNav, CNavItem, CNavLink, CTabContent, CTabPane, CRow, CCol, CContainer } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBook, cilHistory, cilPuzzle, cilCompass, cilChart } from '@coreui/icons';

// Importa los componentes de contenido (deberás crearlos en tu proyecto)
// Nota: Se asume que estos componentes existen en un path relativo adecuado.
import PersonalizedContent from '../../../components/PersonalizedContent';
import InteractiveTimeline from '../../../components/InteractiveTimeline';
import GamifiedQuiz from '../../../components/GamifiedQuiz';
import VirtualFieldTrip from '../../../components/VirtualFieldTrip';
import ProgressTracker from '../../../components/ProgressTracker';
// El componente en CoreUI generalmente recibe los parámetros de la ruta (route params)
// a través del hook `useParams` de `react-router-dom`.
const GradePageCoreUI = () => {
  // Obtenemos el parámetro 'grade' de la URL (ej: /portal/5)
  const { grade } = useParams();
  
  // Convertimos el parámetro a número y validamos
  const gradeNumber = parseInt(grade);
  const isValidGrade = !isNaN(gradeNumber) && gradeNumber >= 1 && gradeNumber <= 6;

  // Manejo de grado no válido (redirección o mensaje de error)
  if (!isValidGrade) {
    // Si usas un router moderno, es mejor redirigir a una página 404 o de error
    // En este ejemplo, usaremos una redirección simple o un mensaje.
    // **Opción 1: Redirección (Si estás dentro de un Router)**
    // return <Navigate to="/404" replace />;
    
    // **Opción 2: Mensaje de error simple (estilo CoreUI)**
    return (
      <CContainer className="py-5">
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCard className="text-center">
              <CCardBody>
                <h1 className="display-4">Grado no Válido</h1>
                <p className="lead">El grado especificado ({grade}) no se encuentra en el rango de 1° a 6°.</p>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    );
  }

// 1. ESTADO: Define el estado de la pestaña activa usando useState.
  // Inicializamos la pestaña activa en 'contenido'.
  const [activeKey, setActiveKey] = React.useState('contenido'); 

  // 2. EFECTO: Usa useEffect para forzar el reinicio (Recarga de datos/estado)
  // ESTA ES LA SOLUCIÓN B que discutimos para la recarga.
  React.useEffect(() => {
    // Esto asegura que cada vez que el `grade` de la URL cambie (ej: de 1 a 2),
    // el estado de la pestaña se restablece a 'contenido'.
    setActiveKey('contenido'); 
  }, [grade]); // <-- Ahora es un useEffect independiente, escuchando a 'grade'
  
  return (
    <>
      <CRow className="mb-4 align-items-center">
        <CCol>
          <h1 className="text-primary">
            Portal del {gradeNumber}° Grado
          </h1>
          <p className="text-medium-emphasis">
            ¡Bienvenido a tu aventura por la historia de Venezuela!
          </p>
        </CCol>
      </CRow>

      <CCard>
        <CCardBody>
          {/* Componente CNav (similar a TabsList y TabsTrigger) */}
          <CNav variant="tabs" role="tablist">
            <CNavItem>
              <CNavLink
                href="#"
                active={activeKey === 'contenido'}
                onClick={() => setActiveKey('contenido')}
              >
                <CIcon icon={cilBook} className="me-2" />
                Contenido
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="#"
                active={activeKey === 'linea-tiempo'}
                onClick={() => setActiveKey('linea-tiempo')}
              >
                <CIcon icon={cilHistory} className="me-2" />
                Línea de Tiempo
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="#"
                active={activeKey === 'examen'}
                onClick={() => setActiveKey('examen')}
              >
                <CIcon icon={cilPuzzle} className="me-2" />
                Examen
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="#"
                active={activeKey === 'viaje-virtual'}
                onClick={() => setActiveKey('viaje-virtual')}
              >
                <CIcon icon={cilCompass} className="me-2" />
                Viaje Virtual
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href="#"
                active={activeKey === 'progreso'}
                onClick={() => setActiveKey('progreso')}
              >
                <CIcon icon={cilChart} className="me-2" />
                Progreso
              </CNavLink>
            </CNavItem>
          </CNav>
          
          {/* Contenido de las pestañas (similar a TabsContent) */}
          <CTabContent className="mt-4">
            <CTabPane role="tabpanel" visible={activeKey === 'contenido'}>
              <PersonalizedContent gradeLevel={grade} />
            </CTabPane>
            <CTabPane role="tabpanel" visible={activeKey === 'linea-tiempo'}>
              <InteractiveTimeline />
            </CTabPane>
            <CTabPane role="tabpanel" visible={activeKey === 'examen'}>
              <GamifiedQuiz />
            </CTabPane>
            <CTabPane role="tabpanel" visible={activeKey === 'viaje-virtual'}>
              <VirtualFieldTrip />
            </CTabPane>
            <CTabPane role="tabpanel" visible={activeKey === 'progreso'}>
              <ProgressTracker />
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </>
  );
};

// Establece el nombre del componente para facilitar la depuración
GradePageCoreUI.displayName = 'GradePageCoreUI';

// Exporta el componente por defecto
export default GradePageCoreUI;