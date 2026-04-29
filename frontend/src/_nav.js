import React from 'react'
import { CNavItem, CNavGroup, CNavTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilPuzzle,
  cilCalculator,
  cilPencil,
  cilChart,
  cilCommentBubble,
  cilBook,
  cilList,
  cilCloudUpload,
  cilCommentSquare,
  cilPlus,
} from '@coreui/icons'

import mapImage from './assets/images/venezuela-theme-map.png'

// ─────────────────────────────────────────────
// Navegación dinámica según el rol del usuario
// ─────────────────────────────────────────────

/**
 * Genera el menú de navegación según el rol del usuario autenticado.
 * - student: muestra solo su grado + módulos de estudiante
 * - teacher: muestra módulos del profesor
 * - fallback: navegación vacía
 */
export const getNavigation = (currentUser) => {
  if (!currentUser) return []

  if (currentUser.role === 'student') {
    return getStudentNav(currentUser)
  }

  if (currentUser.role === 'teacher') {
    return getTeacherNav(currentUser)
  }

  return []
}

// ─────────────────────────────────────────────
// Navegación del ESTUDIANTE
// ─────────────────────────────────────────────

const getStudentNav = (currentUser) => {
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

  // Solo mostrar el grado del estudiante
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
    ...studentGrade,
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
  ]
}

// ─────────────────────────────────────────────
// Navegación del PROFESOR
// ─────────────────────────────────────────────

const getTeacherNav = (currentUser) => {
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
          <div>¡Hola, {currentUser.name?.split(' ')[0]}! 🌟</div>
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
}

export default getNavigation
