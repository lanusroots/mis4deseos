import "./home.css";
import { Carousel } from "../../components/Carousel/Carousel";

export const Home = () => {
  return (
    <section className="home-container fade-in">
      <div className="home-content">
        <Carousel />

        <img
          src="/images/home_mis4deseos.png"
          alt="Mesa de postres artesanales mis4deseos"
          className="home-mobile-image"
        />

        <div className="home-text">
          <h2>Bienvenidos a mis4deseos</h2>
          <p>
            Endulzamos tus momentos más especiales con nuestras tortas, postres
            y cupcakes artesanales. Descubrí todo lo que tenemos para vos en
            nuestra tienda online 🍰
          </p>
        </div>
      </div>

      {/* Bloque de beneficios */}
      <div className="benefits">
        <div className="benefit-item">
          <i className="fa-solid fa-truck"></i>
          <div>
            <h3>ENVÍOS A CABA Y GBA</h3>
            <p>Hacé tu pedido y te lo entregamos en 48HS</p>
          </div>
        </div>

        <div className="benefit-item">
          <i className="fa-solid fa-credit-card"></i>
          <div>
            <h3>PAGÁ COMO QUIERAS</h3>
            <p>Tarjetas de crédito o Mercado Pago</p>
          </div>
        </div>

        <div className="benefit-item">
          <i className="fa-solid fa-lock"></i>
          <div>
            <h3>COMPRÁ CON SEGURIDAD</h3>
            <p>Tus datos siempre protegidos</p>
          </div>
        </div>
      </div>
    </section>
  );
};