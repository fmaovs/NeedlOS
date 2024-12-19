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

export default function Nav({ setComponenteSeleccionado }) {
  // Estado para la opción seleccionada
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("Ordenes");

  const handleClick = (componente) => {
    setOpcionSeleccionada(componente); // Actualiza la opción seleccionada
    setComponenteSeleccionado(componente); // Llama a la función pasada por props
  };

  return (
    <div className="cont-nav">
      <LogoImgTxt />
      <SepXBlancoSmall />
      <OpcionNav
        img={Ordenes}
        txt={"Ordenes"}
        clase={`cont-seccion-first ${
          opcionSeleccionada === "Ordenes" ? "active" : ""
        }`}
        onClick={() => handleClick("Ordenes")}
      />
      <OpcionNav
        img={Informes}
        txt={"Informes"}
        clase={`cont-seccion ${
          opcionSeleccionada === "Informes" ? "active" : ""
        }`}
        onClick={() => handleClick("Informes")}
      />
      <OpcionNav
        img={Inventario}
        txt={"Inventario"}
        clase={`cont-seccion ${
          opcionSeleccionada === "Inventario" ? "active" : ""
        }`}
        onClick={() => handleClick("Inventario")}
      />
      <OpcionNav
        img={Usuarios}
        txt={"Usuarios"}
        clase={`cont-seccion ${
          opcionSeleccionada === "Usuarios" ? "active" : ""
        }`}
        onClick={() => handleClick("Usuarios")}
      />
      <OpcionNav
        img={Gastos}
        txt={"Gastos"}
        clase={`cont-seccion ${
          opcionSeleccionada === "Gastos" ? "active" : ""
        }`}
        onClick={() => handleClick("Gastos")}
      />
      <OpcionNav
        img={ArqueoCaja}
        txt={"Arqueo Caja"}
        clase={`cont-seccion ${
          opcionSeleccionada === "ArqueoCaja" ? "active" : ""
        }`}
        onClick={() => handleClick("ArqueoCaja")}
      />
      <OpcionNav
        img={Nomina}
        txt={"Nomina"}
        clase={`cont-seccion-last ${
          opcionSeleccionada === "Nomina" ? "active" : ""
        }`}
        onClick={() => handleClick("Nomina")}
      />
      <SepXBlancoSmall />
      <OpcionNav
        img={Ajustes}
        txt={"Ajustes"}
        clase={`cont-seccion-sett ${
          opcionSeleccionada === "Ajustes" ? "active" : ""
        }`}
        onClick={() => handleClick("Ajustes")}
      />
    </div>
  );
}
