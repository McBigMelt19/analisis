import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

// routes config
import routes from '../routes'

// Componente para redirigir dinámicamente a los usuarios a sus dashboards según su rol
const HomeRedirect = () => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  switch (currentUser.role) {
    case 'student':
      return <Navigate to="/student/home" replace />
    case 'teacher':
      return <Navigate to="/teacher/dashboard" replace />
    case 'zona_educativa':
      return <Navigate to="/zona-educativa/dashboard" replace />
    case 'admin_escuela':
      return <Navigate to="/admin-escuela/dashboard" replace />
    default:
      return <Navigate to="/login" replace />
  }
}

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {/* Interceptar /home y /dashboard para redirección inteligente de roles */}
          <Route path="/home" element={<HomeRedirect />} />
          <Route path="/dashboard" element={<HomeRedirect />} />

          {routes.map((route, idx) => {
            if (!route.element) return null
            const Element = route.element
            
            // Envolver elemento en ProtectedRoute si define allowedRoles
            const elementWithProtection = route.allowedRoles ? (
              <ProtectedRoute allowedRoles={route.allowedRoles}>
                <Element />
              </ProtectedRoute>
            ) : (
              <Element />
            )

            return (
              <Route
                key={idx}
                path={route.path}
                name={route.name}
                element={elementWithProtection}
              />
            )
          })}

          {/* Si el usuario llega a una ruta no registrada, enviamos a /home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)