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
import { isBackendMode } from '../../../services/api.config';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // ── Validaciones ──
  // Acepta username (modo local) o email (modo render)
  const validarUsername = (val) => {
    if (!val.trim()) return 'El campo es obligatorio';
    if (/\s/.test(val)) return 'No puede contener espacios';
    // En modo render, permitir formato de email
    if (isBackendMode()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
        return 'Ingresa un email válido (ej: usuario@correo.com)';
      return '';
    }
    // En modo local, validar como username
    if (/[,;:'"!#$%^&*()+=\[\]{}|\\/\<\>?`~]/.test(val))
      return 'El usuario no puede contener caracteres especiales';
    if (!/^[a-zA-Z0-9._@-]+$/.test(val))
      return 'Solo se permiten letras, números, puntos (.), guiones (-) y guiones bajos (_)';
    return '';
  };

  // Contraseña: no puede tener espacios
  const validarPassword = (val) => {
    if (!val) return 'La contraseña es obligatoria';
    if (/\s/.test(val)) return 'La contraseña no puede contener espacios';
    return '';
  };

  const handleUsernameChange = (e) => {
    const val = e.target.value;
    setUsername(val);
    const err = validarUsername(val);
    setFieldErrors((prev) => ({ ...prev, username: err }));
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    const err = validarPassword(val);
    setFieldErrors((prev) => ({ ...prev, password: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar antes de enviar
    const usernameErr = validarUsername(username);
    const passwordErr = validarPassword(password);
    setFieldErrors({ username: usernameErr, password: passwordErr });

    if (usernameErr || passwordErr) return;

    setLoading(true);

    const result = await login(username.trim(), password.trim());

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
    <div
      className="min-vh-100 d-flex flex-row align-items-center"
      style={{
        background: '#FEF8E6',
      }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10} lg={9} xl={8}>
            <CCardGroup
              style={{
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                overflow: 'hidden',
              }}
            >
              {/* Panel izquierdo - Formulario */}
              <CCard className="border-0" style={{ borderRadius: 0 }}>
                {/* Header con amarillo de Venezuela */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #FFD100 0%, #FFA000 100%)',
                    padding: '28px 24px 20px',
                    textAlign: 'center',
                  }}
                >
                  <h1
                    style={{
                      color: '#002244',
                      fontWeight: '700',
                      fontSize: '1.75rem',
                      marginBottom: '4px',
                      letterSpacing: '0.5px',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}
                  >
                    Iniciar Sesión
                  </h1>
                  <p style={{ color: 'rgba(0,34,68,0.7)', margin: 0, fontSize: '0.95rem', fontWeight: '500' }}>
                    Historia de Venezuela - LMS
                  </p>
                </div>

                <CCardBody className="p-4">
                  <CForm onSubmit={handleSubmit}>
                    {error && (
                      <CAlert
                        color="danger"
                        dismissible
                        onClose={() => setError('')}
                        style={{ borderRadius: '10px', fontSize: '0.9rem' }}
                      >
                        {error}
                      </CAlert>
                    )}

                    <CInputGroup className="mb-1">
                      <CInputGroupText
                        style={{
                          background: 'linear-gradient(135deg, #003893, #002766)',
                          border: 'none',
                          color: '#FFD100',
                        }}
                      >
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder={isBackendMode() ? "Email" : "Usuario"}
                        autoComplete={isBackendMode() ? "email" : "username"}
                        value={username}
                        onChange={handleUsernameChange}
                        required
                        invalid={!!fieldErrors.username}
                        style={{ borderLeft: 'none', fontSize: '0.95rem', padding: '12px 16px' }}
                      />
                    </CInputGroup>
                    {fieldErrors.username && (
                      <small style={{ color: '#CF142B', fontSize: '0.8rem', display: 'block', marginBottom: '12px' }}>
                        ⚠️ {fieldErrors.username}
                      </small>
                    )}
                    {!fieldErrors.username && <div style={{ marginBottom: '12px' }} />}

                    <CInputGroup className="mb-1">
                      <CInputGroupText
                        style={{
                          background: 'linear-gradient(135deg, #003893, #002766)',
                          border: 'none',
                          color: '#FFD100',
                        }}
                      >
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        invalid={!!fieldErrors.password}
                        style={{ borderLeft: 'none', fontSize: '0.95rem', padding: '12px 16px' }}
                      />
                    </CInputGroup>
                    {fieldErrors.password && (
                      <small style={{ color: '#CF142B', fontSize: '0.8rem', display: 'block', marginBottom: '16px' }}>
                        ⚠️ {fieldErrors.password}
                      </small>
                    )}
                    {!fieldErrors.password && <div style={{ marginBottom: '16px' }} />}

                    <CButton
                      type="submit"
                      disabled={loading}
                      className="w-100"
                      style={{
                        background: 'linear-gradient(135deg, #003893 0%, #002766 100%)',
                        border: 'none',
                        color: '#FFD100',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '1rem',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 15px rgba(0, 56, 147, 0.4)',
                        transition: 'all 0.3s ease',
                        opacity: loading ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.target.style.transform = 'translateY(-2px)'
                          e.target.style.boxShadow = '0 6px 20px rgba(0, 56, 147, 0.6)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = '0 4px 15px rgba(0, 56, 147, 0.4)'
                      }}
                    >
                      {loading ? 'Iniciando sesión...' : 'Ingresar'}
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>

              {/* Panel derecho - Bienvenida con rojo de Venezuela */}
              <CCard
                className="d-none d-md-flex border-0"
                style={{
                  background: 'linear-gradient(135deg, #CF142B 0%, #A0102B 100%)',
                  width: '44%',
                  borderRadius: 0,
                }}
              >
                <CCardBody
                  className="text-center d-flex flex-column justify-content-center h-100"
                  style={{ padding: '40px 30px' }}
                >
                  <div>
                    {/* Estrellitas decorativas */}
                    <div style={{ fontSize: '1.5rem', marginBottom: '12px', letterSpacing: '8px' }}>
                      ⭐⭐⭐
                    </div>
                    <h2
                      style={{
                        color: '#FFD100',
                        fontWeight: '700',
                        fontSize: '1.6rem',
                        marginBottom: '16px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      ¡Bienvenido!
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                      Disfruta de tu acceso para ver el portal educativo.
                    </p>
                    <p
                      style={{
                        color: 'rgba(255,255,255,0.75)',
                        fontSize: '0.9rem',
                        marginBottom: '28px',
                      }}
                    >
                      ¿Aún no tienes una cuenta? Regístrate para comenzar a aprender.
                    </p>
                    <Link to="/register">
                      <CButton
                        style={{
                          background: '#FFD100',
                          border: 'none',
                          color: '#002244',
                          padding: '10px 32px',
                          borderRadius: '10px',
                          fontWeight: '700',
                          fontSize: '0.95rem',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 15px rgba(255, 209, 0, 0.3)',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#fff'
                          e.target.style.color = '#CF142B'
                          e.target.style.transform = 'translateY(-2px)'
                          e.target.style.boxShadow = '0 6px 20px rgba(255, 255, 255, 0.4)'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#FFD100'
                          e.target.style.color = '#002244'
                          e.target.style.transform = 'translateY(0)'
                          e.target.style.boxShadow = '0 4px 15px rgba(255, 209, 0, 0.3)'
                        }}
                      >
                        Crear una cuenta
                      </CButton>
                    </Link>
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