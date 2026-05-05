import React, { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/auth.service'
import { isRenderMode } from '../services/api.config'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    // Cargar usuario desde localStorage al iniciar
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

    const login = async (username, password) => {
        try {
            const result = await authService.login(username, password)

            if (result.success) {
                setCurrentUser(result.user)
                setIsAuthenticated(true)
                localStorage.setItem('currentUser', JSON.stringify(result.user))
                return { success: true, user: result.user }
            } else {
                return { success: false, message: result.message }
            }
        } catch (error) {
            console.error('Error en login:', error)

            // Mensajes de error más específicos
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                const modeMsg = isRenderMode()
                    ? '❌ No se puede conectar al servidor en Render. Verifica que el backend esté activo.'
                    : '❌ No se puede conectar al servidor. Asegúrate de ejecutar: npm run server'
                return {
                    success: false,
                    message: modeMsg
                }
            } else if (error.message.includes('JSON')) {
                return {
                    success: false,
                    message: '❌ El servidor no está devolviendo datos correctos.'
                }
            } else {
                return {
                    success: false,
                    message: `Error: ${error.message}`
                }
            }
        }
    }

    const logout = () => {
        authService.logout()
        setCurrentUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('currentUser')
        localStorage.removeItem('token')
    }

    const value = {
        currentUser,
        isAuthenticated,
        loading,
        login,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
