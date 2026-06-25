import express from 'express';
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact
} from '../controllers/contactController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta pública
router.post('/', createContact);

// Rutas protegidas - solo Admin
router.get('/', protect, admin, getAllContacts);
router.route('/:id')
  .get(protect, admin, getContactById)
  .put(protect, admin, updateContact)
  .delete(protect, admin, deleteContact);

export default router;
