# 🛒 mis4deseos — E-commerce Full-Stack

Aplicación de e-commerce **full-stack** con frontend en React + Vite y backend propio en Node/Express + MongoDB. Permite navegar y filtrar productos, gestionar un carrito, registrarse e iniciar sesión con JWT, realizar un checkout y administrar el catálogo desde un panel protegido.

> **Origen del proyecto:** nació como el trabajo final del curso **React JS — Talento Tech 2025** ([repo original](https://github.com/lanusroots/test_ecommerce_tt_2025)), donde era un frontend que consumía MockAPI e ImgBB. A partir de esa base evolucionó hasta convertirse en una plataforma full-stack con backend, autenticación real y almacenamiento de imágenes en Cloudinary.

🔗 **Demo frontend:** https://mis4deseos.netlify.app/
🔗 **API (producción):** https://mis4deseos-api.onrender.com

---

## 🚀 Stack

**Frontend (`client/`)**
- React 19 + Vite 7
- React Router DOM 7
- Context API (Carrito y Autenticación)
- CSS modular — diseño "pastel verde minimalista"

**Backend (`server/`)**
- Node.js + Express (arquitectura MVC)
- MongoDB Atlas + Mongoose
- Autenticación con JWT
- Imágenes en Cloudinary (subida *unsigned* desde el panel admin en el cliente; el backend solo persiste la URL)

---

## 🧩 Funcionalidades

- **Tienda:** listado de productos, vista detallada, filtros/búsqueda, selector de cantidad.
- **Carrito:** estado global persistente.
- **Autenticación:** registro, login y perfil de usuario con JWT; rutas protegidas.
- **Checkout:** generación de pedidos.
- **Panel administrador:** CRUD completo de productos con subida de imágenes a Cloudinary.
- **Contacto:** formulario con persistencia en backend.
- **Responsive:** diseño adaptable a mobile y desktop.

---

## 🔐 Seguridad

- **Contraseñas** hasheadas con bcrypt (nunca se devuelven en las respuestas).
- **JWT** para autenticación; las rutas privadas se protegen en el servidor con middleware `protect` / `admin`.
- **Rol forzado en el registro público:** sólo se crean usuarios normales; los admins se generan por seeder o por un flujo protegido.
- **Total y precios del pedido recalculados en el servidor** a partir de la base — nunca se confía en los montos que envía el cliente.
- **Helmet** para cabeceras HTTP seguras.
- **Rate limiting** en `/api/auth` (anti fuerza bruta sobre login/registro).
- **Sanitización** de entradas contra inyección de operadores de Mongo.
- **Logout automático** ante un `401` (token vencido/inválido) en el cliente.

---

## 📂 Estructura del monorepo

```
mis4deseos/
├── client/                 # Frontend React + Vite
│   ├── public/
│   └── src/
│       ├── components/     # Carousel, Nav, Footer, Item, ItemList, etc.
│       ├── context/        # AuthContext y CartContext
│       ├── pages/          # Home, Admin, Cart, Checkout, Contacto, Login, Register, Perfil, Nosotros
│       └── services/       # api, auth, products, orders, contact
│
└── server/                 # Backend Express + MongoDB
    ├── config/             # conexión a DB
    ├── controllers/        # auth, product, order, contact
    ├── middlewares/        # auth (JWT), seguridad y validación de imagen
    ├── models/             # User, Product, Order, Contact
    ├── routes/
    ├── utils/              # generación de tokens
    └── seeder.js           # carga de datos de prueba
```

---

## 📦 Requisitos previos

- **Node.js 18+**
- **pnpm 9+**
- Cuenta de **MongoDB Atlas**
- Cuenta de **Cloudinary**

---

## 🛠️ Instalación y ejecución (local)

```bash
# 1. Clonar el repo
git clone https://github.com/TU-USUARIO/mis4deseos.git
cd mis4deseos

# 2. Instalar dependencias de todos los workspaces
pnpm install

# 3. Configurar variables de entorno
cp server/.env.example server/.env
cp client/.env.example client/.env
# completar los valores reales en cada .env

# 4. (Opcional) cargar datos de prueba en la base
pnpm seed

# 5. Levantar frontend y backend juntos
pnpm dev
```

Por defecto:
- Frontend → http://localhost:5173
- API → http://localhost:5000

---

## ⚙️ Scripts disponibles (raíz)

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Levanta API y frontend en paralelo |
| `pnpm dev:api` | Solo el backend |
| `pnpm dev:web` | Solo el frontend |
| `pnpm build` | Build de producción del frontend |
| `pnpm seed` | Carga datos de prueba en la base |

---

## 🔐 Variables de entorno

Cada paquete tiene su propio `.env`. Los archivos `.env.example` documentan qué variables hacen falta **sin exponer valores**. Los `.env` reales nunca se commitean (están en `.gitignore`).

- **`server/.env`** → puerto, URI de MongoDB, secret y expiración de JWT, URL del frontend para CORS, credenciales de Cloudinary.
- **`client/.env`** → URL base de la API y credenciales públicas de Cloudinary (cloud name + upload preset *unsigned*).

---

## 🌐 Deploy

- **Frontend:** Netlify (`build` → `client/dist`). Incluir `netlify.toml` con redirect SPA para evitar 404 al refrescar.
- **Backend:** Render o Railway (servicio Node). Configurar las variables de entorno en el panel del proveedor; **no** subir el `.env`.

---

## 🧭 Decisiones técnicas

- **Token en `localStorage`:** se eligió por simplicidad. Es un tradeoff conocido (queda accesible a JavaScript, expuesto a XSS). La alternativa más segura sería una cookie `httpOnly`, que implica manejar CSRF; se documenta como decisión consciente acorde al alcance del proyecto.
- **Subida de imágenes *unsigned* a Cloudinary desde el cliente:** evita exponer el API secret en el backend para este caso de uso; el preset debe estar restringido.

---

## 🚧 Mejoras futuras

- Centralizar el manejo de errores del backend con un `asyncHandler` (evitar `try/catch` repetidos).
- Memoizar los Context Providers (`useMemo` / `useCallback`) para reducir re-renders.
- Validación de inputs declarativa (p. ej. `express-validator` / Zod).
- Mover el ordenamiento de productos a la consulta de MongoDB.
- Mensajes genéricos en todos los `500` de autenticación (no exponer `error.message`).

---

## 🧑‍💻 Autor

Desarrollado por **Max Fernández**.
Base inicial creada para el curso **React JS — Talento Tech 2025**, luego ampliada a full-stack.

## 📜 Licencia

Proyecto de uso educativo. Libre para referencia y aprendizaje.
