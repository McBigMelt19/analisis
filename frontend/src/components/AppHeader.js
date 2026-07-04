import React, { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

// Icono personalizado de interrogación compatible con CIcon de CoreUI
const cilQuestion = [
  '512 512',
  "<path fill='var(--ci-primary-color, currentcolor)' d='M256 8C119.043 8 8 119.083 8 256c0 136.92 111.043 248 248 248s248-111.08 248-248C504 119.083 392.957 8 256 8zm0 448c-110.28 0-200-89.72-200-200S145.72 56 256 56s200 89.72 200 200-89.72 200-200 200zm10.26-267.3c-15.63 9.4-23.76 21.6-24.26 38.3a12 12 0 0 1-12 11.7h-27.5c-6.6 0-11.9-5.3-12-11.9-.9-29.2 13.9-52.6 37-67.6 15.6-10.1 20.3-19.1 20.3-31.5 0-17.7-14.3-32-32-32s-32 14.3-32 32c0 6.6-5.4 12-12 12h-27.5c-6.6 0-12-5.4-12-12 0-48.5 39.5-88 88-88s88 39.5 88 88c0 29.5-14.7 49-34.24 61.3zM256 352a24 24 0 1 1 24-24 24 24 0 0 1-24 24z' class='ci-primary'/>"
]

import { AppBreadcrumb, UserManualModal } from './index'
import { AppHeaderDropdown } from './header/index'
import { useAuth } from '../context/AuthContext'
import { logo } from '../assets/brand/logo' // sticker logo svg

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const { currentUser } = useAuth()
  const [manualVisible, setManualVisible] = useState(false)

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    const handleScroll = () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    }

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])


  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        {/* logo dentro de un sticker infantil */}
        <div className="logo-sticker d-flex align-items-center me-3" aria-hidden>
          {logo}
        </div>

        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Users</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Settings</CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          <CNavItem>
            <CNavLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setManualVisible(true)
              }}
              title="Manual de Usuario"
              style={{ cursor: 'pointer' }}
            >
              <CIcon icon={cilQuestion} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          <CNavItem className="d-flex align-items-center me-2">
            <span className="text-muted small">
              {currentUser ? `${currentUser.name} (${currentUser.role === 'teacher' ? 'Profesor' : 'Estudiante'})` : 'Invitado'}
            </span>
          </CNavItem>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>

          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
      <UserManualModal visible={manualVisible} onClose={() => setManualVisible(false)} />
    </CHeader>
  )
}

export default AppHeader
