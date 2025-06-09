import "./nav.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoImgTxt from "../logo/logo-negro/LogoImg+Text.jsx";
import SepXBlancoSmall from "../separadores/sep-x-blanco-small/sep-x-blanco-s.jsx";
import OpcionNav from "../opciones-nav/opciones-nav.jsx";

// Las imágenes de las opciones
const SesionActiva = "../../../public/media/img/sesion-activa.png";
const Ordenes = "../../../public/media/img/ordenes.png";
const Informes = "../../../public/media/img/informes.png";
const Inventario = "../../../public/media/img/inventario.png";
const Usuarios = "../../../public/media/img/usuarios.png";
const Gastos = "../../../public/media/img/gastos.png";
const ArqueoCaja = "../../../public/media/img/arqueo-caja.png";
const Nomina = "../../../public/media/img/nomina.png";
const Ayuda = "../../../public/media/img/ayuda.png";
const CerrarSesion = "../../../public/media/img/cerrar-sesion.png";

export default function Nav({ setComponenteSeleccionado }) {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("Ordenes");

  const handleClick = (componente) => {
    setOpcionSeleccionada(componente);
    setComponenteSeleccionado(componente);
  };

  // Opciones que se deben ocultar para el rol USER
  const ocultarParaUser = [
    "Usuarios",
    "Nomina",
    "Informes",
    "Gastos",
    "ArqueoCaja",
  ];

  // Traducción de nombres internos a nombres visibles para el usuario
  const textosVisibles = {
    ArqueoCaja: "Arqueo Caja",
    SesionActiva: "Sesión Activa",
    Nomina: "Nómina", // <-- Aquí agregamos la tilde
  };

  // Función para renderizar una opción si corresponde
  const renderOpcion = (img, txt, clase) => {
    if (
      sessionStorage.getItem("rol") === "USER" &&
      ocultarParaUser.includes(txt)
    )
      return null;

    const txtVisible = textosVisibles[txt] || txt;

    return (
      <OpcionNav
        img={img}
        txt={txtVisible}
        clase={`${clase} ${opcionSeleccionada === txt ? "active" : ""}`}
        onClick={() => handleClick(txt)}
      />
    );
  };

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

  const manualUsuario = "/public/docs/Manual de usuario.pdf";
  function abrirPdf() {
    window.open(manualUsuario, "_blank");
  }

  return (
    <div className="cont-nav">
      <LogoImgTxt />
      <div className="cont-sesion-activa">
        <img src={SesionActiva} alt="Imagen sesion activa" />
        <div>
          <span className="sesion-activa">
            Sesión: {sessionStorage.getItem("username")}
          </span>
          <span className="sesion-activa">
            Rol: {sessionStorage.getItem("rol")}
          </span>
        </div>
      </div>
      <SepXBlancoSmall />
      {renderOpcion(Ordenes, "Ordenes", "cont-seccion-first")}
      {renderOpcion(Inventario, "Inventario", "cont-seccion")}
      {renderOpcion(Usuarios, "Usuarios", "cont-seccion")}
      {renderOpcion(Gastos, "Gastos", "cont-seccion")}
      {renderOpcion(Nomina, "Nomina", "cont-seccion")}
      {renderOpcion(ArqueoCaja, "ArqueoCaja", "cont-seccion")}
      {renderOpcion(Informes, "Informes", "cont-seccion-last")}
      <SepXBlancoSmall clase={"sepXBlancoNav"} />
      <OpcionNav
        img={Ayuda}
        txt={"Ayuda"}
        clase={"cont-seccion-sett cont-help"}
        onClick={() => abrirPdf()}
      />
      <OpcionNav
        img={CerrarSesion}
        txt={"Cerrar sesión"}
        clase={"cont-seccion-sett"}
        onClick={() => cerrarSesion()}
      />
    </div>
  );
}
