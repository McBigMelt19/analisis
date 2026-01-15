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
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      // Redirigir según el rol
      if (result.user.role === 'teacher') {
        navigate('/teacher/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1 className="text-center">Iniciar Sesión</h1>
                    <p className="text-body-secondary text-center">Historia de Venezuela - LMS</p>

                    {error && (
                      <CAlert color="danger" dismissible onClose={() => setError('')}>
                        {error}
                      </CAlert>
                    )}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Usuario"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol xs={12}>
                        <CButton
                          color="primary"
                          className="px-4 w-100"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Iniciando sesión...' : 'Ingresar'}
                        </CButton>
                      </CCol>
                    </CRow>

                    <CRow className="mt-3">
                      <CCol xs={12} className="text-center text-muted">
                        <small>
                          💡 Tip: Usa "prof.maria.rodriguez" o "juan.silva" / Password: "123456"
                        </small>
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