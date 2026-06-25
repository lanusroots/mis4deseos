import { Link } from "react-router-dom";
import { Item } from "../Item/Item";

export const ItemList =({list}) => {
    return (
    <>
    {list.length ? (
     list.map((prod) =>( 
        <Link to={`/detail/${prod.id}`}  key={prod.id}>
            <Item {...prod} hideDescription={true} />
        </Link>))
     ): ( 
        <p>No hay productos</p> 
     )}
    </>
    );
};