import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./iniciar-sesion.css";
import CheckBox from "../../input/checkbox/checkbox.jsx";
import InpText from "../../input/text/inp-text.jsx";
import Spinner from "../../loaders/spinner.jsx";

import User from "../../../assets/img/user.png";
import Password from "../../../assets/img/password.png";
import Error from "../../../assets/img/error.png";
import Aprobado from '../../../assets/img/aprobado.png'
import Cerrar from "../../../assets/img/cerrar.png";

export let tokenPass = null

export default function IniciarSesion() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hideError, setHideError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  /* CONEXION BACKEND */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setHideError(false);

    try {
      const response = await axios.post("http://localhost:8080/login", {
        username,
        password,
      });

      // Extraer el token de la respuesta
      const token = response.data.token;
      tokenPass = token

      // Manejar el login exitoso
      setSuccessMessage("Bienvenido");

      // Esperar 0.8 segundos antes de redirigir
      setTimeout(() => {
        navigate("/home");
      }, 800);
    } catch (error) {
      setError("Credenciales incorrectas");
      setHideError(false);
    } finally {
      setLoading(false);
    }
  };

  /*BORRAR MENSAJE DE ERROR*/
  const closeError = () => {
    setHideError(true);
    setTimeout(() => setError(""), 300);
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

        {/* Muestra el spinner de carga solo cuando loading es true */}
        {loading && (
          <div className="cont-err-load">
            <Spinner />
          </div>
        )}

        {/* Muestra el error solo si error no está vacío */}
        {error && (
          <div className={`cont-err ${hideError ? "hide" : ""}`}>
            <img src={Error} className="img-err" />
            <p className="text-err">{error}</p>
            <div className="cont-cerrar" onClick={closeError}>
              <img src={Cerrar} className="img-cerrar" alt="Cerrar" />
            </div>
          </div>
        )}

        {/* Muestra el mensaje de éxito si existe */}
        {successMessage && (
          <div className="cont-err">
            <img src={Aprobado} className="img-apro" />
            <p className="text-apro">{successMessage}</p>
          </div>
        )}

        <div className="cont-recovery">
          <CheckBox />
          <label htmlFor="recuerdame" className="lb-inp-recovery">
            Recuerdame
          </label>
          <a href="" className="link-recovery">
            Recuperar contraseña
          </a>
        </div>

        <div className="cont-butt-login">
          <button type="submit" className="buttom-login">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}