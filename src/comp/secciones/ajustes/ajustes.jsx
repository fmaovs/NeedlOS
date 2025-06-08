import "./ajustes.css";
import { useNavigate } from "react-router-dom";

const cerrarSesionImg = "../../../../public/media/img/cerrar-sesion.png";

export default function Ajustes() {
  const navigate = useNavigate();

  // Cerrar sesion
  function cerrarSesion() {
    // Eliminar token y rol
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("rol");
    sessionStorage.removeItem("username");

    // Esperar 0.8 segundos antes de redirigir
    setTimeout(() => {
      navigate("/");
    }, 150);
  }

  return (
    <div className="cont-settings">
      <button className="btn-cerrar-sesion" onClick={() => cerrarSesion()}>
        <img src={cerrarSesionImg} alt="" />
        Cerrar Sesión
      </button>
    </div>
  );
}
