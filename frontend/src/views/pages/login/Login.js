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
  CBadge,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Detecta si el input parece un email (para mostrar hint al usuario)
  const isEmailInput = identifier.includes('@');

  // ── Validaciones ──────────────────────────────────────────
  const validarIdentifier = (val) => {
    if (!val.trim()) return 'El campo es obligatorio';
    if (/\s/.test(val)) return 'No puede contener espacios';
    if (val.includes('@')) {
      // Es un email → validar formato
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
        return 'Ingresa un email válido (ej: usuario@correo.com)';
    } else {
      // Es un username → validar caracteres
      if (!/^[a-zA-Z0-9._-]+$/.test(val))
        return 'Solo letras, números, puntos (.), guiones (-) y guiones bajos (_)';
    }
    return '';
  };

  const validarPassword = (val) => {
    if (!val) return 'La contraseña es obligatoria';
    if (/\s/.test(val)) return 'La contraseña no puede contener espacios';
    return '';
  };

  const handleIdentifierChange = (e) => {
    const val = e.target.value;
    setIdentifier(val);
    const err = validarIdentifier(val);
    setFieldErrors((prev) => ({ ...prev, identifier: err }));
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

    const identifierErr = validarIdentifier(identifier);
    const passwordErr = validarPassword(password);
    setFieldErrors({ identifier: identifierErr, password: passwordErr });

    if (identifierErr || passwordErr) return;

    setLoading(true);
    const result = await login(identifier.trim(), password.trim());

    if (result.success) {
      // Redirigir a la ruta que devuelve el AuthContext según el rol
      navigate(result.redirectTo || '/dashboard', { replace: true });
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div
      className="min-vh-100 d-flex flex-row align-items-center"
      style={{ background: '#FEF8E6' }}
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
              {/* Panel izquierdo — Formulario */}
              <CCard className="border-0" style={{ borderRadius: 0 }}>
                {/* Header */}
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
                    Historia de Venezuela — LMS
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

                    {/* Campo identifier (username o email) */}
                    <div style={{ marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <small style={{ color: '#555', fontSize: '0.8rem' }}>
                          {isEmailInput
                            ? '📧 Profesores / Administradores / Zona Educativa'
                            : '🎓 Estudiantes — usa tu nombre de usuario'}
                        </small>
                        {isEmailInput && (
                          <CBadge color="info" style={{ fontSize: '0.7rem' }}>Email</CBadge>
                        )}
                        {!isEmailInput && identifier.length > 0 && (
                          <CBadge color="success" style={{ fontSize: '0.7rem' }}>Usuario</CBadge>
                        )}
                      </div>
                    </div>

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
                        id="login-identifier"
                        placeholder="Usuario o Email"
                        autoComplete="username"
                        value={identifier}
                        onChange={handleIdentifierChange}
                        required
                        invalid={!!fieldErrors.identifier}
                        style={{ borderLeft: 'none', fontSize: '0.95rem', padding: '12px 16px' }}
                      />
                    </CInputGroup>
                    {fieldErrors.identifier && (
                      <small style={{ color: '#CF142B', fontSize: '0.8rem', display: 'block', marginBottom: '12px' }}>
                        ⚠️ {fieldErrors.identifier}
                      </small>
                    )}
                    {!fieldErrors.identifier && <div style={{ marginBottom: '12px' }} />}

                    {/* Campo contraseña */}
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
                        id="login-password"
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
                      id="login-submit-btn"
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
                      {loading ? '⏳ Iniciando sesión...' : 'Ingresar'}
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>

              {/* Panel derecho — Bienvenida */}
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
                    <div style={{ fontSize: '1.5rem', marginBottom: '12px', letterSpacing: '8px' }}>⭐⭐⭐</div>
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
                    <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', lineHeight: '1.8', marginBottom: '20px' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <strong style={{ color: '#FFD100' }}>🎓 Estudiantes:</strong><br />
                        <span style={{ opacity: 0.85 }}>Usa tu nombre de usuario asignado por tu profesor</span>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong style={{ color: '#FFD100' }}>👩‍🏫 Profesores:</strong><br />
                        <span style={{ opacity: 0.85 }}>Usa tu correo electrónico</span>
                      </div>
                      <div style={{ marginBottom: '20px' }}>
                        <strong style={{ color: '#FFD100' }}>🏫 Administradores:</strong><br />
                        <span style={{ opacity: 0.85 }}>Usa tu correo institucional</span>
                      </div>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', marginBottom: '16px' }}>
                      ¿Aún no tienes una cuenta? Regístrate para comenzar a aprender.
                    </p>
                    <Link to="/register">
                      <CButton
                        id="go-to-register-btn"
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