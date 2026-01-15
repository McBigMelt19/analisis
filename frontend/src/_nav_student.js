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
  cilChart,
  cilCommentBubble,
} from '@coreui/icons'

import mapImage from './assets/images/venezuela-theme-map.png'

// Función que genera el menú filtrado según el grado del estudiante
export const getStudentNav = (currentUser) => {
  if (!currentUser || currentUser.role !== 'student') {
    return []
  }

  // Todos los grados disponibles
  const allGrades = [
    {
      component: CNavItem,
      name: 'Primer Grado — Aventuras',
      to: '/student/grade/1',
      className: 'grade-btn',
      icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      grade_id: 1,
    },
    {
      component: CNavItem,
      name: 'Segundo Grado — Descubre',
      to: '/student/grade/2',
      className: 'grade-btn',
      icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      grade_id: 2,
    },
    {
      component: CNavItem,
      name: 'Tercer Grado — Explora',
      to: '/student/grade/3',
      className: 'grade-btn',
      icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      grade_id: 3,
    },
    {
      component: CNavItem,
      name: 'Cuarto Grado — Historias',
      to: '/student/grade/4',
      className: 'grade-btn',
      icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      grade_id: 4,
    },
    {
      component: CNavItem,
      name: 'Quinto Grado — Tesoros',
      to: '/student/grade/5',
      className: 'grade-btn',
      icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      grade_id: 5,
    },
    {
      component: CNavItem,
      name: 'Sexto Grado — Leyendas',
      to: '/student/grade/6',
      className: 'grade-btn',
      icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
      grade_id: 6,
    },
  ]

  // 🎯 FILTRO: Solo mostrar el grado del estudiante
  const studentGrade = allGrades.filter((item) => item.grade_id === currentUser.grade_id)

  return [
    {
      component: CNavTitle,
      name: (
        <div className="text-center">
          <img
            src={mapImage}
            alt="Mapa de Venezuela"
            style={{ maxWidth: '80%', borderRadius: '10px', marginBottom: '10px' }}
          />
          <div>¡Bienvenido, {currentUser.name?.split(' ')[0]}! 🌎</div>
        </div>
      ),
      className: 'home-hero nav-title',
    },
    {
      component: CNavItem,
      name: 'Inicio 🏠',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      className: 'mb-2',
    },
    {
      component: CNavTitle,
      name: 'Mi Grado',
    },
    ...studentGrade, // Solo aparece SU grado
    {
      component: CNavItem,
      name: 'Contenido Interactivo 🎮',
      to: '/student/content',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Mi Progreso 📊',
      to: '/student/progress',
      icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Chatbot IA 🤖',
      to: '/student/chatbot',
      icon: <CIcon icon={cilCommentBubble} customClassName="nav-icon" />,
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
}

// Exportación por defecto para compatibilidad (muestra todos los grados)
const _nav_student = [
  {
    component: CNavTitle,
    name: (
      <div className="text-center">
        <img
          src={mapImage}
          alt="Mapa de Venezuela"
          style={{ maxWidth: '80%', borderRadius: '10px', marginBottom: '10px' }}
        />
        <div>¡Bienvenidos, Exploradores! 🌎</div>
      </div>
    ),
    className: 'home-hero nav-title',
  },
  {
    component: CNavItem,
    name: 'Inicio 🏠',
    to: '/dashboard',
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