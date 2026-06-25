import { Link, NavLink, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useCartContext } from "../../context/CartContext/useCartContext"
import { useAuthContext } from "../../context/AuthContext/useAuthContext"
import "./Nav.css"

export const Nav = () => {
  const { getTotalItems } = useCartContext()
  const { user, isAuthenticated, logout } = useAuthContext()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Cerrar drawer al navegar
  const closeDrawer = () => setDrawerOpen(false)

  // Bloquear scroll del body cuando el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [drawerOpen])

  const handleLogout = () => {
    logout()
    closeDrawer()
    navigate("/")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmed = searchValue.trim()
    if (!trimmed) {
      navigate("/productos")
    } else {
      navigate(`/productos?search=${encodeURIComponent(trimmed)}`)
    }
    setSearchValue("")
    closeDrawer()
  }

  return (
    <>
      <header className="nav">
        {/* Logo */}
        <Link to="/" className="nav__logo" onClick={closeDrawer}>
          <img src="/data/logo_mis4deseos.svg" alt="Logo de Mis 4 Deseos" />
          <p className="nav__brand">mis4deseos</p>
        </Link>

        {/* Centro — desktop */}
        <div className="nav__center">
          <ul className="nav__menu">
            <li><NavLink to="/" end>INICIO</NavLink></li>
            <li><NavLink to="/nosotros">NOSOTROS</NavLink></li>
            <li><NavLink to="/productos">PRODUCTOS</NavLink></li>
            <li><NavLink to="/contacto">CONTACTO</NavLink></li>
          </ul>

          <form onSubmit={handleSearch} className="nav__search-form">
            <input
              type="text"
              placeholder="Buscar..."
              className="nav__search"
              aria-label="Buscar productos"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </form>
        </div>

        {/* Acciones — desktop */}
        <div className="nav__actions">
          {isAuthenticated() ? (
            <div className="nav__user">
              <Link
                to={user.role === "admin" ? "/admin" : "/perfil"}
                className="nav__user-name"
              >
                <i className="fa-solid fa-user"></i>
                {user.name}
                {user.role === "admin" && (
                  <span className="nav__admin-badge">Admin</span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="nav__logout"
                aria-label="Cerrar sesión"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          ) : (
            <div className="nav__auth">
              <Link to="/login" className="nav__login" aria-label="Iniciar sesión">
                <i className="fa-solid fa-user"></i>
              </Link>
              <Link to="/register" className="nav__register">Registrarse</Link>
            </div>
          )}

          <Link to="/cart" className="nav__cart" aria-label="Ver carrito">
            <i className="fa-solid fa-cart-shopping"></i>
            {getTotalItems() > 0 && (
              <span className="nav__cart-count">{getTotalItems()}</span>
            )}
          </Link>
        </div>

        {/* Botones mobile — hamburguesa + carrito */}
        <div className="nav__mobile-actions">
          <Link to="/cart" className="nav__cart" aria-label="Ver carrito">
            <i className="fa-solid fa-cart-shopping"></i>
            {getTotalItems() > 0 && (
              <span className="nav__cart-count">{getTotalItems()}</span>
            )}
          </Link>

          <button
            className="nav__hamburger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menú"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </header>

      {/* Overlay */}
      {drawerOpen && (
        <div className="nav__overlay" onClick={closeDrawer} />
      )}

      {/* Drawer */}
      <div className={`nav__drawer ${drawerOpen ? "open" : ""}`}>
        <div className="nav__drawer-header">
          <Link to="/" className="nav__logo" onClick={closeDrawer}>
            <img src="/data/logo_mis4deseos.svg" alt="Logo" />
            <p className="nav__brand">mis4deseos</p>
          </Link>
          <button
            className="nav__drawer-close"
            onClick={closeDrawer}
            aria-label="Cerrar menú"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Buscador en drawer */}
        <div className="nav__drawer-search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar productos..."
              className="nav__search"
              aria-label="Buscar productos"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </form>
        </div>

        {/* Links de navegación */}
        <nav className="nav__drawer-menu">
          <NavLink to="/" end onClick={closeDrawer}>
            <i className="fa-solid fa-house"></i> Inicio
          </NavLink>
          <NavLink to="/nosotros" onClick={closeDrawer}>
            <i className="fa-solid fa-heart"></i> Nosotros
          </NavLink>
          <NavLink to="/productos" onClick={closeDrawer}>
            <i className="fa-solid fa-cake-candles"></i> Productos
          </NavLink>
          <NavLink to="/contacto" onClick={closeDrawer}>
            <i className="fa-solid fa-envelope"></i> Contacto
          </NavLink>
        </nav>

        {/* Auth en drawer */}
        <div className="nav__drawer-auth">
          {isAuthenticated() ? (
            <>
              <Link
                to={user.role === "admin" ? "/admin" : "/perfil"}
                className="nav__drawer-profile"
                onClick={closeDrawer}
              >
                <i className="fa-solid fa-user"></i>
                <span>{user.name}</span>
                {user.role === "admin" && (
                  <span className="nav__admin-badge">Admin</span>
                )}
              </Link>
              <button
                className="nav__drawer-logout"
                onClick={handleLogout}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav__drawer-login" onClick={closeDrawer}>
                <i className="fa-solid fa-user"></i> Iniciar sesión
              </Link>
              <Link to="/register" className="nav__drawer-register" onClick={closeDrawer}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}