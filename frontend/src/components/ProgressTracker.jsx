import React, { useState, useEffect } from 'react';
import { 
    CCard, 
    CCardHeader, 
    CCardBody, 
    CProgress, 
    CRow, 
    CCol,
    CWidgetStatsA,
    CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLevelUp, cilSpeedometer, cilCheck, cilStar } from '@coreui/icons';
import { getBaseURL, apiFetch } from '../services/api.config';

const ProgressTracker = ({ gradeLevel }) => {
    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            setLoading(true);
            try {
                const base = getBaseURL();

                // Intentar cargar estadísticas reales
                const statsRes = await apiFetch(`${base}/estadisticas`);
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    const stats = statsData.estadisticas || statsData;

                    setProgressData({
                        averageScore: stats.promedio ? `${(stats.promedio * 10).toFixed(0)}%` : '—',
                        unitsCompleted: stats.completadas || 0,
                        totalUnits: stats.total || 0,
                        totalQuizzes: stats.total || 0,
                        quizzesPassed: stats.completadas || 0,
                        currentLevel: Math.max(1, Math.floor((stats.promedio || 0) / 2)),
                        pointsEarned: (stats.completadas || 0) * 150 + (stats.racha || 0) * 50,
                        letra: stats.letra || '—',
                        racha: stats.racha || 0,
                        porTema: stats.porTema || {},
                    });
                } else {
                    // Fallback: cargar desde /api/progreso
                    const progRes = await apiFetch(`${base}/progreso`);
                    if (progRes.ok) {
                        const progData = await progRes.json();
                        const progresos = progData.progresos || [];
                        const totalMin = progresos.reduce((acc, p) => acc + (p.tiempo_estudiado_minutos || 0), 0);
                        const totalAct = progresos.reduce((acc, p) => acc + (p.actividades_completadas || 0), 0);

                        setProgressData({
                            averageScore: `${totalAct > 0 ? Math.round((totalAct / Math.max(1, progresos.length * 5)) * 100) : 0}%`,
                            unitsCompleted: progresos.length,
                            totalUnits: progresos.length || 6,
                            totalQuizzes: totalAct,
                            quizzesPassed: totalAct,
                            currentLevel: Math.max(1, progresos.length),
                            pointsEarned: totalMin * 10,
                            racha: 0,
                            porTema: {},
                        });
                    } else {
                        throw new Error('No se pudo cargar progreso');
                    }
                }
            } catch (err) {
                console.warn('Error cargando progreso, usando defaults:', err.message);
                setProgressData({
                    averageScore: '—',
                    unitsCompleted: 0,
                    totalUnits: 0,
                    totalQuizzes: 0,
                    quizzesPassed: 0,
                    currentLevel: 1,
                    pointsEarned: 0,
                    racha: 0,
                    porTema: {},
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [gradeLevel]);

    if (loading) {
        return (
            <CCard className="text-center p-5">
                <CSpinner color="primary" />
                <p className="mt-3 text-muted">Cargando progreso...</p>
            </CCard>
        );
    }

    const unitsProgress = progressData.totalUnits > 0 
        ? (progressData.unitsCompleted / progressData.totalUnits) * 100 
        : 0;
    const quizzesProgress = progressData.totalQuizzes > 0 
        ? (progressData.quizzesPassed / progressData.totalQuizzes) * 100 
        : 0;

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

                {/* Sección 3: Racha de actividad */}
                {progressData.racha > 0 && (
                    <div className="mt-4 p-3 rounded" style={{ background: 'linear-gradient(135deg, #FFD100, #FFA000)', color: '#002244' }}>
                        <h6 className="mb-0">🔥 Racha activa: {progressData.racha} {progressData.racha === 1 ? 'día' : 'días'} consecutivos</h6>
                    </div>
                )}

                {/* Sección 4: Progreso por Tema */}
                {Object.keys(progressData.porTema || {}).length > 0 && (
                    <>
                        <h6 className="mt-4 mb-3">Rendimiento por Tema</h6>
                        {Object.entries(progressData.porTema).map(([tema, data]) => (
                            <div key={tema} className="mb-3">
                                <p className="small mb-1">{tema} — Promedio: {data.promedio} ({data.total} evaluaciones)</p>
                                <CProgress value={(data.promedio / 10) * 100} color={data.promedio >= 7 ? 'success' : data.promedio >= 5 ? 'warning' : 'danger'} height={16}>
                                    {data.promedio}
                                </CProgress>
                            </div>
                        ))}
                    </>
                )}
                
            </CCardBody>
        </CCard>
    );
};

export default ProgressTracker;