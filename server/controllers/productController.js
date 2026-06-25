import Product from '../models/Product.js';

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, search, size, sort } = req.query;
    let query = { isActive: true };

    if (category && category !== 'Todos') {
      query.category = category;
    }

    // Filtrar por tamaño dentro del array sizes
    if (size) {
      const sizes = size.split(',');
      query['sizes.size'] = { $in: sizes };
    }

    if (search) {
      query.$text = { $search: search };
    }

    let products = await Product.find(query).select('-__v');

    // Ordenar — para precio usamos el menor precio del array sizes
    switch (sort) {
      case 'price-asc':
        products.sort((a, b) => {
          const minA = Math.min(...a.sizes.map(s => s.price));
          const minB = Math.min(...b.sizes.map(s => s.price));
          return minA - minB;
        });
        break;
      case 'price-desc':
        products.sort((a, b) => {
          const minA = Math.min(...a.sizes.map(s => s.price));
          const minB = Math.min(...b.sizes.map(s => s.price));
          return minB - minA;
        });
        break;
      case 'best-selling':
        products.sort((a, b) => b.salesCount - a.salesCount);
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Crear nuevo producto
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, description, sizes, category, imageUrl } = req.body;

    if (!name || !description || !category || !sizes || sizes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona todos los campos requeridos'
      });
    }

    const product = await Product.create({
      name,
      description,
      sizes,
      category,
      imageUrl: imageUrl || '',
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Actualizar producto
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, description, sizes, category, imageUrl, isActive } = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    product.name        = name        || product.name;
    product.description = description || product.description;
    product.category    = category    || product.category;
    product.imageUrl    = imageUrl    !== undefined ? imageUrl    : product.imageUrl;
    product.isActive    = isActive    !== undefined ? isActive    : product.isActive;
    if (sizes && sizes.length > 0) product.sizes = sizes;

    const updatedProduct = await product.save();
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Eliminar producto (soft delete)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    product.isActive = false;
    await product.save();

    res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtener todas las categorías
// @route   GET /api/products/categories/all
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtener todos los tamaños disponibles con su conteo
// @route   GET /api/products/sizes/all
// @access  Public
export const getSizesWithCount = async (req, res) => {
  try {
    const sizes = await Product.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$sizes' },
      { $group: { _id: '$sizes.size', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const data = sizes.map(s => ({ size: s._id, count: s.count }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};