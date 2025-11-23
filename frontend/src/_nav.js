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

const _nav = [
/*   {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Proveedors',
    to: '/proveedors',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Stock',
    to: '/stock',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Cars',
        to: '/cars', 
        icon: <CIcon icon={cilTruck} customClassName="nav-icon" />
      },
      {
        component: CNavItem,
        name: 'Parts',
        to: '/parts',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />, 
      },
    ],
  }, 
    {
    component: CNavItem,
    name: 'reutilizable',
    to: '/reutilizable',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
    {
    component: CNavItem,
    name: 'datagrado',
    to: '/datagrado',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
    {
    component: CNavItem,
    name: 'chatbot',
    to: '/chatbot',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },*/
    {
    component: CNavGroup,
    name: 'Grados',
    to: '/stock',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
    {
    component: CNavItem,
    name: 'Primer Grado',
    to: '/chatbot',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
    {
    component: CNavItem,
    name: 'Segundo Grado',
    to: '/chatbot',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
    {
    component: CNavItem,
    name: 'Tercer Grado',
    to: '/chatbot',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
    {
    component: CNavItem,
    name: 'Cuarto Grado',
    to: '/chatbot',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
    {
    component: CNavItem,
    name: 'Quinto Grado',
    to: '/chatbot',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
    {
    component: CNavItem,
    name: 'Sexto Grado',
    to: '/chatbot',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },        
    ],
  },
]

export default _nav
