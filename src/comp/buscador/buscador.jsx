import "./buscador.css";
import SepYNegroSmall from "../separadores/sep-y-negro-small/sep-y-negro-small.jsx";

const Buscar = "../../../public/media/img/buscar.png";

export default function Buscador({ opc1, opc2, opc3, withSearch, onInput }) {
  return (
    <div className={`cont-buscador ${withSearch}`}>
      <img src={Buscar} className="img-buscar" />
      <input type="text" className="inp-buscador" placeholder="Buscar..." onInput={onInput} />
      <SepYNegroSmall />
      <span className="buscar-por-txt">Buscar Por...</span>
      <div className="cont-opciones-buscar">
        <select className="opciones-buscar" id="opciones-buscar" onChange={onInput}>
          <option>{opc1}</option>
          <option>{opc2}</option>
          <option>{opc3}</option>
        </select>
      </div>
    </div>
  );
}
