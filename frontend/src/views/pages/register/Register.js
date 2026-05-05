import React, { useState } from 'react'
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
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilArrowLeft, cilCheckCircle } from '@coreui/icons'

const Register = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const handleSalir = () => {
    navigate('/login')
  }

  // ── Funciones de validación ──

  // Usuario: solo letras, números, puntos, guiones y guiones bajos.
  // Sin espacios, comas, comillas, |, ni caracteres especiales.
  const validarUsername = (val) => {
    if (!val.trim()) return 'El nombre de usuario es obligatorio'
    if (val.length < 3) return 'Mínimo 3 caracteres'
    if (/\s/.test(val)) return 'No puede contener espacios'
    if (/[,;:'"!@#$%^&*()+=\[\]{}|\\/<>?`~]/.test(val))
      return 'No puede contener caracteres especiales (,;:\'"!@#$%^&*|)'
    if (!/^[a-zA-Z0-9._-]+$/.test(val))
      return 'Solo letras, números, puntos (.), guiones (-) y guiones bajos (_)'
    return ''
  }

  // Email: debe tener @, un dominio válido, y terminar en extensiones permitidas.
  const validarEmail = (val) => {
    if (!val.trim()) return 'El correo es obligatorio'
    if (/\s/.test(val)) return 'No puede contener espacios'
    if (/[,;:'"!#$%^&*()+=\[\]{}|\\/<>?`~]/.test(val))
      return 'Contiene caracteres no válidos para un correo'
    if (!val.includes('@')) return 'Debe contener el símbolo @'
    const parts = val.split('@')
    if (parts.length !== 2) return 'Solo puede tener un símbolo @'
    if (!parts[0].trim()) return 'Falta el nombre antes del @'
    if (!parts[1].trim()) return 'Falta el dominio después del @'
    if (!parts[1].includes('.')) return 'El dominio debe tener un punto (ej: gmail.com)'
    // Validar extensión del dominio
    const domainParts = parts[1].split('.')
    const extension = domainParts[domainParts.length - 1].toLowerCase()
    const extensionesValidas = ['com', 'es', 've', 'net', 'org', 'edu', 'co', 'info', 'io']
    if (!extensionesValidas.includes(extension))
      return `La extensión ".${extension}" no es válida. Use: .com, .es, .ve, .net, .org, .edu`
    // Regex final para formato general
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val))
      return 'Formato de correo inválido'
    return ''
  }

  // Contraseña: mínimo 6 caracteres, sin espacios, al menos una letra y un número.
  const validarPassword = (val) => {
    if (!val) return 'La contraseña es obligatoria'
    if (/\s/.test(val)) return 'No puede contener espacios'
    if (val.length < 6) return 'Mínimo 6 caracteres'
    if (!/[a-zA-Z]/.test(val)) return 'Debe contener al menos una letra'
    if (!/[0-9]/.test(val)) return 'Debe contener al menos un número'
    return ''
  }

  // Confirmar contraseña: debe coincidir.
  const validarConfirmPassword = (val, pass) => {
    if (!val) return 'Debe confirmar la contraseña'
    if (val !== pass) return 'Las contraseñas no coinciden'
    return ''
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFormError('')

    // Validar en tiempo real
    let err = ''
    switch (field) {
      case 'username':
        err = validarUsername(value)
        break
      case 'email':
        err = validarEmail(value)
        break
      case 'password':
        err = validarPassword(value)
        // También revalidar confirmación si ya tiene algo
        if (formData.confirmPassword) {
          const confErr = validarConfirmPassword(formData.confirmPassword, value)
          setFieldErrors((prev) => ({ ...prev, confirmPassword: confErr }))
        }
        break
      case 'confirmPassword':
        err = validarConfirmPassword(value, formData.password)
        break
      default:
        break
    }
    setFieldErrors((prev) => ({ ...prev, [field]: err }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    // Validar todos los campos
    const errors = {
      username: validarUsername(formData.username),
      email: validarEmail(formData.email),
      password: validarPassword(formData.password),
      confirmPassword: validarConfirmPassword(formData.confirmPassword, formData.password),
    }
    setFieldErrors(errors)

    const hasErrors = Object.values(errors).some((err) => err !== '')
    if (hasErrors) {
      setFormError('Por favor corrige los errores antes de continuar')
      return
    }

    try {
      const nameParts = formData.username.split(/[._-]/)
      const nombre = nameParts[0] || formData.username
      const apellido = nameParts.length > 1 ? nameParts.slice(1).join(' ') : formData.username

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          contrasena: formData.password,
          rol: 'estudiante', // Por defecto para nuevos registros web
          nombre: nombre,
          apellido: apellido
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        setFormError(errorData.error || 'Error al crear la cuenta. Verifica los datos o intenta con otro correo.')
        return
      }

      setFormSuccess('¡Cuenta creada exitosamente! Redirigiendo al login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setFormError('Error de red: No se pudo conectar al servidor backend en el puerto 5000.')
    }
  }

  return (
    <div
      className="min-vh-100 d-flex flex-row align-items-center"
      style={{
        background: '#FEF8E6',
      }}
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard
              className="mx-4 border-0"
              style={{
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                overflow: 'hidden',
              }}
            >
              {/* Header con amarillo de Venezuela */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #FFD100 0%, #FFA000 100%)',
                  padding: '28px 24px 20px',
                  textAlign: 'center',
                }}
              >
                {/* Estrellitas decorativas */}
                <div style={{ fontSize: '1.2rem', marginBottom: '8px', letterSpacing: '6px' }}>
                  ⭐⭐⭐
                </div>
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
                  Registrarse
                </h1>
                <p style={{ color: 'rgba(0,34,68,0.7)', margin: 0, fontSize: '0.95rem', fontWeight: '500' }}>
                  Crea tu cuenta para comenzar
                </p>
              </div>

              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  {formError && (
                    <CAlert color="danger" dismissible onClose={() => setFormError('')}
                      style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                    >
                      ⚠️ {formError}
                    </CAlert>
                  )}
                  {formSuccess && (
                    <CAlert color="success" style={{ borderRadius: '10px', fontSize: '0.85rem' }}>
                      ✅ {formSuccess}
                    </CAlert>
                  )}

                  {/* Usuario */}
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
                      placeholder="Nombre de usuario"
                      autoComplete="username"
                      maxLength={50}
                      value={formData.username}
                      onChange={(e) => handleChange('username', e.target.value)}
                      required
                      invalid={!!fieldErrors.username}
                      style={{ borderLeft: 'none', fontSize: '0.95rem', padding: '12px 16px' }}
                    />
                  </CInputGroup>
                  {fieldErrors.username && (
                    <small style={{ color: '#CF142B', fontSize: '0.78rem', display: 'block', marginBottom: '10px' }}>
                      ⚠️ {fieldErrors.username}
                    </small>
                  )}
                  {!fieldErrors.username && <div style={{ marginBottom: '10px' }} />}

                  {/* Email */}
                  <CInputGroup className="mb-1">
                    <CInputGroupText
                      style={{
                        background: 'linear-gradient(135deg, #003893, #002766)',
                        border: 'none',
                        color: '#FFD100',
                        fontWeight: '700',
                      }}
                    >
                      @
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Correo electrónico"
                      autoComplete="email"
                      maxLength={60}
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                      invalid={!!fieldErrors.email}
                      style={{ borderLeft: 'none', fontSize: '0.95rem', padding: '12px 16px' }}
                    />
                  </CInputGroup>
                  {fieldErrors.email && (
                    <small style={{ color: '#CF142B', fontSize: '0.78rem', display: 'block', marginBottom: '10px' }}>
                      ⚠️ {fieldErrors.email}
                    </small>
                  )}
                  {!fieldErrors.email && <div style={{ marginBottom: '10px' }} />}

                  {/* Contraseña */}
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
                      autoComplete="new-password"
                      maxLength={16}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      required
                      invalid={!!fieldErrors.password}
                      style={{ borderLeft: 'none', fontSize: '0.95rem', padding: '12px 16px' }}
                    />
                  </CInputGroup>
                  {fieldErrors.password && (
                    <small style={{ color: '#CF142B', fontSize: '0.78rem', display: 'block', marginBottom: '10px' }}>
                      ⚠️ {fieldErrors.password}
                    </small>
                  )}
                  {!fieldErrors.password && <div style={{ marginBottom: '10px' }} />}

                  {/* Repetir Contraseña */}
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
                      placeholder="Repetir contraseña"
                      autoComplete="new-password"
                      maxLength={16}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      required
                      invalid={!!fieldErrors.confirmPassword}
                      style={{ borderLeft: 'none', fontSize: '0.95rem', padding: '12px 16px' }}
                    />
                  </CInputGroup>
                  {fieldErrors.confirmPassword && (
                    <small style={{ color: '#CF142B', fontSize: '0.78rem', display: 'block', marginBottom: '14px' }}>
                      ⚠️ {fieldErrors.confirmPassword}
                    </small>
                  )}
                  {!fieldErrors.confirmPassword && <div style={{ marginBottom: '14px' }} />}

                  {/* Botones con colores de Venezuela */}
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ gap: '12px', marginTop: '8px' }}
                  >
                    <CButton
                      type="submit"
                      className="flex-grow-1"
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
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 6px 20px rgba(0, 56, 147, 0.6)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = '0 4px 15px rgba(0, 56, 147, 0.4)'
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
                        border: '2px solid #CF142B',
                        color: '#CF142B',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '1rem',
                        letterSpacing: '0.3px',
                        transition: 'all 0.3s ease',
                        minWidth: '120px',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#CF142B'
                        e.target.style.color = '#fff'
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 6px 20px rgba(207, 20, 43, 0.4)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent'
                        e.target.style.color = '#CF142B'
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