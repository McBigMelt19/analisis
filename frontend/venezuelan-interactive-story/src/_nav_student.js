import React from 'react'
import { CNavItem, CNavGroup, CNavTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilPuzzle, cilCalculator, cilPencil, cilList, cilSettings } from '@coreui/icons'

const _nav_student = [
  {
    component: CNavTitle,
    name: '¡Bienvenidos!',
    className: 'home-hero', // estilo hero en sidebar
  },
  {
    component: CNavItem,
    name: 'Inicio',
    to: '/student/home',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    className: 'mb-2',
  },
  {
    component: CNavGroup,
    name: 'Grados',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Primer Grado',
        to: '/student/grade/1',
        className: 'grade-btn',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Segundo Grado',
        to: '/student/grade/2',
        className: 'grade-btn',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Tercer Grado',
        to: '/student/grade/3',
        className: 'grade-btn',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Cuarto Grado',
        to: '/student/grade/4',
        className: 'grade-btn',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Quinto Grado',
        to: '/student/grade/5',
        className: 'grade-btn',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Sexto Grado',
        to: '/student/grade/6',
        className: 'grade-btn',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Contenido Interactivo',
    to: '/student/content',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Mis Notas',
    to: '/student/grades',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Actividades',
    to: '/student/activities',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Configuraciones',
    to: '/student/settings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
];

export default _nav_student;