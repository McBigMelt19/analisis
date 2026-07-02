import React from 'react'

// ── Páginas de Estudiante ──────────────────────────────────
const HomePageCoreUI = React.lazy(() => import('./views/pages/home/HomePageCoreUI'))
const GradePageCoreUI = React.lazy(() => import('./views/pages/chatbot/GradePageCoreUI'))
const StudentProgress = React.lazy(() => import('./views/pages/student/StudentProgress'))
const StudentGrades = React.lazy(() => import('./views/pages/student/StudentGrades'))
const ContenidoInteractivo = React.lazy(() => import('./views/pages/contenido interactivo/Contenido Interactivo'))
const PersonalizedContent = React.lazy(() => import('./components/PersonalizedContent'))
const InteractiveTimeline = React.lazy(() => import('./components/InteractiveTimeline'))
const GamifiedQuiz = React.lazy(() => import('./components/GamifiedQuiz'))
const VirtualFieldTrip = React.lazy(() => import('./components/VirtualFieldTrip'))
const ProgressTracker = React.lazy(() => import('./components/ProgressTracker'))

// ── Páginas de Profesor ───────────────────────────────────
const TeacherDashboard = React.lazy(() => import('./views/pages/teacher/TeacherDashboard'))
const TeacherContent = React.lazy(() => import('./views/pages/teacher/TeacherContent'))
const TeacherGrades = React.lazy(() => import('./views/pages/teacher/TeacherGrades'))
const TeacherFeedback = React.lazy(() => import('./views/pages/teacher/TeacherFeedback'))
const TeacherAddContent = React.lazy(() => import('./views/pages/teacher/TeacherAddContent'))

// ── Nuevos Módulos de Roles ───────────────────────────────
const ZonaEducativaDashboard = React.lazy(() => import('./views/pages/zona_educativa/ZonaEducativaDashboard'))
const AdminEscuelaDashboard = React.lazy(() => import('./views/pages/admin_escuela/AdminEscuelaDashboard'))

const routes = [
  // ── Estudiante ──────────────────────────────────────────
  { path: '/home', name: 'Home', element: HomePageCoreUI },
  { path: '/dashboard', name: 'Dashboard', element: HomePageCoreUI },
  { path: '/student/home', name: 'StudentHome', element: HomePageCoreUI, allowedRoles: ['student'] },
  { path: '/student/grade/:grade', name: 'GradePage', element: GradePageCoreUI, allowedRoles: ['student'] },
  { path: '/student/progress', name: 'StudentProgress', element: StudentProgress, allowedRoles: ['student'] },
  { path: '/student/grades', name: 'StudentGrades', element: StudentGrades, allowedRoles: ['student'] },
  { path: '/student/chatbot', name: 'StudentChatbot', element: PersonalizedContent, allowedRoles: ['student'] },
  { path: '/student/content', name: 'ContenidoInteractivo', element: ContenidoInteractivo, allowedRoles: ['student'] },

  // Componentes de estudiante (acceso standalone)
  { path: '/PersonalizedContent', name: 'PersonalizedContent', element: PersonalizedContent, allowedRoles: ['student'] },
  { path: '/InteractiveTimeline', name: 'InteractiveTimeline', element: InteractiveTimeline, allowedRoles: ['student'] },
  { path: '/GamifiedQuiz', name: 'GamifiedQuiz', element: GamifiedQuiz, allowedRoles: ['student'] },
  { path: '/VirtualFieldTrip', name: 'VirtualFieldTrip', element: VirtualFieldTrip, allowedRoles: ['student'] },
  { path: '/ProgressTracker', name: 'ProgressTracker', element: ProgressTracker, allowedRoles: ['student'] },

  // ── Profesor ────────────────────────────────────────────
  { path: '/teacher/dashboard', name: 'TeacherDashboard', element: TeacherDashboard, allowedRoles: ['teacher'] },
  { path: '/teacher/content', name: 'TeacherContent', element: TeacherContent, allowedRoles: ['teacher'] },
  { path: '/teacher/upload-grades', name: 'TeacherGrades', element: TeacherGrades, allowedRoles: ['teacher'] },
  { path: '/teacher/feedback', name: 'TeacherFeedback', element: TeacherFeedback, allowedRoles: ['teacher'] },
  { path: '/teacher/add-content', name: 'TeacherAddContent', element: TeacherAddContent, allowedRoles: ['teacher'] },

  // ── Zona Educativa (Super Admin) ────────────────────────
  { path: '/zona-educativa/dashboard', name: 'ZonaEducativaDashboard', element: ZonaEducativaDashboard, allowedRoles: ['zona_educativa'] },

  // ── Admin Escuela (Secretario/Subdirector) ───────────────
  { path: '/admin-escuela/dashboard', name: 'AdminEscuelaDashboard', element: AdminEscuelaDashboard, allowedRoles: ['admin_escuela'] },
]

export default routes