import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Stock = React.lazy(() => import('./views/pages/stock/stock'))
const Proveedors = React.lazy(() => import ('./views/pages/proveedors/proveedors'))
const Cars = React.lazy(() => import('./views/pages/stock/cars'))
const Parts = React.lazy(() => import('./views/pages/stock/parts'))
const ChatbotWrapper = React.lazy(() => import('./views/pages/chatbot/ChatbotWrapper'))
const datagrado = React.lazy(() => import('./views/pages/chatbot/datagrado'))
const reutilizable = React.lazy(() => import('./views/pages/chatbot/reutilizable'))
const Chatbot = React.lazy(() => import('./views/pages/chatbot/Chatbot'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
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
]

export default routes
