import "./nav.css";
import { useState } from "react";
import LogoImgTxt from "../logo/logo-negro/LogoImg+Text.jsx";
import SepXBlancoSmall from "../separadores/sep-x-blanco-small/sep-x-blanco-s.jsx";
import OpcionNav from "../opciones-nav/opciones-nav.jsx";

// Las imágenes de las opciones
import Ordenes from "../../assets/img/ordenes.png";
import Informes from "../../assets/img/informes.png";
import Inventario from "../../assets/img/inventario.png";
import Usuarios from "../../assets/img/usuarios.png";
import Gastos from "../../assets/img/gastos.png";
import ArqueoCaja from "../../assets/img/arqueo-caja.png";
import Nomina from "../../assets/img/nomina.png";
import Ajustes from "../../assets/img/ajustes.png";

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
        alt={"ordenes"}
        txt={"Ordenes"}
        clase={`cont-seccion-first ${
          opcionSeleccionada === "Ordenes" ? "active" : ""
        }`}
        onClick={() => handleClick("Ordenes")}
      />
      <OpcionNav
        img={Inventario}
        alt={"inventario"}
        txt={"Inventario"}
        clase={`cont-seccion ${
          opcionSeleccionada === "Inventario" ? "active" : ""
        }`}
        onClick={() => handleClick("Inventario")}
      />
      <OpcionNav
        img={Usuarios}
        alt={"usuario"}
        txt={"Usuarios"}
        clase={`cont-seccion ${
          opcionSeleccionada === "Usuarios" ? "active" : ""
        }`}
        onClick={() => handleClick("Usuarios")}
      />
      <OpcionNav
        img={Gastos}
        alt={"gastos"}
        txt={"Gastos"}
        clase={`cont-seccion ${
          opcionSeleccionada === "Gastos" ? "active" : ""
        }`}
        onClick={() => handleClick("Gastos")}
      />
      <OpcionNav
        img={Nomina}
        alt={"nomina"}
        txt={"Nomina"}
        clase={`cont-seccion ${
          opcionSeleccionada === "Nomina" ? "active" : ""
        }`}
        onClick={() => handleClick("Nomina")}
      />
      <OpcionNav
        img={Informes}
        alt={"informes"}
        txt={"Informes"}
        clase={`cont-seccion ${
          opcionSeleccionada === "Informes" ? "active" : ""
        }`}
        onClick={() => handleClick("Informes")}
      />
      <OpcionNav
        img={ArqueoCaja}
        alt={"arqueo caja"}
        txt={"Arqueo Caja"}
        clase={`cont-seccion-last ${
          opcionSeleccionada === "ArqueoCaja" ? "active" : ""
        }`}
        onClick={() => handleClick("ArqueoCaja")}
      />
      <SepXBlancoSmall />
      <OpcionNav
        img={Ajustes}
        alt={"ajustes"}
        txt={"Ajustes"}
        clase={`cont-seccion-sett ${
          opcionSeleccionada === "Ajustes" ? "active" : ""
        }`}
        onClick={() => handleClick("Ajustes")}
      />
    </div>
  );
}
