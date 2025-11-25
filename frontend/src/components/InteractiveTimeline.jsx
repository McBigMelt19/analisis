import React from 'react';
import { CCard, CCardHeader, CCardBody, CAlert } from '@coreui/react';

// Si tu componente necesita el grado (ej. la línea de tiempo se centra en el 4to grado)
const InteractiveTimeline = ({ gradeLevel }) => { 
    return (
        <CCard>
            <CCardHeader>
                <h5>Línea de Tiempo Interactiva del {gradeLevel}° Grado</h5>
            </CCardHeader>
            <CCardBody>
                {/* *** AÑADE TU CÓDIGO AQUÍ ***
                  
                  Por ejemplo, el componente que renderiza la línea de tiempo 
                  usando una librería de visualización (ej. Vis.js, React Timeline).
                */}
                <CAlert color="info" className="text-center">
                    Espacio para el componente de visualización de la línea de tiempo. 
                    El grado actual es: {gradeLevel}°
                </CAlert>
                <div style={{ height: '400px', border: '1px dashed #ccc' }}>
                    {/* Aquí iría el componente de la línea de tiempo */}
                </div>
            </CCardBody>
        </CCard>
    );
};

export default InteractiveTimeline;