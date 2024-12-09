import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./iniciar-sesion.css";

const User = "../../../../public/media/img/user.png";
const Password = "../../../../public/media/img/password.png";

import CheckBox from "../../input/checkbox/checkbox.jsx";
import InpText from "../../input/text/inp-text.jsx";

export default function IniciarSesion() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/login", {
        username,
        password,
      });

      // Guardar token y manejar login exitoso
      localStorage.setItem("authToken", response.data.token);
      // Redireccionar o actualizar estado de autenticación
      console.log("Login exitoso", response.data);
      navigate("/inventario/nuevo");
    } catch (error) {
      setError("Credenciales incorrectas");
      console.error("Error de login:", error);
    }
  };

  return (
    <div className="fondo-formulario">
      <form onSubmit={handleLogin} className="form-iniciar-sesion">
        <h2 className="welcome">Bienvenido de nuevo</h2>
        <h3 className="credenciales">Por favor ingrese sus credenciales.</h3>

        <InpText
          lbDireccion="usuario"
          txt="Usuario"
          img={User}
          type="text"
          placeholder="Ejemplo@gmail.com"
          id="usuario"
          valor={username}
          cambio={(e) => setUsername(e.target.value)}
        />

        <InpText
          lbDireccion="contraseña"
          txt="Contraseña"
          img={Password}
          type="password"
          placeholder=" ∗ ∗ ∗ ∗ ∗ ∗ ∗ "
          id="contraseña"
          valor={password}
          cambio={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
        )}

        <div className="cont-recovery">
          <CheckBox />
          <label htmlFor="recuerdame" className="lb-inp">
            Recuerdame
          </label>
          <a href="">Recuperar contraseña</a>
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
