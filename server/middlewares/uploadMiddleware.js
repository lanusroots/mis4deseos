// Valida que, si viene una imageUrl, sea una URL http/https válida.
// Las imágenes se suben a Cloudinary desde el cliente; acá solo se persiste la URL.
export const validateImage = (req, res, next) => {
  const { imageUrl } = req.body;

  // La imagen es opcional
  if (!imageUrl) {
    return next();
  }

  try {
    const url = new URL(imageUrl);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return next();
    }
  } catch {
    // URL malformada → cae al error de abajo
  }

  return res.status(400).json({
    success: false,
    message: 'La imagen debe ser una URL válida (http/https)'
  });
};