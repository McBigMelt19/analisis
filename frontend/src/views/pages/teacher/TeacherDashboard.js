import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CBadge,
  CSpinner,
  CAvatar,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBook,
  cilClipboard,
  cilCommentSquare,
  cilCloudUpload,
  cilChartLine,
  cilUserPlus,
  cilCheckCircle,
} from '@coreui/icons'
import { useAuth } from '../../../context/AuthContext'
import StudentProgressModal from '../../../components/StudentProgressModal'
import * as usersService from '../../../services/users.service'

const TeacherDashboard = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  // ── Estado para el modal de Agregar Estudiante ──
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [addSuccess, setAddSuccess] = useState('')
  const [addErrors, setAddErrors] = useState({})
  const [generatedCredentials, setGeneratedCredentials] = useState(null)

  const initialFormData = {
    // Representante
    repNombre: '',
    repApellido: '',
    repCedula: '',
    repTelPrefijo: '',
    repTelNumero: '',
    repEmail: '',
    // Estudiante
    estNombre: '',
    estApellido: '',
    estCedula: '',
    estGrado: '',
    estParentesco: '',
  }
  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => {
    if (currentUser && currentUser.role === 'teacher') {
      fetchStudents()
    }
  }, [currentUser])

  const fetchStudents = async () => {
    try {
      const data = await usersService.getStudentsByGrade(currentUser.grade_id)
      setStudents(data)
    } catch (error) {
      console.error('Error cargando estudiantes:', error)
      setError('No se pudieron cargar los estudiantes. Verifica la conexión al servidor.')
    } finally {
      setLoading(false)
    }
  }

  const getLearningStyleColor = (style) => {
    switch (style) {
      case 'Visual':
        return 'info'
      case 'Auditivo':
        return 'warning'
      case 'Kinestésico':
        return 'success'
      default:
        return 'secondary'
    }
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const openProgressModal = (student) => {
    setSelectedStudent(student)
    setModalVisible(true)
  }

  // ── Helpers de validación ──

  // Capitalizar: primera letra mayúscula, resto minúscula
  const capitalizar = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  // Solo letras y espacios, sin números ni caracteres especiales
  const esNombreValido = (valor) => /^[A-Za-záéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(valor)

  // Cédula: 7 a 8 dígitos
  const esCedulaValida = (valor) => /^\d{7,8}$/.test(valor)

  // Prefijo de teléfono: exactamente 4 dígitos y debe ser un código válido
  const prefijosValidos = ['0424', '0414', '0412', '0422', '0426', '0416']
  const esPrefijoValido = (valor) => prefijosValidos.includes(valor)

  // Número de teléfono: exactamente 7 dígitos
  const esTelefonoValido = (valor) => /^\d{7}$/.test(valor)

  // Email básico
  const esEmailValido = (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)

  // Quitar acentos para generar username limpio
  const quitarAcentos = (str) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  // Generar username automático: nombre.apellido en minúsculas, sin acentos
  const generarUsername = (nombre, apellido) => {
    const n = quitarAcentos(nombre.trim().toLowerCase()).replace(/\s+/g, '')
    const a = quitarAcentos(apellido.trim().toLowerCase()).replace(/\s+/g, '')
    return `${n}.${a}`
  }

  // Generar contraseña temporal: 6 dígitos aleatorios
  const generarPassword = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpiar error del campo al escribir
    if (addErrors[field]) {
      setAddErrors((prev) => {
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
    }
  }

  const validarFormulario = () => {
    const errors = {}

    // ── Representante ──
    if (!formData.repNombre.trim()) {
      errors.repNombre = 'El nombre es obligatorio'
    } else if (!esNombreValido(formData.repNombre.trim())) {
      errors.repNombre = 'Solo se permiten letras y espacios (sin números ni caracteres especiales)'
    }

    if (!formData.repApellido.trim()) {
      errors.repApellido = 'El apellido es obligatorio'
    } else if (!esNombreValido(formData.repApellido.trim())) {
      errors.repApellido = 'Solo se permiten letras y espacios (sin números ni caracteres especiales)'
    }

    if (!formData.repCedula.trim()) {
      errors.repCedula = 'La cédula es obligatoria'
    } else if (!esCedulaValida(formData.repCedula.trim())) {
      errors.repCedula = 'Debe tener entre 7 y 8 dígitos numéricos'
    }

    if (!formData.repTelPrefijo.trim()) {
      errors.repTelPrefijo = 'El prefijo es obligatorio'
    } else if (!esPrefijoValido(formData.repTelPrefijo.trim())) {
      errors.repTelPrefijo = 'Prefijo inválido (ej: 0414, 0424, 0412, 0416, 0426, 0422)'
    }

    if (!formData.repTelNumero.trim()) {
      errors.repTelNumero = 'El número es obligatorio'
    } else if (!esTelefonoValido(formData.repTelNumero.trim())) {
      errors.repTelNumero = 'Debe tener exactamente 7 dígitos numéricos'
    }

    if (!formData.repEmail.trim()) {
      errors.repEmail = 'El email es obligatorio'
    } else if (!esEmailValido(formData.repEmail.trim())) {
      errors.repEmail = 'Formato de email inválido'
    }

    // ── Estudiante ──
    if (!formData.estNombre.trim()) {
      errors.estNombre = 'El nombre del estudiante es obligatorio'
    } else if (!esNombreValido(formData.estNombre.trim())) {
      errors.estNombre = 'Solo se permiten letras y espacios'
    }

    if (!formData.estApellido.trim()) {
      errors.estApellido = 'El apellido del estudiante es obligatorio'
    } else if (!esNombreValido(formData.estApellido.trim())) {
      errors.estApellido = 'Solo se permiten letras y espacios'
    }

    // CI del estudiante es opcional, pero si se llena debe ser válida
    if (formData.estCedula.trim() && !esCedulaValida(formData.estCedula.trim())) {
      errors.estCedula = 'Debe tener entre 7 y 8 dígitos numéricos'
    }

    if (!formData.estGrado) {
      errors.estGrado = 'El grado es obligatorio'
    }

    if (!formData.estParentesco) {
      errors.estParentesco = 'El parentesco es obligatorio'
    }

    setAddErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddStudent = (e) => {
    e.preventDefault()
    setAddSuccess('')
    setGeneratedCredentials(null)

    if (!validarFormulario()) return

    // Formatear datos
    const representante = {
      nombre: capitalizar(formData.repNombre.trim()),
      apellido: capitalizar(formData.repApellido.trim()),
      cedula: formData.repCedula.trim(),
      telefono: `${formData.repTelPrefijo.trim()}-${formData.repTelNumero.trim()}`,
      email: formData.repEmail.trim().toLowerCase(),
    }

    const estNombreCapitalizado = capitalizar(formData.estNombre.trim())
    const estApellidoCapitalizado = capitalizar(formData.estApellido.trim())

    // Generar credenciales automáticamente
    const username = generarUsername(formData.estNombre, formData.estApellido)
    const password = generarPassword()

    const estudiante = {
      nombre: estNombreCapitalizado,
      apellido: estApellidoCapitalizado,
      cedula: formData.estCedula.trim() || null,
      grado: parseInt(formData.estGrado),
      parentesco: formData.estParentesco,
      username,
      password,
    }

    console.log('Representante:', representante)
    console.log('Estudiante:', estudiante)

    // Guardar credenciales para mostrarlas
    const creds = {
      nombreCompleto: `${estNombreCapitalizado} ${estApellidoCapitalizado}`,
      username,
      password,
    }
    setGeneratedCredentials(creds)

    setAddSuccess(
      `¡Registro exitoso! Las credenciales del estudiante se muestran abajo. Por favor, entrégueselas al representante.`,
    )
    setFormData(initialFormData)
    setAddErrors({})
  }

  const handleCloseAddModal = () => {
    setAddModalVisible(false)
    setFormData(initialFormData)
    setAddErrors({})
    setAddSuccess('')
    setGeneratedCredentials(null)
  }

  // Tarjetas de navegación rápida
  const quickAccessCards = [
    {
      title: 'Contenidos',
      description: 'Ver y gestionar contenidos educativos',
      icon: cilBook,
      color: 'primary',
      path: '/teacher/content',
      gradient: 'linear-gradient(135deg, #004587 0%, #0066cc 100%)',
    },
    {
      title: 'Calificaciones',
      description: 'Subir y gestionar calificaciones',
      icon: cilClipboard,
      color: 'success',
      path: '/teacher/upload-grades',
      gradient: 'linear-gradient(135deg, #FFC72C 0%, #FFD966 100%)',
    },
    {
      title: 'Retroalimentación',
      description: 'Dar feedback a estudiantes',
      icon: cilCommentSquare,
      color: 'warning',
      path: '/teacher/feedback',
      gradient: 'linear-gradient(135deg, #E64A19 0%, #FF6B3D 100%)',
    },
    {
      title: 'Agregar Contenido',
      description: 'Subir nuevo material educativo',
      icon: cilCloudUpload,
      color: 'info',
      path: '/teacher/add-content',
      gradient: 'linear-gradient(135deg, #006699 0%, #0088cc 100%)',
    },
  ]

  if (!currentUser || currentUser.role !== 'teacher') {
    return <div className="alert alert-warning m-4">Esta página es solo para profesores.</div>
  }

  if (loading) {
    return (
      <div className="text-center p-5">
        <CSpinner color="primary" />
        <p className="mt-3 text-muted">Cargando dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4">
        {error}
        <br />
        <small>
          Ejecuta: <code>npm run server</code>
        </small>
      </div>
    )
  }

  return (
    <div>
      <CRow className="mb-4">
        <CCol>
          <h2>Bienvenido, {currentUser.name}</h2>
          <p className="text-muted">Grado: {currentUser.grade_id}°</p>
        </CCol>
      </CRow>

      {/* Tarjetas de Acceso Rápido */}
      <CRow className="mb-4">
        {quickAccessCards.map((card, index) => (
          <CCol xs={12} sm={6} lg={3} key={index} className="mb-3">
            <CCard
              className="h-100 shadow-sm border-0"
              style={{
                background: card.gradient,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onClick={() => navigate(card.path)}
            >
              <CCardBody className="text-center text-white p-4">
                <div className="mb-3">
                  <CIcon icon={card.icon} size="3xl" />
                </div>
                <h5 className="fw-bold mb-2">{card.title}</h5>
                <p className="small mb-0" style={{ opacity: 0.9 }}>
                  {card.description}
                </p>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      <CCard>
        <CCardHeader>
          <strong>Mis Estudiantes ({students.length})</strong>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Estudiante</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Estilo de Aprendizaje</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {students.map((student) => (
                <CTableRow key={student.id}>
                  <CTableDataCell>
                    <div className="d-flex align-items-center">
                      <CAvatar color="primary" textColor="white" className="me-2">
                        {getInitials(student.name)}
                      </CAvatar>
                      <strong>{student.name}</strong>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>{student.email}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getLearningStyleColor(student.learning_style)}>
                      {student.learning_style}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" size="sm" onClick={() => openProgressModal(student)}>
                      Ver Progreso
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Card para Agregar Estudiante */}
      <CCard className="mt-4 border-0 shadow-sm">
        <CCardHeader
          style={{
            background: 'linear-gradient(135deg, #003893 0%, #002766 100%)',
            borderRadius: '8px 8px 0 0',
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <strong style={{ color: '#FFD100', fontSize: '1.05rem' }}>
              <CIcon icon={cilUserPlus} className="me-2" />
              Registrar Nuevo Estudiante
            </strong>
            <CButton
              style={{
                background: '#FFD100',
                border: 'none',
                color: '#002244',
                fontWeight: '700',
                borderRadius: '8px',
                padding: '8px 20px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#fff'
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 4px 12px rgba(255,209,0,0.4)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#FFD100'
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = 'none'
              }}
              onClick={() => setAddModalVisible(true)}
            >
              <CIcon icon={cilUserPlus} className="me-1" />
              Agregar Estudiante
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <p className="text-muted mb-0">
            Haz clic en el botón para registrar un nuevo estudiante junto con su representante.
            Se solicitarán los datos del representante (adulto responsable) y del estudiante.
          </p>
        </CCardBody>
      </CCard>

      {/* ══════════════════════════════════════════════════════════════════
          MODAL DE REGISTRO DE ESTUDIANTE
         ══════════════════════════════════════════════════════════════════ */}
      <CModal
        visible={addModalVisible}
        onClose={handleCloseAddModal}
        size="lg"
        backdrop="static"
        scrollable
      >
        <CModalHeader
          style={{
            background: 'linear-gradient(135deg, #003893 0%, #002766 100%)',
            borderBottom: 'none',
          }}
        >
          <CModalTitle style={{ color: '#FFD100', fontWeight: '700' }}>
            <CIcon icon={cilUserPlus} className="me-2" />
            Registrar Nuevo Estudiante
          </CModalTitle>
        </CModalHeader>

        <CModalBody style={{ padding: '24px 28px' }}>
          {addSuccess && (
            <CAlert color="success" dismissible onClose={() => setAddSuccess('')}>
              <CIcon icon={cilCheckCircle} className="me-2" />
              {addSuccess}
            </CAlert>
          )}

          <form onSubmit={handleAddStudent} id="formAddStudent">
            {/* ──────────────── SECCIÓN REPRESENTANTE ──────────────── */}
            <div
              style={{
                background: 'linear-gradient(135deg, #FFD100 0%, #FFA000 100%)',
                padding: '12px 18px',
                borderRadius: '10px',
                marginBottom: '20px',
              }}
            >
              <h5 style={{ margin: 0, color: '#002244', fontWeight: '700' }}>
                👨‍👩‍👧 Datos del Representante
              </h5>
              <small style={{ color: 'rgba(0,34,68,0.7)' }}>
                Información del adulto responsable del estudiante
              </small>
            </div>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="repNombre" className="fw-semibold">
                  Nombre <span style={{ color: '#CF142B' }}>*</span>
                </CFormLabel>
                <CFormInput
                  id="repNombre"
                  placeholder="Ej: María"
                  value={formData.repNombre}
                  onChange={(e) => handleFormChange('repNombre', e.target.value)}
                  invalid={!!addErrors.repNombre}
                />
                {addErrors.repNombre && (
                  <small style={{ color: '#CF142B', fontSize: '0.8rem' }}>{addErrors.repNombre}</small>
                )}
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="repApellido" className="fw-semibold">
                  Apellido <span style={{ color: '#CF142B' }}>*</span>
                </CFormLabel>
                <CFormInput
                  id="repApellido"
                  placeholder="Ej: Rodríguez"
                  value={formData.repApellido}
                  onChange={(e) => handleFormChange('repApellido', e.target.value)}
                  invalid={!!addErrors.repApellido}
                />
                {addErrors.repApellido && (
                  <small style={{ color: '#CF142B', fontSize: '0.8rem' }}>{addErrors.repApellido}</small>
                )}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="repCedula" className="fw-semibold">
                  Cédula de Identidad <span style={{ color: '#CF142B' }}>*</span>
                </CFormLabel>
                <CInputGroup>
                  <CInputGroupText
                    style={{
                      background: '#003893',
                      color: '#FFD100',
                      border: 'none',
                      fontWeight: '700',
                    }}
                  >
                    V-
                  </CInputGroupText>
                  <CFormInput
                    id="repCedula"
                    placeholder="Ej: 12345678"
                    maxLength={8}
                    value={formData.repCedula}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      handleFormChange('repCedula', val)
                    }}
                    invalid={!!addErrors.repCedula}
                  />
                </CInputGroup>
                {addErrors.repCedula && (
                  <small style={{ color: '#CF142B', fontSize: '0.8rem' }}>{addErrors.repCedula}</small>
                )}
              </CCol>
              <CCol md={6}>
                <CFormLabel className="fw-semibold">
                  Teléfono <span style={{ color: '#CF142B' }}>*</span>
                </CFormLabel>
                <div className="d-flex gap-2">
                  <div style={{ width: '120px' }}>
                    <CFormInput
                      placeholder="0414"
                      maxLength={4}
                      value={formData.repTelPrefijo}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '')
                        handleFormChange('repTelPrefijo', val)
                      }}
                      invalid={!!addErrors.repTelPrefijo}
                    />
                    {addErrors.repTelPrefijo && (
                      <small style={{ color: '#CF142B', fontSize: '0.75rem' }}>
                        {addErrors.repTelPrefijo}
                      </small>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <CFormInput
                      placeholder="1234567"
                      maxLength={7}
                      value={formData.repTelNumero}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '')
                        handleFormChange('repTelNumero', val)
                      }}
                      invalid={!!addErrors.repTelNumero}
                    />
                    {addErrors.repTelNumero && (
                      <small style={{ color: '#CF142B', fontSize: '0.75rem' }}>
                        {addErrors.repTelNumero}
                      </small>
                    )}
                  </div>
                </div>
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={12}>
                <CFormLabel htmlFor="repEmail" className="fw-semibold">
                  Correo Electrónico <span style={{ color: '#CF142B' }}>*</span>
                </CFormLabel>
                <CInputGroup>
                  <CInputGroupText
                    style={{
                      background: '#003893',
                      color: '#FFD100',
                      border: 'none',
                      fontWeight: '700',
                    }}
                  >
                    @
                  </CInputGroupText>
                  <CFormInput
                    id="repEmail"
                    type="email"
                    placeholder="Ej: maria.rodriguez@correo.com"
                    value={formData.repEmail}
                    onChange={(e) => handleFormChange('repEmail', e.target.value)}
                    invalid={!!addErrors.repEmail}
                  />
                </CInputGroup>
                {addErrors.repEmail && (
                  <small style={{ color: '#CF142B', fontSize: '0.8rem' }}>{addErrors.repEmail}</small>
                )}
              </CCol>
            </CRow>

            {/* ──────────────── SECCIÓN ESTUDIANTE ──────────────── */}
            <div
              style={{
                background: 'linear-gradient(135deg, #003893 0%, #002766 100%)',
                padding: '12px 18px',
                borderRadius: '10px',
                marginBottom: '20px',
              }}
            >
              <h5 style={{ margin: 0, color: '#FFD100', fontWeight: '700' }}>
                🎒 Datos del Estudiante
              </h5>
              <small style={{ color: 'rgba(255,255,255,0.7)' }}>
                Información del niño/a que cursará estudios
              </small>
            </div>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="estNombre" className="fw-semibold">
                  Nombre <span style={{ color: '#CF142B' }}>*</span>
                </CFormLabel>
                <CFormInput
                  id="estNombre"
                  placeholder="Ej: Juan"
                  value={formData.estNombre}
                  onChange={(e) => handleFormChange('estNombre', e.target.value)}
                  invalid={!!addErrors.estNombre}
                />
                {addErrors.estNombre && (
                  <small style={{ color: '#CF142B', fontSize: '0.8rem' }}>{addErrors.estNombre}</small>
                )}
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="estApellido" className="fw-semibold">
                  Apellido <span style={{ color: '#CF142B' }}>*</span>
                </CFormLabel>
                <CFormInput
                  id="estApellido"
                  placeholder="Ej: Pérez"
                  value={formData.estApellido}
                  onChange={(e) => handleFormChange('estApellido', e.target.value)}
                  invalid={!!addErrors.estApellido}
                />
                {addErrors.estApellido && (
                  <small style={{ color: '#CF142B', fontSize: '0.8rem' }}>{addErrors.estApellido}</small>
                )}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={4}>
                <CFormLabel htmlFor="estCedula" className="fw-semibold">
                  Cédula de Identidad <CBadge color="secondary" className="ms-1">Opcional</CBadge>
                </CFormLabel>
                <CInputGroup>
                  <CInputGroupText
                    style={{
                      background: '#003893',
                      color: '#FFD100',
                      border: 'none',
                      fontWeight: '700',
                    }}
                  >
                    V-
                  </CInputGroupText>
                  <CFormInput
                    id="estCedula"
                    placeholder="Opcional"
                    maxLength={8}
                    value={formData.estCedula}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      handleFormChange('estCedula', val)
                    }}
                    invalid={!!addErrors.estCedula}
                  />
                </CInputGroup>
                {addErrors.estCedula && (
                  <small style={{ color: '#CF142B', fontSize: '0.8rem' }}>{addErrors.estCedula}</small>
                )}
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="estGrado" className="fw-semibold">
                  Grado a Cursar <span style={{ color: '#CF142B' }}>*</span>
                </CFormLabel>
                <CFormSelect
                  id="estGrado"
                  value={formData.estGrado}
                  onChange={(e) => handleFormChange('estGrado', e.target.value)}
                  invalid={!!addErrors.estGrado}
                >
                  <option value="">Seleccionar grado...</option>
                  <option value="1">1° Grado</option>
                  <option value="2">2° Grado</option>
                  <option value="3">3° Grado</option>
                  <option value="4">4° Grado</option>
                  <option value="5">5° Grado</option>
                  <option value="6">6° Grado</option>
                </CFormSelect>
                {addErrors.estGrado && (
                  <small style={{ color: '#CF142B', fontSize: '0.8rem' }}>{addErrors.estGrado}</small>
                )}
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="estParentesco" className="fw-semibold">
                  Parentesco <span style={{ color: '#CF142B' }}>*</span>
                </CFormLabel>
                <CFormSelect
                  id="estParentesco"
                  value={formData.estParentesco}
                  onChange={(e) => handleFormChange('estParentesco', e.target.value)}
                  invalid={!!addErrors.estParentesco}
                >
                  <option value="">Seleccionar...</option>
                  <option value="Madre">Madre</option>
                  <option value="Padre">Padre</option>
                  <option value="Tío">Tío</option>
                  <option value="Otro">Otro</option>
                </CFormSelect>
                {addErrors.estParentesco && (
                  <small style={{ color: '#CF142B', fontSize: '0.8rem' }}>{addErrors.estParentesco}</small>
                )}
              </CCol>
            </CRow>

            {/* ──────────────── SECCIÓN CREDENCIALES (PREVIEW) ──────────────── */}
            <div
              style={{
                background: 'linear-gradient(135deg, #CF142B 0%, #A0102B 100%)',
                padding: '12px 18px',
                borderRadius: '10px',
                marginBottom: '20px',
                marginTop: '12px',
              }}
            >
              <h5 style={{ margin: 0, color: '#FFD100', fontWeight: '700' }}>
                🔐 Credenciales de Acceso
              </h5>
              <small style={{ color: 'rgba(255,255,255,0.8)' }}>
                Se generarán automáticamente al registrar
              </small>
            </div>

            <div
              style={{
                background: '#f8f9fa',
                borderRadius: '10px',
                padding: '16px 20px',
                border: '2px dashed #003893',
                marginBottom: '12px',
              }}
            >
              <CRow>
                <CCol md={6}>
                  <CFormLabel className="fw-semibold" style={{ color: '#003893' }}>
                    👤 Usuario (se genera automáticamente)
                  </CFormLabel>
                  <CFormInput
                    readOnly
                    value={
                      formData.estNombre.trim() && formData.estApellido.trim()
                        ? generarUsername(formData.estNombre, formData.estApellido)
                        : '(complete nombre y apellido del estudiante)'
                    }
                    style={{
                      background: '#e9ecef',
                      fontWeight: '700',
                      color: '#002244',
                      fontSize: '1.05rem',
                      cursor: 'not-allowed',
                    }}
                  />
                  <small className="text-muted">Formato: nombre.apellido</small>
                </CCol>
                <CCol md={6}>
                  <CFormLabel className="fw-semibold" style={{ color: '#003893' }}>
                    🔑 Contraseña (se genera al guardar)
                  </CFormLabel>
                  <CFormInput
                    readOnly
                    value="Se generará automáticamente (6 dígitos)"
                    style={{
                      background: '#e9ecef',
                      fontStyle: 'italic',
                      color: '#6c757d',
                      cursor: 'not-allowed',
                    }}
                  />
                  <small className="text-muted">Contraseña temporal de 6 dígitos</small>
                </CCol>
              </CRow>
            </div>

            {/* Tarjeta de credenciales generadas (post-registro) */}
            {generatedCredentials && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #155724 0%, #1e7e34 100%)',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  marginTop: '16px',
                  boxShadow: '0 4px 15px rgba(21,87,36,0.3)',
                }}
              >
                <h5 style={{ color: '#FFD100', fontWeight: '700', marginBottom: '12px' }}>
                  ✅ Credenciales Generadas — Entregar al Representante
                </h5>
                <p style={{ color: '#fff', marginBottom: '4px', fontSize: '0.85rem' }}>
                  Estudiante: <strong>{generatedCredentials.nombreCompleto}</strong>
                </p>
                <CRow className="mt-2">
                  <CCol md={6}>
                    <div
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                      }}
                    >
                      <small style={{ color: 'rgba(255,255,255,0.7)' }}>Usuario</small>
                      <p
                        style={{
                          color: '#FFD100',
                          fontSize: '1.2rem',
                          fontWeight: '700',
                          margin: 0,
                          letterSpacing: '0.5px',
                        }}
                      >
                        {generatedCredentials.username}
                      </p>
                    </div>
                  </CCol>
                  <CCol md={6}>
                    <div
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                      }}
                    >
                      <small style={{ color: 'rgba(255,255,255,0.7)' }}>Contraseña</small>
                      <p
                        style={{
                          color: '#FFD100',
                          fontSize: '1.2rem',
                          fontWeight: '700',
                          margin: 0,
                          letterSpacing: '2px',
                        }}
                      >
                        {generatedCredentials.password}
                      </p>
                    </div>
                  </CCol>
                </CRow>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', marginTop: '12px', marginBottom: 0 }}>
                  ⚠️ Anote estas credenciales. La contraseña no se podrá recuperar después de cerrar esta ventana.
                </p>
              </div>
            )}
          </form>
        </CModalBody>

        <CModalFooter
          style={{
            borderTop: '3px solid #FFD100',
            padding: '16px 28px',
          }}
        >
          <CButton
            style={{
              background: 'transparent',
              border: '2px solid #CF142B',
              color: '#CF142B',
              fontWeight: '600',
              borderRadius: '8px',
              padding: '8px 24px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#CF142B'
              e.target.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent'
              e.target.style.color = '#CF142B'
            }}
            onClick={handleCloseAddModal}
          >
            Cancelar
          </CButton>
          <CButton
            type="submit"
            form="formAddStudent"
            style={{
              background: 'linear-gradient(135deg, #003893 0%, #002766 100%)',
              border: 'none',
              color: '#FFD100',
              fontWeight: '700',
              borderRadius: '8px',
              padding: '8px 28px',
              boxShadow: '0 4px 12px rgba(0,56,147,0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 16px rgba(0,56,147,0.5)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 12px rgba(0,56,147,0.3)'
            }}
          >
            <CIcon icon={cilCheckCircle} className="me-2" />
            Registrar Estudiante
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de Progreso */}
      {selectedStudent && (
        <StudentProgressModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          studentId={selectedStudent.id}
        />
      )}
    </div>
  )
}

export default TeacherDashboard