import React, { useState } from 'react';
import { CButton, CForm, CFormInput, CFormLabel, CContainer, CRow, CCol } from '@coreui/react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para manejar el registro
    console.log('Registro exitoso:', formData);
  };

  return (
    <CContainer>
      <h1 className="text-center mb-4">¡Regístrate para la Aventura!</h1>
      <CForm onSubmit={handleSubmit}>
        <CRow>
          <CCol xs={12} md={6}>
            <CFormLabel htmlFor="username">Nombre de Usuario</CFormLabel>
            <CFormInput
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </CCol>
          <CCol xs={12} md={6}>
            <CFormLabel htmlFor="email">Correo Electrónico</CFormLabel>
            <CFormInput
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={12} md={6}>
            <CFormLabel htmlFor="password">Contraseña</CFormLabel>
            <CFormInput
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </CCol>
          <CCol xs={12} md={6}>
            <CFormLabel htmlFor="confirmPassword">Confirmar Contraseña</CFormLabel>
            <CFormInput
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </CCol>
        </CRow>
        <CButton type="submit" color="primary" className="mt-3">Registrarse</CButton>
      </CForm>
    </CContainer>
  );
};

export default Register;