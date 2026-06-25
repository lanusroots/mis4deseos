import { Count } from "../Count/Count";
import { useCartContext } from "../../context/CartContext/useCartContext"
import "./ItemDetail.css";

export const ItemDetail = ({ detail }) => {
    const { addItem } = useCartContext();

    const handleAdd = (quantity) => {
    addItem({ ...detail, quantity });
    };
  return (
    <div className="product-detail">

      {/* COLUMNA IZQUIERDA – IMAGEN */}
      <div className="product-detail__image-wrapper">
        <img
          src={detail.imageUrl}
          alt={detail.name}
          className="product-detail__image"
        />
      </div>

      {/* COLUMNA DERECHA – INFO */}
      <div className="product-detail__info">

        <h1 className="product-detail__title">{detail.name}</h1>

        <p className="product-detail__price">
          ${detail.price.toLocaleString("es-AR")}
        </p>

        <div className="product-detail__description">
          {detail.description}
        </div>

        <div className="product-detail__counter">
          <Count
            btnText="AGREGAR AL CARRITO"
            onConfirm={handleAdd}
          />
        </div>

      </div>
    </div>
  );
};
