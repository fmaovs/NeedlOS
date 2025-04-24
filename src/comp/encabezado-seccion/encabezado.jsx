import "./encabezado.css";

import Buscador from "../buscador/buscador.jsx";
import CrearNSec from "../botones/crearN-sec/crearN-sec";

export default function Encabezado({
  titEncabezado,
  claseCont,
  conBtCrear,
  opc1,
  opc2,
  opc3,
  opc4,
  onClick,
  withSearch,
  children,
  claseBoton,
  imgBoton,
}) {
  return (
    <div className="cont-encabezado">
      <span className="tit-encabezado">{titEncabezado}</span>
      <div className={`cont-espacio ${claseCont}`}>
        <Buscador
          opc1={opc1}
          opc2={opc2}
          opc3={opc3}
          opc4={opc4}
          withSearch={withSearch}
        />
        {children}
      </div>
      <CrearNSec
        visible={conBtCrear}
        onClick={onClick}
        claseBoton={claseBoton}
        imgBoton={imgBoton}
      />
    </div>
  );
}
