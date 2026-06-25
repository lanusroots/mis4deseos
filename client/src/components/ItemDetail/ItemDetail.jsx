import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./ItemDetail.css";
import { useCartContext } from "../../context/CartContext/useCartContext";

export const ItemDetail = ({ detail, related = [] }) => {
  const { name, description, sizes, imageUrl, category } = detail;
  const { addItem } = useCartContext();

  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const carouselRef = useRef(null);

  const totalPrice = selectedSize.price * quantity;
  
  const handleAddToCart = () => {
    addItem({ ...detail, selectedSize: selectedSize.size, price: selectedSize.price }, quantity);
  };

  const decrease = () => setQuantity(q => Math.max(1, q - 1));
  const increase = () => setQuantity(q => q + 1);

  const handleSizeChange = (variant) => {
    setSelectedSize(variant);
    setQuantity(1);
  };

  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
    }
  };

  return (
    <section className="detail-container">
      <div className="detail-card">

        {/* Imagen */}
        <div className="detail-image">
          <img src={imageUrl} alt={name} />
        </div>

        {/* Info */}
        <div className="detail-info">
          <p className="detail-category">{category}</p>
          <h2 className="detail-name">{name}</h2>
          <p className="detail-price">${totalPrice.toLocaleString("es-AR")}</p>
          <p className="detail-description">{description}</p>
          {selectedSize.size === "Docena" && (
            <p className="detail-unit-note">
              <i className="fa-solid fa-circle-info" aria-hidden="true" /> Este producto se vende por docena.
          </p>
          )}

          {/* Selector de tamaño */}
          {sizes.length > 1 && (
            <div className="detail-sizes">
              <p className="detail-sizes-label">
                Tamaño: <span>{selectedSize.size}</span>
                {selectedSize.size === "Chica" && <span> (6 porciones)</span>}
                {selectedSize.size === "Grande" && <span> (10 porciones)</span>}
              </p>
              <div className="detail-sizes-options">
                {sizes.map((variant) => (
                  <button
                    key={variant.size}
                    className={`size-btn ${selectedSize.size === variant.size ? "active" : ""}`}
                    onClick={() => handleSizeChange(variant)}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cantidad + Agregar */}
          <div className="detail-actions">
            <div className="quantity-selector">
              <button className="quantity-btn" onClick={decrease} aria-label="Disminuir">−</button>
              <span className="quantity-value">{quantity}</span>
              <button className="quantity-btn" onClick={increase} aria-label="Aumentar">+</button>
            </div>
            <button className="detail-btn" onClick={handleAddToCart}>
              Agregar al carrito
            </button>
          </div>

          {/* Filas de confianza */}
          <div className="detail-trust">
            <div className="trust-row">
              <i className="fa-solid fa-shield trust-icon" aria-hidden="true" />
              <div>
                <p className="trust-title">Compra protegida</p>
                <p className="trust-text">Tus datos cuidados durante toda la compra.</p>
              </div>
            </div>
            <div className="trust-row">
              <i className="fa-solid fa-clock trust-icon" aria-hidden="true" />
              <div>
                <p className="trust-title">Trabajamos a pedido</p>
                <p className="trust-text">Recordá que necesitamos 48hs para prepararlo.</p>
              </div>
            </div>
          </div>

          <Link to="/productos" className="detail-back">← Volver a productos</Link>
        </div>

      </div>

      {/* ── Productos similares ── */}
      {related.length > 0 && (
        <div className="related-section">
          <h3 className="related-title">Productos similares</h3>
          <div className="related-carousel-wrapper">
            <button
              className="carousel-arrow carousel-arrow--left"
              onClick={() => scrollCarousel(-1)}
              aria-label="Anterior"
            >
              <i className="fa-solid fa-chevron-left" aria-hidden="true" />
            </button>

            <div className="related-carousel" ref={carouselRef}>
              {related.map(prod => {
                const minPrice = Math.min(...prod.sizes.map(s => s.price));
                return (
                  <Link
                    key={prod._id}
                    to={`/detail/${prod._id}`}
                    className="related-card"
                  >
                    <div className="related-img-wrapper">
                      <img src={prod.imageUrl} alt={prod.name} className="related-img" />
                    </div>
                    <p className="related-name">{prod.name}</p>
                    <p className="related-price">${minPrice.toLocaleString("es-AR")}</p>
                  </Link>
                );
              })}
            </div>

            <button
              className="carousel-arrow carousel-arrow--right"
              onClick={() => scrollCarousel(1)}
              aria-label="Siguiente"
            >
              <i className="fa-solid fa-chevron-right" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

    </section>
  );
};