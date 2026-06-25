import { Link, useNavigate } from "react-router-dom"
import { useCartContext } from "../../context/CartContext/useCartContext"
import { useAuthContext } from "../../context/AuthContext/useAuthContext"
import "./cart.css"

export const Cart = () => {
  const { cart, removeItem, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCartContext()
  const { isAuthenticated } = useAuthContext()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      navigate("/login?redirect=/checkout")
    } else {
      navigate("/checkout")
    }
  }

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <h1 className="cart-title">Mi Carrito</h1>
        <div className="cart-empty">
          <i className="fa-solid fa-cart-shopping"></i>
          <p>Tu carrito está vacío</p>
          <Link to="/productos" className="btn-link">Ver productos</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Mi Carrito</h1>

      <div className="cart-layout">
        {/* Lista de items */}
        <div className="cart-items">
          {cart.map(item => (
            <div key={`${item._id}-${item.selectedSize}`} className="cart-item">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="cart-item__img"
              />

              <div>
                <p className="cart-item__name">{item.name}</p>
                <p className="cart-item__size">Tamaño: {item.selectedSize}</p>
                <p className="cart-item__price">${item.price.toLocaleString()} c/u</p>
              </div>

              <div className="cart-item__controls">
                <div className="cart-item__quantity">
                  <button onClick={() => updateQuantity(item, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item, item.quantity + 1)}>+</button>
                </div>
                <p className="cart-item__subtotal">
                  ${(item.price * item.quantity).toLocaleString()}
                </p>
                <button
                  className="cart-item__remove"
                  onClick={() => removeItem(item)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="cart-summary">
          <h3>Resumen</h3>
          <div className="cart-summary__row">
            <span>Productos ({getTotalItems()})</span>
          </div>
          <div className="cart-summary__total">
            <span>Total</span>
            <span>${getTotalPrice().toLocaleString()}</span>
          </div>
          <button className="btn-checkout" onClick={handleCheckout}>
            Finalizar compra
          </button>
          <button className="btn-clear" onClick={clearCart}>
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  )
}