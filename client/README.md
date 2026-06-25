# 🛒 mis4deseos --- E-commerce en React (Talento Tech 2025)

Proyecto final del curso **React JS --- Talento Tech 2025**,
desarrollado como una tienda online completamente funcional. La
aplicación permite navegar productos, ver detalles, gestionar un
carrito, autenticarse, y administrar productos desde un panel
protegido.\
Está construida con **React + Vite**, utiliza **Context API**,
almacenamiento externo en **MockAPI** e **ImgBB**, y está desplegada en
**Netlify**.

🔗 **Deploy:** https://mis4deseos.netlify.app/

------------------------------------------------------------------------

## 🚀 Tecnologías principales

-   **React 19 + Vite 7**
-   **React Router DOM 7.9**
-   **Context API** para Carrito y Autenticación
-   **MockAPI** → CRUD de productos
-   **ImgBB** → Subida de imágenes en panel admin
-   **Netlify** → Deploy de producción
-   **CSS Modularizado** → Estilos personalizados diseño "pastel
    minimalista"

------------------------------------------------------------------------

## 🧩 Funcionalidades principales

### 🛍️ Tienda

-   Listado de productos
-   Vista detallada
-   Selector de cantidad con controles minimalistas
-   Carrito global persistente

### 🔐 Autenticación

-   Login simulado mediante Context API
-   Rutas protegidas (por ejemplo: `/admin`)

### 🛠️ Panel Administrador

-   Crear, editar y eliminar productos (CRUD completo)
-   Subida de imágenes a ImgBB
-   Validación de datos antes de enviar

### 💬 Sección de Contacto

-   Formulario estilizado
-   Alert de confirmación ("Mensaje enviado, nos comunicaremos
    pronto!!")

### 📱 Diseño

-   Full Responsive\
-   Tema pastel verde minimalista\
-   Componentes reutilizables y layouts separados

------------------------------------------------------------------------

## 📦 Requisitos previos

Asegúrate de tener instalado:

-   **Node.js 18+**\
-   **npm 9+**

------------------------------------------------------------------------

## 🛠️ Instalación (local)

Clonar el repositorio:

``` bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

Instalar dependencias:

``` bash
npm install
```

------------------------------------------------------------------------

## ▶️ Ejecutar en modo desarrollo

``` bash
npm run dev
```

La app quedará disponible en:

    http://localhost:5173

------------------------------------------------------------------------

## 🏗️ Build para producción

``` bash
npm run build
```

Previsualizar build:

``` bash
npm run preview
```

------------------------------------------------------------------------

## 🌐 Variables externas utilizadas

### 🔹 MockAPI

Utilizado para: - Obtener productos - Crear/editar/eliminar productos -
Guardar datos del CRUD admin

### 🔹 ImgBB

Utilizado para: - Subida de imágenes desde panel administrador - Retorno
de URL pública para MockAPI

No es necesario definir variables `.env` ya que las claves están
incrustadas en los servicios del proyecto.

------------------------------------------------------------------------

## 🚀 Deploy en Netlify

El proyecto ya está preparado para Netlify:

-   `build` → `npm run build`
-   `publish` → `dist/`
-   Incluye archivo: **`netlify.toml`**\
    Necesario para manejar rutas SPA y evitar errores 404 al refrescar:

``` toml
[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

------------------------------------------------------------------------

## 📂 Estructura del proyecto

    src/
    ├── assets/
    ├── components/
    │   ├── adminComponents/
    │   ├── Cart/
    │   ├── Count/
    │   ├── Footer/
    │   ├── Home/
    │   ├── Item/
    │   ├── ItemDetail/
    │   ├── ItemDetailContainer/
    │   ├── ItemList/
    │   ├── ItemListContainer/
    │   ├── Login/
    │   ├── Nav/
    │   └── RutaProtegida/
    ├── context/
    │   ├── AuthContext/
    │   └── CartContext/
    ├── layouts/
    ├── pages/
    ├── services/
    ├── utils/
    ├── App.css
    ├── App.jsx
    ├── global.css
    └── main.jsx

------------------------------------------------------------------------

## 🧑‍💻 Autor

Proyecto desarrollado por **Max Fernández**\
Para el curso **React JS --- Talento Tech 2025**

------------------------------------------------------------------------

## 📜 Licencia

Este proyecto es de uso educativo. Libre de utilizar para referencia o
aprendizaje.
