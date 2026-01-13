import React from 'react'
import { CNavItem, CNavGroup, CNavTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilPuzzle,
  cilCalculator,
  cilList,
  cilSettings,
  cilPencil,
} from '@coreui/icons'

import mapImage from './assets/images/venezuela-theme-map.png'

const _nav_student = [
  {
    component: CNavTitle,
    name: (
      <div className="text-center">
        <img src={mapImage} alt="Mapa de Venezuela" style={{ maxWidth: '80%', borderRadius: '10px', marginBottom: '10px' }} />
        <div>¡Bienvenidos, Exploradores! 🌎</div>
      </div>
    ),
    className: 'home-hero nav-title',
  },
  {
    component: CNavItem,
    name: 'Inicio 🏠',
    to: '/student/home',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    className: 'mb-2',
  },
  {
    component: CNavGroup,
    name: 'Grados 📚',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Primer Grado — Aventuras',
        to: '/student/grade/1',
        className: 'grade-btn',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Segundo Grado — Descubre',
        to: '/student/grade/2',
        className: 'grade-btn',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Tercer Grado — Explora',
        to: '/student/grade/3',
        className: 'grade-btn',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Cuarto Grado — Historias',
        to: '/student/grade/4',
        className: 'grade-btn',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Quinto Grado — Tesoros',
        to: '/student/grade/5',
        className: 'grade-btn',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Sexto Grado — Leyendas',
        to: '/student/grade/6',
        className: 'grade-btn',
        icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Contenido Interactivo 🎮',
    to: '/student/content',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Mis Notas 📒',
    to: '/student/grades',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Actividades & Juegos 🧩',
    to: '/student/activities',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Configuraciones ⚙️',
    to: '/student/settings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
]

export default _nav_student