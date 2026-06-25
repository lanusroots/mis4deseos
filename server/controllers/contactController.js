import Contact from '../models/Contact.js';

// @desc    Crear nueva consulta de contacto
// @route   POST /api/contact
// @access  Public
export const createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validar campos requeridos
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona todos los campos requeridos'
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Mensaje enviado correctamente. Te contactaremos pronto.',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener todas las consultas
// @route   GET /api/contact
// @access  Private/Admin
export const getAllContacts = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtener consulta por ID
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Consulta no encontrada'
      });
    }

    // Marcar como leído
    if (!contact.isRead) {
      contact.isRead = true;
      await contact.save();
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Consulta no encontrada'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Actualizar estado de consulta
// @route   PUT /api/contact/:id
// @access  Private/Admin
export const updateContact = async (req, res) => {
  try {
    const { status, isRead } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Consulta no encontrada'
      });
    }

    contact.status = status || contact.status;
    contact.isRead = isRead !== undefined ? isRead : contact.isRead;

    const updatedContact = await contact.save();

    res.json({
      success: true,
      data: updatedContact
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Consulta no encontrada'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Eliminar consulta
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Consulta no encontrada'
      });
    }

    await contact.deleteOne();

    res.json({
      success: true,
      message: 'Consulta eliminada correctamente'
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Consulta no encontrada'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
