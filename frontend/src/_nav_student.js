import {
  CNavItem,
  CNavGroup,
  CNavTitle
} from '@coreui/react'
import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilTruck,
  cilCart,
  cilSpreadsheet,
  cilDollar,
  cilPuzzle
} from '@coreui/icons'

const _nav_student = [
    {
    component: CNavGroup,
    name: 'Grados',
    to: '/stock',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
    {
    component: CNavItem,
    name: 'Primer Grado',
    to: '/menu/1',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
    {
    component: CNavItem,
    name: 'Segundo Grado',
    to: '/menu/2',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
    {
    component: CNavItem,
    name: 'Tercer Grado',
    to: '/menu/3',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
    {
    component: CNavItem,
    name: 'Cuarto Grado',
    to: '/menu/4',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
    {
    component: CNavItem,
    name: 'Quinto Grado',
    to: '/menu/5',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
    {
    component: CNavItem,
    name: 'Sexto Grado',
    to: '/menu/6',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },        
    ],
  },
];

export default _nav_student;