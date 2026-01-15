const _nav_teacher = [
  {
    component: CNavItem,
    name: 'Inicio (Profesor)',
    to: '/teacher/dashboard',
    icon: <CIcon icon={cilFactory} customClassName="nav-icon" />,
    badge: {
      color: 'success',
      text: 'NUEVO',
    },
  },
  {
    component: CNavTitle,
    name: 'GESTIÓN EDUCATIVA',
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
  {
    component: CNavItem,
    name: 'Recursos Adicionales',
    to: '/teacher/resources',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },
];

export default _nav_teacher;