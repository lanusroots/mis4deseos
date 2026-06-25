import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getSizesWithCount
} from '../controllers/productController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import { validateImage } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getProducts);
router.get('/categories/all', getCategories);
router.get('/sizes/all', getSizesWithCount);
router.get('/:id', getProductById);

// Rutas protegidas - solo Admin
router.post('/', protect, admin, validateImage, createProduct);
router.put('/:id', protect, admin, validateImage, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;