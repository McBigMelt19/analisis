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
import myPngLogo from '../assets/brand/logo.js' // Cambiar a un logo más colorido y amigable
import defaultNavigation from '../_nav' // Asegúrate de que este archivo tenga la navegación adecuada

const AppSidebar = ({ nav }) => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="light" // Cambiar a un esquema de color más brillante
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand className="d-none d-md-flex" to="/">
          <img 
            src={myPngLogo} 
            alt="Logo de la Historia Interactiva" 
            style={{ height: '70px', width: 'auto', padding: '10px 40px' }} 
          />
        </CSidebarBrand>
        <CSidebarBrand className="d-md-none" to="/">
          <img 
            src={myPngLogo} 
            alt="Logo de la Historia Interactiva" 
            style={{ height: '30px' }} 
          />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={nav && nav.length ? nav : defaultNavigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)