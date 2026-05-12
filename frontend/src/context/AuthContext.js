import React, { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/auth.service'
import { isBackendMode } from '../services/api.config'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

/**
 * Devuelve la ruta de redirección según el rol del usuario
 */
const getRoleDashboardPath = (role) => {
  const routeMap = {
    zona_educativa: '/zona-educativa/dashboard',
    admin_escuela: '/admin-escuela/dashboard',
    teacher: '/teacher/dashboard',
    student: '/dashboard',
    // fallback para roles no mapeados
  }
  return routeMap[role] || '/dashboard'
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Restaurar sesión desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setCurrentUser(user)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('currentUser')
      }
    }
    setLoading(false)
  }, [])

  const login = async (identifier, password) => {
    try {
      const result = await authService.login(identifier, password)

      if (result.success) {
        setCurrentUser(result.user)
        setIsAuthenticated(true)
        localStorage.setItem('currentUser', JSON.stringify(result.user))
        return {
          success: true,
          user: result.user,
          redirectTo: getRoleDashboardPath(result.user.role)
        }
      } else {
        return { success: false, message: result.message }
      }
    } catch (error) {
      console.error('Error en login:', error)

      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        const modeMsg = isBackendMode()
          ? '❌ No se puede conectar al servidor. Verifica que el backend esté activo en el puerto 5001.'
          : '❌ No se puede conectar. Asegúrate de ejecutar: npm run server'
        return { success: false, message: modeMsg }
      } else if (error.message.includes('JSON')) {
        return { success: false, message: '❌ El servidor no está devolviendo datos correctos.' }
      }
      return { success: false, message: `Error: ${error.message}` }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (e) {
      console.error('Error durante el logout remoto:', e)
    } finally {
      setCurrentUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('currentUser')
      localStorage.removeItem('authToken')
    }
  }

  /**
   * Verifica si el usuario actual tiene uno de los roles dados
   */
  const hasRole = (...roles) => {
    if (!currentUser) return false
    return roles.includes(currentUser.role)
  }

  const isZonaEducativa = () => hasRole('zona_educativa')
  const isAdminEscuela = () => hasRole('admin_escuela')
  const isProfesor = () => hasRole('teacher')
  const isEstudiante = () => hasRole('student')

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
    hasRole,
    isZonaEducativa,
    isAdminEscuela,
    isProfesor,
    isEstudiante,
    getRoleDashboardPath
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
