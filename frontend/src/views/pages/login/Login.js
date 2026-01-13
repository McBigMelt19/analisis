import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { saveUserRole } from '../../../config/auth'; // Importamos la función de guardar rol
import { auto } from '@popperjs/core';

const Login = () => {
  const navigate = useNavigate();

  // Función que simula el inicio de sesión basado en el rol
  const handleLogin = (role) => {
    // 1. Guardar el rol en el almacenamiento
    saveUserRole(role);

    // 2. Redirigir según el rol
    if (role === 'teacher') {
      // Llevar directamente al módulo del profesor
      navigate('/teacher/dashboard', { replace: true })
    } else {
      // Comportamiento por defecto para estudiantes
      navigate('/home', { replace: true })
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1 className="text-center">Panel de Acceso</h1>
                    <p className="text-body-secondary text-center">Selecciona el perfil para ingresar</p>

                    {/* Campos de Login (manteniéndolos para la estética original) 
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Usuario" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    */}
                    <CRow className="align-items-center justify-content-between">
                      {/* Botón de Estudiante */}
                      <CCol xs={6} >
                        <CButton
                          color="primary"
                          className="px-4 w-100"
                          onClick={() => handleLogin('student')}
                        >
                          Acceder como Estudiante 🧑‍🎓
                        </CButton>
                      </CCol>

                      {/* Botón de Profesor */}
                      <CCol xs={6} >
                        <CButton
                          color="info"
                          className="px-4 w-100"
                          onClick={() => handleLogin('teacher')}
                        >
                          Acceder como Profesor 🧑‍🏫
                        </CButton>
                      </CCol>
                    </CRow>

                    <CRow className="mt-3">
                      <CCol xs={12} className="text-center">
                        <Link to="#">
                          {/*                          <CButton color="link" className="px-0">
                            ¿Olvidaste la Contraseña?
                          </CButton>
*/}                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>

              {/* Bloque de Registro Opcional (Comentado en tu original) */}
              <CCard className="text-white bg-secondary py-5 d-none d-md-block" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>¡Bienvenido!</h2>
                    <p>
                      Disfruta de tu acceso para ver el portal educativo.
                    </p>
                    <p>
                      Selecciona como quieres ver el contenido, si como estudiante o administrador.
                    </p>
                  </div>
                </CCardBody>
              </CCard>

            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;