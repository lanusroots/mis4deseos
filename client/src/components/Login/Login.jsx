import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext/useAuthContext";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import "./Login.css"

export const Login = () => {
  const [userForm, setUserForm] = useState({ name: "", password: "" });
  const { user, login } = useAuthContext();

  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/admin/alta-productos" />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target; //desestructutro el name del form de abajo
    setUserForm({ ...userForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(userForm.name, userForm.password);

    if (success) {
      navigate("/admin/alta-productos");
    } else {
      alert("Credenciales incorrectas");
      setUserForm({ name: "", password: "" });
    }
  };

  return (
    <form className="session-form" onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>

      <div>
        <label>Usuario:</label>
        <input
          type="text"
          name="name"
          value={userForm.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Contraseña:</label>
        <input
          type="password"
          name="password"
          value={userForm.password}
          onChange={handleChange}
        />
      </div>

      <p className="forgot">¿Olvidaste tu contraseña?</p>

      <button type="submit">Iniciar sesión</button>

      <p className="register">
        ¿No tenés cuenta? <span>Crear cuenta</span>
      </p>
    </form>
  );
};
