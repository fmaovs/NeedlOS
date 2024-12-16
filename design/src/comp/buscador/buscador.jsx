import "./buscador.css";
import SepYNegroSmall from "../separadores/sep-y-negro-small/sep-y-negro-small.jsx";

const Buscar = "../../../public/media/img/buscar.png";

export default function Buscador({ opc1 , opc2 , opc3 , opc4 }) {
  return (
    <>
      <img src={Buscar} className="img-buscar" />
      <input type="text" className="inp-buscador" placeholder="Buscar..." />
      <SepYNegroSmall />
      <span className="buscar-por-txt">Buscar Por...</span>
      <div className="cont-opciones-buscar">
        <select className="opciones-buscar">
          <option>{opc1}</option>
          <option>{opc2}</option>
          <option>{opc3}</option>
          <option>{opc4}</option>
        </select>
      </div>
    </>
  );
}
