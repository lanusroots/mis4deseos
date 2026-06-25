import { Link } from "react-router-dom";
import { Item } from "../Item/Item";
import "./ItemList.css";

export const ItemList = ({ list }) => {
  if (!list.length) return <p>No hay productos disponibles</p>;

  return (
    <div className="product-grid">
      {list.map((prod) => (
        <Item key={prod._id} {...prod} />
      ))}
    </div>
  );
};
