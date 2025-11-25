import React from 'react';
import { 
    CCard, 
    CCardHeader, 
    CCardBody, 
    CProgress, 
    CRow, 
    CCol,
    CWidgetStatsA
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLevelUp, cilSpeedometer, cilCheck, cilStar } from '@coreui/icons';

// Datos de progreso simulados que variarían según el grado (gradeLevel) y el usuario
const progressData = {
    // Datos de ejemplo
    averageScore: '85%',
    unitsCompleted: 4,
    totalUnits: 6,
    totalQuizzes: 12,
    quizzesPassed: 10,
    currentLevel: 4,
    pointsEarned: 1500,
};

const ProgressTracker = ({ gradeLevel }) => {
    
    // Cálculos para la visualización
    const unitsProgress = (progressData.unitsCompleted / progressData.totalUnits) * 100;
    const quizzesProgress = (progressData.quizzesPassed / progressData.totalQuizzes) * 100;

    return (
        <CCard>
            <CCardHeader>
                <h5>Seguimiento de Progreso - {gradeLevel}° Grado</h5>
            </CCardHeader>
            <CCardBody>
                <p className="text-medium-emphasis mb-4">
                    Resumen de tu rendimiento académico y progreso de unidades.
                </p>

                {/* Sección 1: Indicadores Clave (Widgets) */}
                <CRow className="g-3 mb-4">
                    <CCol sm={6} lg={3}>
                        <CWidgetStatsA
                            className="mb-4"
                            color="info"
                            value={progressData.averageScore}
                            title="Puntaje Promedio"
                            icon={<CIcon icon={cilSpeedometer} size="xl" />}
                        />
                    </CCol>
                    <CCol sm={6} lg={3}>
                        <CWidgetStatsA
                            className="mb-4"
                            color="warning"
                            value={`${progressData.quizzesPassed} / ${progressData.totalQuizzes}`}
                            title="Quizzes Aprobados"
                            icon={<CIcon icon={cilCheck} size="xl" />}
                        />
                    </CCol>
                    <CCol sm={6} lg={3}>
                        <CWidgetStatsA
                            className="mb-4"
                            color="success"
                            value={progressData.currentLevel}
                            title="Nivel Actual"
                            icon={<CIcon icon={cilLevelUp} size="xl" />}
                        />
                    </CCol>
                    <CCol sm={6} lg={3}>
                        <CWidgetStatsA
                            className="mb-4"
                            color="danger"
                            value={`${progressData.pointsEarned} pts`}
                            title="Puntos de Experiencia"
                            icon={<CIcon icon={cilStar} size="xl" />}
                        />
                    </CCol>
                </CRow>
                
                {/* Sección 2: Barras de Progreso Detallado */}
                <h6 className="mt-4 mb-3">Progreso de Unidades</h6>
                <div className="mb-4">
                    <p className="small mb-1">Unidades completadas ({progressData.unitsCompleted} de {progressData.totalUnits})</p>
                    <CProgress value={unitsProgress} color="primary" height={20}>
                        {unitsProgress.toFixed(0)}%
                    </CProgress>
                </div>

                <h6 className="mt-4 mb-3">Rendimiento en Evaluaciones</h6>
                <div className="mb-4">
                    <p className="small mb-1">Evaluaciones aprobadas ({progressData.quizzesPassed} de {progressData.totalQuizzes})</p>
                    <CProgress value={quizzesProgress} color="warning" height={20}>
                        {quizzesProgress.toFixed(0)}%
                    </CProgress>
                </div>

                {/* Sección 3: Placeholder para Gráfico */}
                <h6 className="mt-4 mb-3">Histórico de Puntuaciones</h6>
                <CCard className="shadow-sm">
                    <CCardBody style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
                        {/* Aquí es donde se integraría el componente de gráfico de CoreUI React Chart.js
                            Ej: <CChart type="line" data={chartData} /> 
                        */}
                        <p className="text-muted text-center">
                            **Placeholder de Gráfico**<br />
                            (Integrar librería de *charts* de CoreUI aquí para ver la tendencia de rendimiento).
                        </p>
                    </CCardBody>
                </CCard>
                
            </CCardBody>
        </CCard>
    );
};

export default ProgressTracker;