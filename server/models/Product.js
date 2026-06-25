import mongoose from 'mongoose';

const sizeVariantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    enum: ['Chica', 'Grande', 'Docena', 'Individual']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'El precio no puede ser negativo']
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true
  },
  sizes: {
    type: [sizeVariantSchema],
    required: [true, 'Debe tener al menos un tamaño'],
    validate: {
      validator: (arr) => arr.length > 0,
      message: 'El producto debe tener al menos un tamaño'
    }
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: [
      'Especiales',
      'Tartas y Tortas',
      'Pastelería Clásica',
      'Muffins y Cupcakes'
    ]
  },
  salesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  imageUrl: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

productSchema.index({ category: 1 });
productSchema.index({ 'sizes.size': 1 });
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;