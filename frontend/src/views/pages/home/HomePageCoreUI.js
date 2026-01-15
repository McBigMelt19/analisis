import React from 'react';
import { Link } from 'react-router-dom';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardTitle, CCardText, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';

const GRADES = [
    { grade: 1, icon: '1', title: 'Primer Grado', description: 'Descubre los símbolos y héroes de nuestra nación.' },
    { grade: 2, icon: '2', title: 'Segundo Grado', description: 'Explora las historias de los primeros habitantes.' },
    { grade: 3, icon: '3', title: 'Tercer Grado', description: 'Viaja a la época de la independencia.' },
    { grade: 4, icon: '4', title: 'Cuarto Grado', description: 'Conoce la formación de la república.' },
    { grade: 5, icon: '5', title: 'Quinto Grado', description: 'Analiza los eventos del siglo XX.' },
    { grade: 6, icon: '6', title: 'Sexto Grado', description: 'Comprende la Venezuela contemporánea.' },
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
                                <CButton color="primary" size="lg" href="#grados">
                                    Comenzar a Explorar
                                </CButton>
                            </div>
                        </CCol>
                    </CRow>
                </CContainer>
            </section>

            <section id="grados" className="py-5">
                <CContainer>
                    <CRow className="justify-content-center text-center mb-5">
                        <CCol md={10} lg={8}>
                            <h2 className="display-6 fw-bold">Elige tu Grado</h2>
                            <p className="lead text-medium-emphasis">
                                Cada grado ofrece una aventura única en la historia de Venezuela. ¿Listo para empezar?
                            </p>
                        </CCol>
                    </CRow>

                    <CRow className="g-4">
                        {GRADES.map(({ grade, icon, title, description }) => (
                            <CCol key={grade} sm={6} lg={4}>
                                <Link to={`/student/grade/${grade}`} className="text-decoration-none">
                                    <CCard className="h-100 shadow-sm border-0 transition-shadow hover-shadow-lg hover-bg-light">
                                        <CCardBody className="text-center p-4">
                                            <div className="mx-auto rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                                                <CIcon icon={icon} size="xl" />
                                            </div>
                                            <CCardTitle className="h5 fw-bold">{title}</CCardTitle>
                                            <CCardText className="text-medium-emphasis">{description}</CCardText>
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