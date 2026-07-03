import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CSpinner } from '@coreui/react'

/**
 * Componente Wrapper para Proteger Rutas Basado en Roles
 * - allowedRoles: Array de roles permitidos (ej. ['student', 'teacher'])
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, isAuthenticated, loading } = useAuth()

  // 1. Mostrar pantalla de carga mientras se recupera la sesión
  if (loading) {
    return (
      <div className="text-center p-5 min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <CSpinner color="primary" size="lg" />
        <p className="mt-3 text-muted" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Verificando credenciales de acceso...
        </p>
      </div>
    )
  }

  // 2. Si no está autenticado, redirigir a Login
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />
  }

  // 3. Si la ruta no especifica roles permitidos, permitir acceso (ruta pública autenticada)
  if (!allowedRoles || allowedRoles.length === 0) {
    return children
  }

  // 4. Si el rol del usuario no está dentro de los permitidos, redirigir a su panel correspondiente
  if (!allowedRoles.includes(currentUser.role)) {
    console.warn(`[ProtectedRoute] Acceso denegado para el rol: ${currentUser.role}. Requerido:`, allowedRoles)

    // Redirección inteligente al Dashboard correspondiente según el rol real del usuario
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
        // Si no coincide con ningún rol conocido, cerrar sesión o mandar a login
        return <Navigate to="/login" replace />
    }
  }

  // 5. Si todo está correcto, permitir visualización de la vista
  return children
}

export default ProtectedRoute
