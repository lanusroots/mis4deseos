🍰 API REST - Pastelería
API completa para gestión de productos, usuarios y contacto del emprendimiento de pastelería.

📋 Características
✅ Autenticación JWT (Login/Register)
✅ CRUD completo de productos
✅ Sistema de roles (Admin/User)
✅ Filtrado por categorías
✅ Formulario de contacto
✅ Imágenes en Base64
✅ Validaciones
✅ Manejo de errores
🚀 Instalación
1. Clonar/crear carpeta backend
bash
mkdir backend
cd backend
2. Instalar dependencias
bash
npm install
3. Configurar variables de entorno
Crea un archivo .env en la raíz del proyecto:

env
PORT=5000
NODE_ENV=development
MONGODB_URI=tu_conexion_mongodb_atlas
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
4. Configurar MongoDB Atlas
Ve a MongoDB Atlas
Crea una cuenta gratuita
Crea un nuevo cluster
En "Database Access", crea un usuario
En "Network Access", agrega 0.0.0.0/0 (permitir todas las IPs)
Obtén tu connection string y reemplázalo en MONGODB_URI
5. Poblar base de datos (opcional)
bash
# Importar datos iniciales (productos + admin)
node seeder.js

# Eliminar todos los datos
node seeder.js -d
Credenciales Admin por defecto:

Email: admin@pasteleria.com
Password: admin123
6. Iniciar servidor
bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
El servidor correrá en: http://localhost:5000

📡 Endpoints de la API
🔐 Autenticación (/api/auth)
Registro de usuario
http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456",
  "role": "user"
}
Respuesta:

json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
Login
http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@pasteleria.com",
  "password": "admin123"
}
Obtener perfil
http
GET /api/auth/profile
Authorization: Bearer {token}
Actualizar perfil
http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Nuevo Nombre",
  "email": "nuevo@email.com",
  "password": "nueva_password"
}
🍰 Productos (/api/products)
Obtener todos los productos
http
GET /api/products
Query params:

category: Filtrar por categoría
search: Búsqueda por texto
Ejemplos:

http
GET /api/products?category=Tartas y Tortas
GET /api/products?search=chocolate
Obtener producto por ID
http
GET /api/products/:id
Obtener categorías
http
GET /api/products/categories/all
Crear producto (Admin)
http
POST /api/products
Authorization: Bearer {token_admin}
Content-Type: application/json

{
  "name": "Torta de Chocolate",
  "description": "Deliciosa torta de chocolate",
  "price": 45000,
  "category": "Tartas y Tortas",
  "imageUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
Actualizar producto (Admin)
http
PUT /api/products/:id
Authorization: Bearer {token_admin}
Content-Type: application/json

{
  "name": "Nombre actualizado",
  "price": 50000
}
Eliminar producto (Admin)
http
DELETE /api/products/:id
Authorization: Bearer {token_admin}
📧 Contacto (/api/contact)
Enviar mensaje
http
POST /api/contact
Content-Type: application/json

{
  "name": "María García",
  "email": "maria@example.com",
  "phone": "+54 11 1234-5678",
  "subject": "Consulta sobre tortas",
  "message": "Me gustaría consultar sobre..."
}
Obtener todos los mensajes (Admin)
http
GET /api/contact
Authorization: Bearer {token_admin}
Query params:

status: pending, read, replied
Obtener mensaje por ID (Admin)
http
GET /api/contact/:id
Authorization: Bearer {token_admin}
Actualizar estado (Admin)
http
PUT /api/contact/:id
Authorization: Bearer {token_admin}
Content-Type: application/json

{
  "status": "replied",
  "isRead": true
}
Eliminar mensaje (Admin)
http
DELETE /api/contact/:id
Authorization: Bearer {token_admin}
🔒 Autenticación con JWT
Para acceder a rutas protegidas, incluye el token en el header:

http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Roles:
user: Usuario normal (puede ver productos)
admin: Administrador (puede crear/editar/eliminar productos y ver mensajes)
📁 Estructura del proyecto
backend/
├── config/
│   └── db.js                 # Conexión MongoDB
├── controllers/
│   ├── authController.js     # Lógica de autenticación
│   ├── productController.js  # Lógica de productos
│   └── contactController.js  # Lógica de contacto
├── models/
│   ├── User.js              # Modelo de usuario
│   ├── Product.js           # Modelo de producto
│   └── Contact.js           # Modelo de contacto
├── routes/
│   ├── authRoutes.js        # Rutas de auth
│   ├── productRoutes.js     # Rutas de productos
│   └── contactRoutes.js     # Rutas de contacto
├── middlewares/
│   ├── authMiddleware.js    # Protección de rutas
│   └── uploadMiddleware.js  # Validación de imágenes
├── utils/
│   └── generateToken.js     # Generar JWT
├── .env                     # Variables de entorno
├── server.js               # Servidor principal
├── seeder.js              # Script para poblar DB
├── package.json
└── README.md
🖼️ Manejo de imágenes
Las imágenes se guardan como Base64 directamente en MongoDB.

Convertir imagen a Base64 (Frontend):

javascript
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Uso
const base64Image = await convertToBase64(imageFile);
🔄 Integración con Frontend
Ejemplo en React:
javascript
// Obtener productos
const fetchProducts = async () => {
  const res = await fetch('http://localhost:5000/api/products');
  const data = await res.json();
  setProducts(data.data);
};

// Login
const handleLogin = async (email, password) => {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  localStorage.setItem('token', data.data.token);
};

// Crear producto (con token)
const createProduct = async (productData) => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5000/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  return await res.json();
};
⚠️ Notas importantes
Cambiar credenciales: Modifica el usuario admin después del primer deploy
JWT_SECRET: Usa una clave segura y larga
MongoDB Atlas: Configura correctamente las IPs permitidas
CORS: Ajusta FRONTEND_URL según tu dominio en producción
Imágenes: El límite de Base64 es 5MB por imagen
🐛 Troubleshooting
Error: "Cannot connect to MongoDB"
Verifica tu MONGODB_URI en .env
Asegúrate de que tu IP esté permitida en MongoDB Atlas
Verifica que el usuario de DB tenga permisos
Error: "Token invalid"
Verifica que el token esté en el formato: Bearer {token}
El token puede haber expirado (por defecto 30 días)
Error: "Email already exists"
El email ya está registrado, usa otro
📞 Soporte
Para más información sobre el proyecto, consulta la documentación de:

Express
MongoDB
JWT
¡Listo para usar! 🎉

