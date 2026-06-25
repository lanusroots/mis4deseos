import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ItemDetail } from "../ItemDetail/ItemDetail"
import { getProductById, getProducts } from "../../services/products"

export const ItemDetailContainer = () => {
  const [product, setProduct]   = useState(null)
  const [related, setRelated]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState("")
  const { id } = useParams()

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await getProductById(id)
        const prod = res.data
        setProduct(prod)

        // Traer productos de la misma categoría, excluir el actual
        const relatedRes = await getProducts(prod.category, "")
        const filtered = relatedRes.data
          .filter(p => p._id !== prod._id)
          .slice(0, 8)
        setRelated(filtered)
      } catch (err) {
        setError("Producto no encontrado")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) return <p className="loading-text">Cargando...</p>
  if (error)   return <p className="loading-text">{error}</p>

  return <ItemDetail detail={product} related={related} />
}