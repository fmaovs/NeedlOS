import "./encabezado.css";

import Buscador from "../buscador/buscador.jsx";
import CrearNSec from "../botones/crearN-sec/crearN-sec";

export default function Encabezado({ titEncabezado , conBtCrear , opc1 , opc2 , opc3 , opc4 }) {
  return (
    <div className="cont-encabezado">
      <span className="tit-encabezado">{titEncabezado}</span>
      <div className="cont-espacio">
        <Buscador opc1={opc1} opc2={opc2} opc3={opc3} opc4={opc4}/>
      </div>
      <CrearNSec visible={conBtCrear}/>
    </div>
  );
}
