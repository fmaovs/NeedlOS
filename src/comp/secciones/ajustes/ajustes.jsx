import { useNavigate } from "react-router-dom";

export default function Ajustes() {
  const navigate = useNavigate();

  // Cerrar sesion
  function cerrarSesion() {
    // Eliminar token y rol
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("rol")

    // Esperar 0.8 segundos antes de redirigir
    setTimeout(() => {
      navigate("/");
    }, 0);
  }

  return (
    <div>
      <button onClick={() => cerrarSesion()}>SALIRME DE ESTA MONDA</button>
    </div>
  );
}
