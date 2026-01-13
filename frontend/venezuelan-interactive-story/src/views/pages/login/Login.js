import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CButton, CForm, CFormInput, CCard, CCardBody, CCardHeader } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked } from '@coreui/icons';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    // Si la autenticación es exitosa, redirigir a la página principal
    navigate('/dashboard');
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: '#FCEB5D' }}>
      <CCard className="w-100" style={{ maxWidth: '400px' }}>
        <CCardHeader className="text-center">
          <h4>Iniciar Sesión</h4>
          <CIcon icon={cilLockLocked} size="lg" />
        </CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleLogin}>
            <CFormInput
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <CFormInput
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <CButton type="submit" color="primary" className="w-100 mt-3">
              Iniciar Sesión
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Login;