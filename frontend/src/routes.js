import React from 'react'

// Student Pages
const HomePageCoreUI = React.lazy(() => import('./views/pages/home/HomePageCoreUI'))
const GradePageCoreUI = React.lazy(() => import('./views/pages/chatbot/GradePageCoreUI'))

// Student Components
const PersonalizedContent = React.lazy(() => import('./components/PersonalizedContent'))
const InteractiveTimeline = React.lazy(() => import('./components/InteractiveTimeline'))
const GamifiedQuiz = React.lazy(() => import('./components/GamifiedQuiz'))
const VirtualFieldTrip = React.lazy(() => import('./components/VirtualFieldTrip'))
const ProgressTracker = React.lazy(() => import('./components/ProgressTracker'))
const StudentProgress = React.lazy(() => import('./views/pages/student/StudentProgress'))

// Teacher Pages
const TeacherDashboard = React.lazy(() => import('./views/pages/teacher/TeacherDashboard'))
const TeacherContent = React.lazy(() => import('./views/pages/teacher/TeacherContent'))
const TeacherGrades = React.lazy(() => import('./views/pages/teacher/TeacherGrades'))
const TeacherFeedback = React.lazy(() => import('./views/pages/teacher/TeacherFeedback'))
const TeacherAddContent = React.lazy(() => import('./views/pages/teacher/TeacherAddContent'))

// Auth Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))

const routes = [
  // 🔥 ESTA ES LA CLAVE: La ruta raíz "/" ahora carga el Chatbot directo
  { path: '/', exact: true, name: 'Asistente IA', element: PersonalizedContent },

  // Student Routes
  { path: '/home', name: 'Home', element: HomePageCoreUI },
  { path: '/student/home', name: 'StudentHome', element: HomePageCoreUI },
  { path: '/student/grade/:grade', name: 'GradePage', element: GradePageCoreUI },

  // Student Component Routes
  { path: '/PersonalizedContent', name: 'PersonalizedContent', element: PersonalizedContent },
  { path: '/InteractiveTimeline', name: 'InteractiveTimeline', element: InteractiveTimeline },
  { path: '/GamifiedQuiz', name: 'GamifiedQuiz', element: GamifiedQuiz },
  { path: '/VirtualFieldTrip', name: 'VirtualFieldTrip', element: VirtualFieldTrip },
  { path: '/ProgressTracker', name: 'ProgressTracker', element: ProgressTracker },

  // Student Feature Routes
  { path: '/student/progress', name: 'StudentProgress', element: StudentProgress },
  { path: '/student/chatbot', name: 'StudentChatbot', element: PersonalizedContent },
  { path: '/dashboard', name: 'Dashboard', element: HomePageCoreUI },

  // Teacher Routes
  { path: '/teacher/dashboard', name: 'TeacherDashboard', element: TeacherDashboard },
  { path: '/teacher/content', name: 'TeacherContent', element: TeacherContent },
  { path: '/teacher/upload-grades', name: 'TeacherGrades', element: TeacherGrades },
  { path: '/teacher/feedback', name: 'TeacherFeedback', element: TeacherFeedback },
  { path: '/teacher/add-content', name: 'TeacherAddContent', element: TeacherAddContent },

  // Auth Routes
  //{ path: '/login', name: 'Login', element: Login },
]

export default routes