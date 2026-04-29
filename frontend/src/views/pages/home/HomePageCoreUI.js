import React from 'react';
import { Link } from 'react-router-dom';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardTitle, CCardText, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
    cilChart,
    cilPuzzle,
    cilCommentBubble,
    cilCalculator,
    cilList,
    cilSettings,
} from '@coreui/icons';

const TOPICS = [
    {
        id: 1,
        icon: cilChart,
        title: 'Mi Progreso 📊',
        description: 'Revisa tu avance y logros en el aprendizaje de la historia de Venezuela.',
        color: '#0088cc',
        route: '/student/progress'
    },
    {
        id: 2,
        icon: cilPuzzle,
        title: 'Contenido Interactivo 🎮',
        description: 'Aprende de forma divertida con videos, juegos y actividades interactivas.',
        color: '#FF6B3D',
        route: '/student/content'
    },
    {
        id: 3,
        icon: cilCommentBubble,
        title: 'Chatbot IA 🤖',
        description: 'Pregúntale al asistente virtual sobre la historia y cultura venezolana.',
        color: '#9C27B0',
        route: '/student/chatbot'
    },
    {
        id: 4,
        icon: cilCalculator,
        title: 'Mis Notas 📒',
        description: 'Consulta tus calificaciones y evaluaciones de cada tema.',
        color: '#4CAF50',
        route: '/student/grades'
    },

];

const HomePageCoreUI = () => {
    return (
        <>
            <section style={{ backgroundColor: '#f8f9fa', minHeight: '400px', display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <CContainer className="py-5 z-1">
                    <CRow className="justify-content-center">
                        <CCol md={10} lg={8}>
                            <h1 className="display-4 fw-bold text-primary">La Historia Venezuela</h1>
                            <p className="lead text-medium-emphasis mt-3">
                                Un viaje interactivo y divertido a través de la historia y cultura de Venezuela, adaptado para ti.
                            </p>
                            <div className="mt-4">
                                <CButton
                                    color="primary"
                                    size="lg"
                                    href="#grados"
                                    style={{
                                        fontSize: '1.5rem',
                                        padding: '1rem 3rem',
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        borderRadius: '50px',
                                        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                                        transition: 'all 0.3s ease',
                                        animation: 'pulse 2s infinite'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.6)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                                    }}
                                >
                                    🚀 ¡Comenzar a Explorar!
                                </CButton>
                            </div>
                            <style>{`
                                @keyframes pulse {
                                    0%, 100% {
                                        transform: scale(1);
                                    }
                                    50% {
                                        transform: scale(1.05);
                                    }
                                }
                            `}</style>
                        </CCol>
                    </CRow>
                </CContainer>
            </section>

            <section id="grados" className="py-5">
                <CContainer>
                    <CRow className="justify-content-center text-center mb-5">
                        <CCol md={10} lg={8}>
                            <h2 className="display-6 fw-bold">Explora la Historia de Venezuela</h2>
                            <p className="lead text-medium-emphasis">
                                Descubre los temas más importantes de nuestra historia y cultura. ¡Cada tema es una aventura de aprendizaje!
                            </p>
                        </CCol>
                    </CRow>

                    <CRow className="g-4">
                        {TOPICS.map(({ id, icon, title, description, color, route }) => (
                            <CCol key={id} sm={6} lg={4}>
                                <Link to={route} style={{ textDecoration: 'none' }}>
                                    <CCard
                                        className="h-100 shadow-sm border-0"
                                        style={{
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                                            e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                        }}
                                    >
                                        <CCardBody className="text-center p-4">
                                            <div
                                                className="mx-auto rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    backgroundColor: color,
                                                    color: 'white',
                                                    boxShadow: `0 4px 15px ${color}40`
                                                }}
                                            >
                                                <CIcon icon={icon} size="xxl" />
                                            </div>
                                            <CCardTitle className="h5 fw-bold mb-3">{title}</CCardTitle>
                                            <CCardText className="text-medium-emphasis">{description}</CCardText>
                                            <CButton
                                                color="primary"
                                                variant="outline"
                                                size="md"
                                                className="mt-3"
                                                style={{
                                                    borderRadius: '25px',
                                                    fontWeight: 'bold',
                                                    padding: '0.5rem 1.5rem'
                                                }}
                                            >
                                                ¡Explorar! 🎯
                                            </CButton>
                                        </CCardBody>
                                    </CCard>
                                </Link>
                            </CCol>
                        ))}
                    </CRow>
                </CContainer>
            </section>
        </>
    );
};

export default HomePageCoreUI;