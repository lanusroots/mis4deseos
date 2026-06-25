import { useState } from "react";
import "./Contacto.css";

export const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Mensaje enviado, ¡Nos comunicaremos pronto!!");

    // Limpiar formulario
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      mensaje: "",
    });
  };

  return (
    <section className="contacto-container">
      <h2>Contacto</h2>

      <form className="contacto-form" onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre</label>
        <input
          type="text"
          id="nombre"
          placeholder="María Pérez"
          value={formData.nombre}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="tunombre@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="telefono">Teléfono (opcional)</label>
        <input
          type="tel"
          id="telefono"
          placeholder="1123445567"
          value={formData.telefono}
          onChange={handleChange}
        />

        <label htmlFor="mensaje">Mensaje</label>
        <textarea
          id="mensaje"
          rows="5"
          placeholder="Escribí tu mensaje aquí..."
          value={formData.mensaje}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit" className="btn-submit">
          Enviar
        </button>
      </form>
    </section>
  );
};
