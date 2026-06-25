import { Link } from "react-router-dom"
import { useCartContext } from "../../context/CartContext/useCartContext"
import "./Cart.css"

export const Cart = () => {
  const { cart, clearCart, deleteItem, total, checkout } = useCartContext()

  return (
    <section className="cart-wrapper">

      <h2 className="cart-title">CARRITO DE COMPRAS</h2>

      {cart.length ? (
        <>
          {/* HEADERS */}
          <div className="cart-header">
            <span>PRODUCTO</span>
            <span>SUBTOTAL</span>
          </div>

          {/* ITEMS */}
          <div className="cart-items">
            {cart.map((prod) => (
              <div className="cart-item" key={prod.id}>
                
                <div className="cart-item-left">
                  <img src={prod.imageUrl} alt={prod.name} />

                  <div className="cart-item-info">
                    <h3>{prod.name}</h3>
                    <p className="cart-description">{prod.description}</p>

                    <span className="cart-qty-label">
                      Cantidad: {prod.quantity}
                    </span>
                  </div>
                </div>

                <div className="cart-item-right">
                  <span className="cart-subtotal">
                    ${ (prod.price * prod.quantity).toLocaleString("es-AR") }
                  </span>

                  <button
                    className="cart-delete"
                    onClick={() => deleteItem(prod.id)}
                  >
                    🗑
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="cart-footer">
            <p className="cart-total">
              Total: <strong>${total().toLocaleString("es-AR")}</strong>
            </p>

            <div className="cart-buttons">
              <button className="btn-empty" onClick={clearCart}>
                Vaciar carrito
              </button>

              <button className="btn-checkout" onClick={checkout}>
                Finalizar compra
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="cart-empty">
          <p>Tu carrito está vacío</p>
          <Link className="btn-back" to="/">Volver al inicio</Link>
        </div>
      )}
    </section>
  )
}
