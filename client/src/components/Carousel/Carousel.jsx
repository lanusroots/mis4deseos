import { useState, useEffect } from "react"
import "./Carousel.css"

const images = [
  "/images/banner4.png",
  "/images/banner5.png",
  "/images/banner6.png",
]

export const Carousel = () => {
  const [index, setIndex] = useState(0)

  // Pase automático cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 5000);
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="carousel">
      <img
        src={images[index]}
        alt={`Slide ${index + 1}`}
        className="carousel-image"
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
  )
}
