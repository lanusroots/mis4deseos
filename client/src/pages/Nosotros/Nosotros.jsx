import "./Nosotros.css";

export const Nosotros = () => {
  return (
    <section className="nosotros-container fade-in">
      <div className="nosotros-content">
        <img
          src="/images/nosotros1.png"
          alt="Pastelería artesanal"
          className="nosotros-img"
        />
        <div className="nosotros-text">
          <h2>Sobre Nosotros</h2>
          <p>
            En <strong>mis4deseos</strong> creemos que cada momento merece un
            toque dulce y especial. Desde nuestros inicios, nos dedicamos a
            crear tortas, cupcakes y postres que combinan sabor, arte y amor en
            cada detalle.
          </p>
          <p>
            Cocinamos con los ingredientes de mejor calidad, amamos los detalles
            y ponemos mucha pasión en lo que hacemos.
          </p>
          <p>
            Te invitamos a descubrir todos los sabores en nuestra tienda online…
          </p>
        </div>
      </div>
    </section>
  );
};
