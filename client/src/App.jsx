import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./App.css"
import { Nav } from "./components/Nav/Nav"
import { ItemListContainer } from "./components/ItemListContainer/ItemListContainer"
import { ItemDetailContainer } from "./components/ItemDetailContainer/ItemDetailContainer"
import { CartProvider } from "./context/CartContext/CartProvider"
import { AuthProvider } from "./context/AuthContext/AuthProvider"
import { Footer } from "./components/Footer/Footer"
import { Nosotros } from "./pages/Nosotros/Nosotros"
import { Contacto } from "./pages/Contacto/Contacto"
import { Home } from "./pages/Home/Home"
import { Login } from "./pages/Login/Login"
import { Register } from "./pages/Register/Register"
import { Perfil } from "./pages/Perfil/Perfil"
import { Cart } from "./pages/Cart/Cart"
import { Admin } from "./pages/Admin/Admin"
import { Checkout } from "./pages/Checkout/Checkout"
import { ProtectedRoute } from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Nav />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detail/:id" element={<ItemDetailContainer />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/productos" element={<ItemListContainer />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />

              {/* Rutas protegidas */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <Admin />
                  </ProtectedRoute>
                }
              />

              <Route 
                path="/perfil" 
                element={
                  <ProtectedRoute>
                    <Perfil />
                  </ProtectedRoute>
                } 
              />
            
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute >
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<h2>Página no encontrada 😢</h2>} />
            </Routes>
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
