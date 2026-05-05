import React, { createContext, useContext, useState, useEffect } from 'react'

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
            const normalizedLogin = username.trim().toLowerCase()
            const normalizedPassword = password.trim()

            // Llamada al backend real
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: normalizedLogin, contrasena: normalizedPassword })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                return { success: false, message: errorData.error || 'Credenciales incorrectas' }
            }

            const data = await response.json()
            
            // Adaptar el usuario del backend al formato que espera el frontend
            const roleMap = {
                'profesor': 'teacher',
                'estudiante': 'student',
                'representante': 'parent',
                'admin': 'admin'
            }
            
            const user = {
                ...data.usuario,
                id: data.usuario.id_usuario,
                name: data.persona ? `${data.persona.nombre} ${data.persona.apellido}` : data.usuario.email,
                role: roleMap[data.usuario.rol] || data.usuario.rol,
                grade_id: data.entidad?.id_grado || 1, // Fallback grade_id
                token: data.token,
                original_role: data.usuario.rol
            }

            setCurrentUser(user)
            setIsAuthenticated(true)
            localStorage.setItem('currentUser', JSON.stringify(user))
            localStorage.setItem('token', data.token)
            
            return { success: true, user }
        } catch (error) {
            console.error('Error en login:', error)

            // Mensajes de error más específicos
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                return {
                    success: false,
                    message: '❌ No se puede conectar al servidor backend. Asegúrate de que esté corriendo en el puerto 5000.'
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
