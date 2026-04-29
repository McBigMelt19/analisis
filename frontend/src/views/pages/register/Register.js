import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilArrowLeft, cilCheckCircle } from '@coreui/icons'

const Register = () => {
  const navigate = useNavigate()

  const handleSalir = () => {
    navigate('/login')
  }

  return (
    <div
      className="min-vh-100 d-flex flex-row align-items-center"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard
              className="mx-4 border-0"
              style={{
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                overflow: 'hidden',
              }}
            >
              {/* Header decorativo */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '28px 24px 20px',
                  textAlign: 'center',
                }}
              >
                <h1
                  style={{
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '1.75rem',
                    marginBottom: '4px',
                    letterSpacing: '0.5px',
                  }}
                >
                  Registrarse
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem' }}>
                  Crea tu cuenta para comenzar
                </p>
              </div>

              <CCardBody className="p-4">
                <CForm>
                  <CInputGroup className="mb-3">
                    <CInputGroupText
                      style={{
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        border: 'none',
                        color: '#fff',
                      }}
                    >
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Nombre de usuario"
                      autoComplete="username"
                      maxLength={50}
                      required
                      style={{ borderLeft: 'none', fontSize: '0.95rem', padding: '12px 16px' }}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText
                      style={{
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        border: 'none',
                        color: '#fff',
                        fontWeight: '700',
                      }}
                    >
                      @
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Correo electrónico"
                      autoComplete="email"
                      maxLength={20}
                      required
                      style={{ borderLeft: 'none', fontSize: '0.95rem', padding: '12px 16px' }}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText
                      style={{
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        border: 'none',
                        color: '#fff',
                      }}
                    >
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Contraseña"
                      autoComplete="new-password"
                      maxLength={16}
                      required
                      style={{ borderLeft: 'none', fontSize: '0.95rem', padding: '12px 16px' }}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText
                      style={{
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        border: 'none',
                        color: '#fff',
                      }}
                    >
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repetir contraseña"
                      autoComplete="new-password"
                      maxLength={255}
                      required
                      style={{ borderLeft: 'none', fontSize: '0.95rem', padding: '12px 16px' }}
                    />
                  </CInputGroup>

                  {/* Botones con estilo y distribución */}
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ gap: '12px', marginTop: '8px' }}
                  >
                    <CButton
                      type="submit"
                      className="flex-grow-1"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        color: '#fff',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        fontWeight: '600',
                        fontSize: '1rem',
                        letterSpacing: '0.3px',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
                      }}
                    >
                      <CIcon icon={cilCheckCircle} className="me-2" />
                      Crear Cuenta
                    </CButton>

                    <CButton
                      type="button"
                      onClick={handleSalir}
                      style={{
                        background: 'transparent',
                        border: '2px solid #e74c3c',
                        color: '#e74c3c',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        fontWeight: '600',
                        fontSize: '1rem',
                        letterSpacing: '0.3px',
                        transition: 'all 0.3s ease',
                        minWidth: '120px',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#e74c3c'
                        e.target.style.color = '#fff'
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 6px 20px rgba(231, 76, 60, 0.4)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent'
                        e.target.style.color = '#e74c3c'
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = 'none'
                      }}
                    >
                      <CIcon icon={cilArrowLeft} className="me-2" />
                      Salir
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register