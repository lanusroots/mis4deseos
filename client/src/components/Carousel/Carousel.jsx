import { useState, useEffect } from "react";
import "./carousel.css";

const images = [
  "/images/banner4.webp",
  "/images/banner5.webp",
  "/images/banner6.webp"
];

export const Carousel = () => {
  const [index, setIndex] = useState(0);

  // Pase automático cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel">

      <img
        src={images[index]}
        alt={`Slide ${index + 1}`}
        className="carousel-image"
        width="1400"
        height="620"
      />


      <div className="carousel-dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          ></span>
        ))}
      </div>
    </div>
  );
};
