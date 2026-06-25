import { NavLink } from "react-router-dom";
import { useCartContext } from "../../context/CartContext/useCartContext";
import "./Nav.css";

export const Nav = () => {
  const { getTotalItems } = useCartContext();

  return (
    <nav>
      <div className="nav-wrapper">

        {/* LOGO */}
        <NavLink to="/" className="nav-logo">
          <img src="/data/logo_mis4deseos.svg" alt="logo_mis4deseos" />
        </NavLink>

        <ul>
          <li><NavLink to="/" className="nav-link">INICIO</NavLink></li>
          <li><NavLink to="/nosotros" className="nav-link">NOSOTROS</NavLink></li>
          <li><NavLink to="/productos" className="nav-link">PRODUCTOS</NavLink></li>
          <li><NavLink to="/contacto" className="nav-link">CONTACTO</NavLink></li>
          <li>
            <NavLink to="/carrito" className="nav-link">
              CARRITO
              {getTotalItems() > 0 && (
                <span className="in-cart">{getTotalItems()}</span>
              )}
            </NavLink>
          </li>
        </ul>

      </div>
    </nav>
  );
};
