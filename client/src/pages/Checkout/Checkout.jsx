import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCartContext } from "../../context/CartContext/useCartContext"
import { useAuthContext } from "../../context/AuthContext/useAuthContext"
import { createOrder } from "../../services/orders"
import "./checkout.css"

export const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCartContext()
  const { isAuthenticated } = useAuthContext()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [orderPlaced, setOrderPlaced] = useState(false)

  // Si el carrito está vacío redirigir
  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-container">
        <h1 className="checkout-title">Finalizar Compra</h1>
        <div className="checkout-success">
          <i className="fa-solid fa-cart-shopping"></i>
          <h2>Tu carrito está vacío</h2>
          <p>Agregá productos antes de continuar</p>
          <div className="checkout-success__actions">
            <Link to="/productos" className="btn-outline">Ver productos</Link>
          </div>
        </div>
      </div>
    )
  }

  // Pantalla de confirmación tras el pedido exitoso
  if (orderPlaced) {
    return (
      <div className="checkout-container">
        <div className="checkout-success">
          <i className="fa-solid fa-circle-check"></i>
          <h2>¡Pedido confirmado!</h2>
          <p>Tu pedido fue recibido correctamente. Te contactaremos pronto para coordinar la entrega.</p>
          <div className="checkout-success__actions">
            <Link to="/productos" className="btn-outline">Seguir comprando</Link>
            <Link to="/perfil" className="btn-outline">Ver mis pedidos</Link>
          </div>
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!isAuthenticated()) {
      navigate("/login")
      return
    }

    setLoading(true)

    try {
      await createOrder({
        items: cart.map(item => ({
          product: item._id,
          size: item.selectedSize,
          quantity: item.quantity,
        })),
        ...formData,
      })

      clearCart()
      setOrderPlaced(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Finalizar Compra</h1>

      {error && <div className="error-message" style={{ marginBottom: "1rem" }}>{error}</div>}

      <div className="checkout-layout">

        {/* Formulario de entrega */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Datos de entrega</h3>

          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="María Pérez"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="1123445567"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Dirección de entrega</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Av. Corrientes 1234, CABA"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Notas adicionales (opcional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Ej: sin maní, piso 3, timbre roto..."
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-place-order" disabled={loading}>
            {loading ? "Procesando..." : "Confirmar pedido"}
          </button>
        </form>

        {/* Resumen del pedido */}
        <div className="checkout-summary">
          <h3>Resumen</h3>

          <div className="checkout-summary__items">
            {cart.map(item => (
              <div key={item._id} className="checkout-summary__item">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="checkout-summary__total">
            <span>Total</span>
            <span>${getTotalPrice().toLocaleString()}</span>
          </div>
        </div>

      </div>
    </div>
  )
}