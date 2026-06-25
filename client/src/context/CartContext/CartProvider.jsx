import { useState, useEffect } from "react"
import { CartContext } from "./CartContext"

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Clave única: mismo producto en distinto tamaño = línea distinta
  const getKey = (item) => `${item._id}-${item.selectedSize}`

  const exists = (item) => cart.some(c => getKey(c) === getKey(item))

  const addItem = (product, quantity = 1) => {
    if (exists(product)) {
      setCart(cart.map(item =>
        getKey(item) === getKey(product)
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity }])
    }
  }

  const removeItem = (item) => {
    setCart(cart.filter(c => getKey(c) !== getKey(item)))
  }

  const updateQuantity = (item, quantity) => {
    if (quantity < 1) return
    setCart(cart.map(c =>
      getKey(c) === getKey(item) ? { ...c, quantity } : c
    ))
  }

  const clearCart = () => setCart([])

  const getTotalItems = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  }

  const values = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  }

  return (
    <CartContext.Provider value={values}>
      {children}
    </CartContext.Provider>
  )
}