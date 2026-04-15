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
            const normalizedUsername = username.trim()
            const normalizedPassword = password.trim()
            const normalizedLogin = normalizedUsername.toLowerCase()
            const encodedLogin = encodeURIComponent(normalizedLogin)

            // Llamada a json-server buscando el usuario por username o por email
            let response = await fetch(`http://localhost:3001/users?username=${encodedLogin}`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            let users = await response.json()
            if (users.length === 0) {
                response = await fetch(`http://localhost:3001/users?email=${encodedLogin}`)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                users = await response.json()
            }

            const user = users.find((u) => u.password === normalizedPassword)

            if (user) {
                setCurrentUser(user)
                setIsAuthenticated(true)
                localStorage.setItem('currentUser', JSON.stringify(user))
                return { success: true, user }
            } else {
                return { success: false, message: 'Credenciales incorrectas' }
            }
        } catch (error) {
            console.error('Error en login:', error)

            // Mensajes de error más específicos
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                return {
                    success: false,
                    message: '❌ No se puede conectar al servidor. Asegúrate de ejecutar: npm run server'
                }
            } else if (error.message.includes('JSON')) {
                return {
                    success: false,
                    message: '❌ El servidor no está devolviendo datos correctos. Ejecuta: npm run server'
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
