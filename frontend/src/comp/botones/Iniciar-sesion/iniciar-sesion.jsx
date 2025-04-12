import { Link } from "react-router-dom";
import "./iniciar-sesion.css";

export default function IniciarSesion({ funShow }) {
  return (
    <button className="iniciar-sesion" onClick={funShow}>
      Iniciar sesion
    </button>
  );
}
