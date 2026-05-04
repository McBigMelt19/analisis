import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CModal,
  CModalHeader,
  CModalTitle, // Ojo: Importa esto
  CModalBody,
  CModalFooter,
  CButton,
  CRow,   // Importante para el diseño
  CCol,   // Importante para el diseño
  CFormInput, // Para editar datos
  CFormLabel
} from '@coreui/react'
import {
  cilLockLocked,
  cilSettings,
  cilUser,
  cilPencil // Icono para editar
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  // Estado para el Logout (ya lo tenías)
  const [visible, setVisible] = useState(false)

  // NUEVO: Estado para el Modal de Perfil
  const [profileVisible, setProfileVisible] = useState(false)

  const openConfirm = () => setVisible(true)
  const closeConfirm = () => setVisible(false)

  const handleConfirmLogout = () => {
    try {
      logout()
    } catch (e) {
      console.error('Logout error:', e)
    }
    setVisible(false)
    navigate('/login', { replace: true })
  }

  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <CAvatar src={avatar8} size="md" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>

          {/* AQUÍ ESTÁ EL CAMBIO LÍNEA 64 APROX */}
          {/* Cambiamos href="#" por onClick para abrir el modal */}
          <CDropdownItem onClick={() => setProfileVisible(true)} style={{ cursor: 'pointer' }}>
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>

          <CDropdownItem href="#">
            <CIcon icon={cilSettings} className="me-2" />
            Settings
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem as="button" type="button" onClick={openConfirm} className="text-danger">
            <CIcon icon={cilLockLocked} className="me-2" />
            Cerrar sesión
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      {/* --- MODAL DE LOGOUT (El que ya tenías) --- */}
      <CModal visible={visible} onClose={closeConfirm} alignment="center">
        <CModalHeader>Confirmar cierre de sesión</CModalHeader>
        <CModalBody>¿Estás seguro que deseas cerrar sesión?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeConfirm}>Cancelar</CButton>
          <CButton color="danger" onClick={handleConfirmLogout}>Cerrar sesión</CButton>
        </CModalFooter>
      </CModal>

      {/* --- NUEVO MODAL DE PERFIL (Estilo Top Eleven) --- */}
      <CModal
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
        alignment="center"
        size="lg" // Hacemos el modal grande para que quepa todo
      >
        <CModalHeader className="bg-success text-white"> {/* Estilo verde como la imagen */}
          <CModalTitle>Detalles del Profesor</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            {/* COLUMNA IZQUIERDA: FOTO Y ESCUDOS */}
            <CCol md={5} className="text-center border-end">
              <div className="position-relative d-inline-block">
                <img
                  src={avatar8}
                  alt="Profile"
                  className="img-fluid rounded border border-3 border-success"
                  style={{ maxHeight: '200px' }}
                />
                {/* Botón flotante de editar foto */}
                <CButton
                  color="success"
                  size="sm"
                  className="position-absolute top-0 start-0 m-1 rounded-circle p-2"
                >
                  <CIcon icon={cilPencil} className="text-white" />
                </CButton>
              </div>
              <div className="mt-3 d-flex justify-content-around">
                {/* Aquí pondrías iconos de trofeos o estadísticas */}
                <CBadge color="warning" shape="rounded-pill">Grado nro: </CBadge>
                <CBadge color="info" shape="rounded-pill">Profesor</CBadge>
              </div>
            </CCol>

            {/* COLUMNA DERECHA: DATOS DEL FORMULARIO */}
            <CCol md={7}>
              <div className="mb-3">
                <CFormLabel>Nombre de Usuario</CFormLabel>
                <div className="d-flex">
                  <CFormInput type="text" defaultValue="Angel" readOnly={false} />
                </div>
              </div>

              <div className="mb-3">
                <CFormLabel>Edad</CFormLabel>
                <div className="d-flex align-items-center gap-2">
                  <span>25 años</span>
                </div>
              </div>

              <div className="mb-3">
                <CFormLabel>Fecha de Nacimiento</CFormLabel>
                <CFormInput type="date" defaultValue="2020-10-07" disabled />
              </div>

              <div className="mb-3">
                <CFormLabel>Telefono</CFormLabel>
                <CFormInput type="text" defaultValue="0424-1234567" disabled />
              </div>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setProfileVisible(false)}>
            Cerrar
          </CButton>
          <CButton color="success" className="text-white">
            Guardar Cambios
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AppHeaderDropdown