import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "./AuthContext"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error al cargar usuario:", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  // Logout automático cuando la API responde 401 (token vencido/inválido)
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      if (window.location.pathname !== "/login") {
        navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      }
    }
    window.addEventListener("auth:unauthorized", handleUnauthorized)
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized)
  }, [navigate])

  // Login: guardar usuario y token
  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", userData.token)
  }

  // Logout: limpiar usuario y token
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!user && !!user.token
  }

  // Verificar si el usuario es admin
  const isAdmin = () => {
    return user && user.role === "admin"
  }

  // Obtener token
  const getToken = () => {
    return user?.token || localStorage.getItem("token")
  }

  const values = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    getToken,
  }

  return (
    <AuthContext.Provider value={values}>
      {!loading && children}
    </AuthContext.Provider>
  )
}