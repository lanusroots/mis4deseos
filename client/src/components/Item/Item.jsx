import { Link } from "react-router-dom";
import "./item.css";

export const Item = ({ _id, name, sizes, imageUrl }) => {
  const price = Math.min(...sizes.map(s => s.price));

  return (
    <article className="product-card">
      <Link to={`/detail/${_id}`} className="product-link">
        <div className="product-img-wrapper">
          <img src={imageUrl} alt={name} className="product-img" />
        </div>
        <div className="product-body">
          <p className="product-name">{name}</p>
          <p className="product-price">${price.toLocaleString("es-AR")}</p>
        </div>
      </Link>
    </article>
  );
};