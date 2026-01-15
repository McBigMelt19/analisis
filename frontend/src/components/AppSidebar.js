import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'
import { useAuth } from '../context/AuthContext'

import myPngLogo from '../assets/brand/logo.png'

import defaultNavigation, { getStudentNav } from '../_nav_student'
import _navTeacher from '../_nav_teacher'

const AppSidebar = ({ nav }) => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { currentUser } = useAuth()

  // 🎯 Determinar qué navegación mostrar según el rol del usuario
  const getNavigation = () => {
    // Si se pasa nav como prop, usarlo
    if (nav && nav.length) {
      return nav
    }

    // Si no hay usuario autenticado, usar navegación por defecto
    if (!currentUser) {
      return defaultNavigation
    }

    // Navegación según el rol
    if (currentUser.role === 'student') {
      return getStudentNav(currentUser) // Filtrado por grado
    } else if (currentUser.role === 'teacher') {
      return _navTeacher
    }

    return defaultNavigation
  }

  return (
    <CSidebar
      className="border-end"
      colorScheme="primary"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand className="d-none d-md-flex" to="/">
          <div className="logo-sticker">
            <img
              src={myPngLogo}
              alt="ford"
              style={{ height: '70px', width: 'auto', padding: '5px' }}
            />
          </div>
        </CSidebarBrand>
        <CSidebarBrand className="d-md-none" to="/">
          <img src={myPngLogo} alt="ford" style={{ height: '30px' }} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      {/* Usa la navegación dinámica basada en el rol del usuario */}
      <AppSidebarNav items={getNavigation()} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

