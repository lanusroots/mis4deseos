import mongoose from 'mongoose'
import Order from '../models/Order.js'
import Product from '../models/Product.js'

/**
 * Recalcula los ítems y el total del pedido a partir de los PRODUCTOS REALES de la base.
 * Nunca confía en el precio ni en el total que manda el cliente.
 * Función pura (sin DB) para poder testearla de forma aislada.
 * Lanza Error con .clientError = true ante datos inválidos del cliente.
 */
export const buildVerifiedItems = (items, dbProducts) => {
  let total = 0

  const verifiedItems = items.map((i) => {
    const product = dbProducts.find((p) => String(p._id) === String(i.product))
    if (!product) {
      const err = new Error(`Producto no disponible: ${i.product}`)
      err.clientError = true
      throw err
    }

    const variant = product.sizes.find((s) => s.size === i.size)
    if (!variant) {
      const err = new Error(`Tamaño inválido para "${product.name}": ${i.size}`)
      err.clientError = true
      throw err
    }

    const quantity = Number(i.quantity)
    if (!Number.isInteger(quantity) || quantity < 1) {
      const err = new Error(`Cantidad inválida para "${product.name}"`)
      err.clientError = true
      throw err
    }

    total += variant.price * quantity

    return {
      product: product._id,
      name: product.name,
      size: variant.size,
      price: variant.price, // precio REAL tomado de la base
      quantity,
      imageUrl: product.imageUrl
    }
  })

  return { verifiedItems, total }
}

// @desc    Crear nuevo pedido
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    // 'total' y 'price' del cliente se IGNORAN: el server es la fuente de verdad
    const { items, name, phone, address, notes } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El pedido debe tener al menos un producto'
      })
    }

    if (!name || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, teléfono y dirección son requeridos'
      })
    }

    // Validar que todos los IDs tengan formato válido antes de consultar
    const ids = items.map((i) => i.product)
    if (ids.some((id) => !mongoose.isValidObjectId(id))) {
      return res.status(400).json({
        success: false,
        message: 'El pedido contiene un producto inválido'
      })
    }

    // Traer los productos reales (solo activos)
    const dbProducts = await Product.find({ _id: { $in: ids }, isActive: true })

    // Recalcular ítems y total desde la base
    let verifiedItems, total
    try {
      ({ verifiedItems, total } = buildVerifiedItems(items, dbProducts))
    } catch (err) {
      if (err.clientError) {
        return res.status(400).json({ success: false, message: err.message })
      }
      throw err
    }

    const order = await Order.create({
      user: req.user._id,
      items: verifiedItems,
      total,
      name,
      phone,
      address,
      notes: notes || ''
    })

    res.status(201).json({ success: true, data: order })
  } catch (error) {
    console.error('createOrder error:', error)
    res.status(500).json({ success: false, message: 'No se pudo crear el pedido' })
  }
}

// @desc    Obtener pedidos del usuario autenticado
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v')

    res.json({ success: true, count: orders.length, data: orders })
  } catch (error) {
    console.error('getMyOrders error:', error)
    res.status(500).json({ success: false, message: 'Error al obtener los pedidos' })
  }
}

// @desc    Obtener todos los pedidos
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .select('-__v')

    res.json({ success: true, count: orders.length, data: orders })
  } catch (error) {
    console.error('getAllOrders error:', error)
    res.status(500).json({ success: false, message: 'Error al obtener los pedidos' })
  }
}

// @desc    Actualizar estado de un pedido
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' })
    }

    order.status = status || order.status
    const updated = await order.save()

    res.json({ success: true, data: updated })
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' })
    }
    console.error('updateOrderStatus error:', error)
    res.status(500).json({ success: false, message: 'Error al actualizar el pedido' })
  }
}