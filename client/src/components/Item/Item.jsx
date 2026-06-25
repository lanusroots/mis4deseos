import "./Item.css";

export const Item = ({
  name,
  price,
  description,
  imageUrl,
  hideDescription,
  children,
}) => {
  return (
    <article className="product-item">
      <img src={imageUrl} alt={description} />

      <h2 className="product-title">{name}</h2>

      <p className="product-price">Precio:${price}</p>

      {!hideDescription && (
        <p className="product-description">Descripcion {description}</p>
      )}

      {children}
    </article>
  );
};
