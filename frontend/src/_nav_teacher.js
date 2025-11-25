import React from 'react'
import { CNavItem, CNavTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFactory, cilPencil, cilCalculator, cilSettings } from '@coreui/icons'

const _nav_teacher = [
  {
    component: CNavItem,
    name: 'Panel Principal (Profesor)',
    to: '/teacher/content',
    icon: <CIcon icon={cilFactory} customClassName="nav-icon" />,
    badge: {
      color: 'danger',
      text: 'ADMIN',
    },
  },
  {
    component: CNavTitle,
    name: 'GESTIÓN Y REPORTES',
  },
  {
    component: CNavItem,
    name: 'Contenido',
    to: '/teacher/content',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Subir Notas',
    to: '/teacher/upload-grades',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Retroalimentación',
    to: '/teacher/feedback',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Agregar Contenido',
    to: '/teacher/add-content',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
]

export default _nav_teacher