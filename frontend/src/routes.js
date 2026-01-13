import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Stock = React.lazy(() => import('./views/pages/stock/stock'))
const Proveedors = React.lazy(() => import('./views/pages/proveedors/proveedors'))
const Cars = React.lazy(() => import('./views/pages/stock/cars'))
const Parts = React.lazy(() => import('./views/pages/stock/parts'))
const ChatbotWrapper = React.lazy(() => import('./views/pages/chatbot/ChatbotWrapper'))
const datagrado = React.lazy(() => import('./views/pages/chatbot/datagrado'))
const reutilizable = React.lazy(() => import('./views/pages/chatbot/reutilizable'))
const Chatbot = React.lazy(() => import('./views/pages/chatbot/Chatbot'))
const menu = React.lazy(() => import('./views/pages/chatbot/GradePageCoreUI'))
// Atención a la corrección del typo en PersonalizedContent
const PersonalizedContent = React.lazy(() => import('./components/PersonalizedContent'));
const InteractiveTimeline = React.lazy(() => import('./components/InteractiveTimeline'));
const GamifiedQuiz = React.lazy(() => import('./components/GamifiedQuiz'));
const VirtualFieldTrip = React.lazy(() => import('./components/VirtualFieldTrip'));
const ProgressTracker = React.lazy(() => import('./components/ProgressTracker'));
const HomePageCoreUI = React.lazy(() => import('./views/pages/home/HomePageCoreUI'))
const TeacherDashboard = React.lazy(() => import('./views/pages/teacher/TeacherDashboard'))
const TeacherContent = React.lazy(() => import('./views/pages/teacher/TeacherContent'))
const TeacherGrades = React.lazy(() => import('./views/pages/teacher/TeacherGrades'))
const TeacherFeedback = React.lazy(() => import('./views/pages/teacher/TeacherFeedback'))
const TeacherAddContent = React.lazy(() => import('./views/pages/teacher/TeacherAddContent'))

const routes = [

  { path: '/home', name: 'Home', element: HomePageCoreUI },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/login', name: 'Login', element: Login },
  { path: '/stock', name: 'Stock', element: Stock },
  { path: '/proveedors', name: 'Proveedors', element: Proveedors },
  { path: '/cars', name: 'Cars', element: Cars },
  { path: '/parts', name: 'Parts', element: Parts },
  { path: '/chatbotwrapper', name: 'chatbotwrapper', element: ChatbotWrapper },
  { path: '/datagrado', name: 'datagrado', element: datagrado },
  { path: '/reutilizable', name: 'reutilizable', element: reutilizable },
  { path: '/chatbot', name: 'chatbot', element: Chatbot },
  { path: '/student/grade/:grade', name: 'menu', element: menu },
  { path: '/PersonalizedContent', name: 'PersonalizedContent', element: PersonalizedContent },
  { path: '/InteractiveTimeline', name: 'InteractiveTimeline', element: InteractiveTimeline },
  { path: '/GamifiedQuiz', name: 'GamifiedQuiz', element: GamifiedQuiz },
  { path: '/VirtualFieldTrip', name: 'VirtualFieldTrip', element: VirtualFieldTrip },
  { path: '/ProgressTracker', name: 'ProgressTracker', element: ProgressTracker },
  // Teacher Routes
  { path: '/teacher/dashboard', name: 'TeacherDashboard', element: TeacherDashboard },
  { path: '/teacher/content', name: 'TeacherContent', element: TeacherContent },
  { path: '/teacher/upload-grades', name: 'TeacherGrades', element: TeacherGrades },
  { path: '/teacher/feedback', name: 'TeacherFeedback', element: TeacherFeedback },
  { path: '/teacher/add-content', name: 'TeacherAddContent', element: TeacherAddContent },
]

export default routes