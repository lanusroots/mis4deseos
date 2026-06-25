import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../../context/AuthContext/useAuthContext"
import { updateProfile } from "../../services/auth"
import { getMyOrders } from "../../services/orders"
import "./Perfil.css"

export const Perfil = () => {
  const { user, login, logout } = useAuthContext()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState("datos")
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  const showSuccess = (msg) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const fetchOrders = async () => {
    if (orders.length > 0) return
    setLoadingOrders(true)
    try {
      const res = await getMyOrders()
      setOrders(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingOrders(false)
    }
  }

  const translateStatus = (status) => {
    const map = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      preparing: "En preparación",
      delivered: "Entregado",
      cancelled: "Cancelado",
    }
    return map[status] || status
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await updateProfile({ name: formData.name, email: formData.email })
      login(res.data)
      showSuccess("Perfil actualizado correctamente")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setError("")
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setError("Por favor completa todos los campos")
      return
    }
    if (passwordData.newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    setLoading(true)
    try {
      const res = await updateProfile({ password: passwordData.newPassword })
      login(res.data)
      setPasswordData({ newPassword: "", confirmPassword: "" })
      showSuccess("Contraseña cambiada correctamente")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
    )
    if (confirmed) {
      logout()
      navigate("/")
    }
  }

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-header">
          <div className="perfil-avatar">
            <i className="fa-solid fa-user"></i>
          </div>
          <div className="perfil-info">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            {user?.role === "admin" && (
              <span className="perfil-badge">Administrador</span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="perfil-tabs">
          <button
            className={`tab-btn ${activeTab === "datos" ? "active" : ""}`}
            onClick={() => { setActiveTab("datos"); setError(""); setSuccess("") }}
          >
            <i className="fa-solid fa-user-pen"></i> Datos Personales
          </button>
          <button
            className={`tab-btn ${activeTab === "password" ? "active" : ""}`}
            onClick={() => { setActiveTab("password"); setError(""); setSuccess("") }}
          >
            <i className="fa-solid fa-lock"></i> Cambiar Contraseña
          </button>
          <button
            className={`tab-btn ${activeTab === "pedidos" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("pedidos")
              setError("")
              setSuccess("")
              fetchOrders()
            }}
          >
            <i className="fa-solid fa-box"></i> Mis Pedidos
          </button>
        </div>

        {/* Mensajes */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="perfil-content">

          {/* Tab Datos Personales */}
          {activeTab === "datos" && (
            <form onSubmit={handleUpdateProfile} className="perfil-form">
              <h3>Información Personal</h3>
              <div className="form-group">
                <label htmlFor="name">Nombre Completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <input
                  type="text"
                  value={user?.role === "admin" ? "Administrador" : "Usuario"}
                  disabled
                  className="disabled-input"
                />
              </div>
              <div className="form-group">
                <label>Miembro desde</label>
                <input
                  type="text"
                  value={new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                  disabled
                  className="disabled-input"
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </form>
          )}

          {/* Tab Cambiar Contraseña */}
          {activeTab === "password" && (
            <form onSubmit={handleChangePassword} className="perfil-form">
              <h3>Cambiar Contraseña</h3>
              <div className="form-group">
                <label htmlFor="newPassword">Nueva Contraseña</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Repite la nueva contraseña"
                  disabled={loading}
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Cambiando..." : "Cambiar Contraseña"}
              </button>
              <div className="password-tips">
                <h4>Tips de seguridad:</h4>
                <ul>
                  <li>Usa al menos 6 caracteres</li>
                  <li>Combina letras, números y símbolos</li>
                  <li>No uses información personal obvia</li>
                </ul>
              </div>
            </form>
          )}

          {/* Tab Pedidos */}
          {activeTab === "pedidos" && (
            <div className="pedidos-section">
              <h3>Historial de Pedidos</h3>

              {loadingOrders ? (
                <p>Cargando pedidos...</p>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <i className="fa-solid fa-box-open"></i>
                  <p>Aún no has realizado ningún pedido</p>
                  <button className="btn-outline" onClick={() => navigate("/productos")}>
                    Ver Productos
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <div>
                          <h4>Pedido #{order._id.slice(-6).toUpperCase()}</h4>
                          <p className="order-date">
                            {new Date(order.createdAt).toLocaleDateString("es-ES", {
                              year: "numeric", month: "long", day: "numeric"
                            })}
                          </p>
                        </div>
                        <span className={`order-status status-${order.status}`}>
                          {translateStatus(order.status)}
                        </span>
                      </div>
                      <div className="order-details">
                        <p><strong>{order.items.length}</strong> productos</p>
                        <p className="order-total">
                          Total: <strong>${order.total.toLocaleString()}</strong>
                        </p>
                      </div>
                      <div className="order-items-list">
                        {order.items.map((item, i) => (
                          <span key={i} className="order-item-tag">
                            {item.name} x{item.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zona peligrosa */}
        {activeTab === "datos" && (
          <div className="danger-zone">
            <h4>Zona de Peligro</h4>
            <p>Una vez que elimines tu cuenta, no hay vuelta atrás.</p>
            <button className="btn-danger" onClick={handleDeleteAccount}>
              Eliminar Cuenta
            </button>
          </div>
        )}
      </div>
    </div>
  )
}