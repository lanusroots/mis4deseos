import { useState } from "react"
import "./Count.css"

export const Count = ({ btnText, onConfirm }) => {
  const [count, setCount] = useState(0)

  const increment = () => setCount(prev => prev + 1)

  const decrement = () =>
    setCount(prev => (prev > 0 ? prev - 1 : 0))

  const confirm = () => {
    if (count > 0) onConfirm(count)
  }

  return (
    <div className="count-container">
      
      {/* Bloque de botones */}
      <div className="count-box">
        <button
          className="count-btn"
          disabled={count === 0}
          onClick={decrement}
        >
          -
        </button>

        <span className="count-value">{count}</span>

        <button className="count-btn" onClick={increment}>
          +
        </button>
      </div>

      {/* Botón agregar al carrito */}
      <button
        className="add-cart-btn"
        disabled={count === 0}
        onClick={confirm}
      >
        {btnText}
      </button>
    </div>
  )
}
