import express from 'express'
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js'
import { protect, admin } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Rutas usuario autenticado
router.post('/', protect, createOrder)
router.get('/my-orders', protect, getMyOrders)

// Rutas admin
router.get('/', protect, admin, getAllOrders)
router.put('/:id', protect, admin, updateOrderStatus)

export default router