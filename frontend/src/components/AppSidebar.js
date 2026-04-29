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

import { AppSidebarNav } from './AppSidebarNav'
import { useAuth } from '../context/AuthContext'

import myPngLogo from '../assets/brand/logo.png'

import { getNavigation } from '../_nav'

const AppSidebar = ({ nav }) => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { currentUser } = useAuth()

  // 🎯 Determinar qué navegación mostrar según el rol del usuario
  const resolveNavigation = () => {
    // Si se pasa nav como prop, usarlo
    if (nav && nav.length) {
      return nav
    }

    // Usar la navegación unificada basada en el usuario autenticado
    return getNavigation(currentUser)
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
      {/* Navegación dinámica basada en el rol del usuario */}
      <AppSidebarNav items={resolveNavigation()} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

