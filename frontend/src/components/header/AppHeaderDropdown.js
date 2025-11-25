import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../config/auth'
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
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

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
        <CDropdownItem href="#">
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

      <CModal visible={visible} onClose={closeConfirm} alignment="center">
        <CModalHeader>Confirmar cierre de sesión</CModalHeader>
        <CModalBody>¿Estás seguro que deseas cerrar sesión?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeConfirm}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={handleConfirmLogout}>
            Cerrar sesión
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AppHeaderDropdown
