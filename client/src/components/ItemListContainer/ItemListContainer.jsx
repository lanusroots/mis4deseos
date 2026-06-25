import { useEffect, useState } from "react"
import { ItemList } from "../ItemList/ItemList"
import { getProducts } from "../../services/products"
import "./ItemListContainer.css"

export const ItemListContainer = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (err) {
        console.log(err)
        setError("Hubo un problema al obtener los productos")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <p>Cargando productos...</p>
  if (error) return <p>{error}</p>

  return (
    <section>
      <h1>Nuestros productos</h1>
      <div className="product-grid">
        <ItemList list={products} />
      </div>
    </section>
  )
}
