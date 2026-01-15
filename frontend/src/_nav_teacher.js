import React from 'react'
import { CNavItem, CNavGroup, CNavTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPencil,
  cilCalculator,
  cilBook,
  cilList,
  cilCloudUpload,
  cilCommentSquare,
  cilPlus,
} from '@coreui/icons'

import mapImage from './assets/images/venezuela-theme-map.png'

const _nav_teacher = [
  {
    component: CNavTitle,
    name: (
      <div className="text-center">
        <img src={mapImage} alt="Mapa de Venezuela" style={{ maxWidth: '80%', borderRadius: '10px', marginBottom: '10px' }} />
        <div>¡Hola, Profesor! 🌟</div>
      </div>
    ),
    className: 'home-hero nav-title',
  },
  {
    component: CNavItem,
    name: 'Inicio 🏠',
    to: '/teacher/dashboard',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    className: 'mb-2',
  },
  {
    component: CNavTitle,
    name: 'Menú del Profesor',
  },
  {
    component: CNavItem,
    name: 'Gestión de Contenido',
    to: '/teacher/content',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Subir Notas',
    to: '/teacher/upload-grades',
    icon: <CIcon icon={cilCloudUpload} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Retroalimentación',
    to: '/teacher/feedback',
    icon: <CIcon icon={cilCommentSquare} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Agregar Contenido',
    to: '/teacher/add-content',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },
]

export default _nav_teacher