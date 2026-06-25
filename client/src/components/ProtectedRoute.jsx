import { Navigate } from "react-router-dom"
import { useAuthContext } from "../context/AuthContext/useAuthContext"

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuthContext()

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  // Si la ruta requiere admin y no lo es, redirigir
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/productos" replace />
  }

  return children
}
