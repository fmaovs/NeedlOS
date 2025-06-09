import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./iniciar-sesion.css";
import InpText from "../../input/text/inp-text.jsx";
import Spinner from "../../loaders/spinner.jsx";

const User = "../../../../public/media/img/user.png";
const Password = "../../../../public/media/img/password.png";
const Error = "../../../../public/media/img/error.png";
const Aprobado = "../../../../public/media/img/aprobado.png";
const Correo = "../../../../public/media/img/correo.png";

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

      // Guardar token, rol y username
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("rol", response.data.rol);
      sessionStorage.setItem("username", response.data.username);

      // Manejar el login exitoso
      setSuccessMessage("Bienvenido");

      // Esperar 0.8 segundos antes de redirigir
      setTimeout(() => {
        navigate("/home");
      }, 800);
    } catch (error) {
      setError("Credenciales incorrectas");
      setHideError(false);
      setTimeout(() => {
        setHideError(true);
        setTimeout(() => setError(""), 300);
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar mensaje correo
  const [isCorreo, setIsCorreo] = useState(false);
  const [correoIsVisible, setCorreoIsVisible] = useState(false);
  const recuperarContraseña = async () => {
    // Verifica si hay un usuario escrito
    if (!username) {
      alert(
        "Por favor, ingrese su nombre de usuario en el campo 'Usuario' para recuperar la contraseña"
      );
      return;
    }

    setLoading(true);

    // Enviar corrreo
    try {
      const response = await axios.post(
        `http://localhost:8080/users/forgot-password?username=${username}`
      );
      setLoading(false);

      setIsCorreo(true);
      setTimeout(() => {
        setCorreoIsVisible(true);
      }, 10);

      setTimeout(() => {
        setCorreoIsVisible(false);
        setTimeout(() => {
          setIsCorreo(false);
        }, 300);
      }, 2000);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 500) {
        alert("El usuario ingresado no existe");
      }
      return;
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
          placeholder="Admin"
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
          </div>
        )}

        {/* Muestra el mensaje de éxito si existe */}
        {successMessage && (
          <div className="cont-err">
            <img src={Aprobado} className="img-apro" />
            <p className="text-apro">{successMessage}</p>
          </div>
        )}

        {/* Muestra el mensaje de correo */}
        {isCorreo && (
          <div
            className={`cont-correo ${
              correoIsVisible ? "cont-correo-visible" : ""
            }`}
          >
            <img src={Correo} className="img-apro" />
            <p className="text-apro">Recuperacion de contraseña enviada</p>
          </div>
        )}

        <div className="cont-recovery">
          <button
            type="button"
            className="link-recovery"
            onClick={() => recuperarContraseña()}
          >
            Recuperar contraseña
          </button>
        </div>

        <div className="cont-butt-login">
          <button type="submit" className="buttom-login">
            Ingresar
          </button>
        </div>
      </form>
    </div>
  );
}
