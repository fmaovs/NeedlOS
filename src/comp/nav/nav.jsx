import "./nav.css";
import { useState } from "react";
import LogoImgTxt from "../logo/logo-negro/LogoImg+Text.jsx";
import SepXBlancoSmall from "../separadores/sep-x-blanco-small/sep-x-blanco-s.jsx";
import OpcionNav from "../opciones-nav/opciones-nav.jsx";

// Las imágenes de las opciones
const Ordenes = "../../../public/media/img/ordenes.png";
const Informes = "../../../public/media/img/informes.png";
const Inventario = "../../../public/media/img/inventario.png";
const Usuarios = "../../../public/media/img/usuarios.png";
const Gastos = "../../../public/media/img/gastos.png";
const ArqueoCaja = "../../../public/media/img/arqueo-caja.png";
const Nomina = "../../../public/media/img/nomina.png";
const Ajustes = "../../../public/media/img/ajustes.png";
const SesionActiva = "../../../public/media/img/sesion-activa.png";

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

  return (
    <div className="cont-nav">
      <LogoImgTxt />
      <div className="cont-sesion-activa">
        <img src={SesionActiva} alt="Imagen sesion activa" />
        <div>
          <span className="sesion-activa">Sesión: @admin</span>
          <span className="sesion-activa">Rol: Administrador</span>
        </div>
      </div>
      <SepXBlancoSmall />
      {renderOpcion(Ordenes, "Ordenes", "cont-seccion-first")}
      {renderOpcion(Inventario, "Inventario", "cont-seccion")}
      {renderOpcion(Usuarios, "Usuarios", "cont-seccion")}
      {renderOpcion(Gastos, "Gastos", "cont-seccion")}
      {renderOpcion(Nomina, "Nomina", "cont-seccion")}
      {renderOpcion(Informes, "Informes", "cont-seccion")}
      {renderOpcion(ArqueoCaja, "ArqueoCaja", "cont-seccion-last")}
      <SepXBlancoSmall clase={"sepXBlancoNav"} />
      {renderOpcion(Ajustes, "Ajustes", "cont-seccion-sett")}
    </div>
  );
}
