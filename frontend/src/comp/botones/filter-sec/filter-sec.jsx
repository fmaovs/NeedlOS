import "./filter-sec.css";

import Recargar from "../../../assets/img/recargar.png";

export default function BotonFilter({ onClick }) {
  return (
    <button className="other-filters" onClick={onClick}>
      <img src={Recargar} alt="Refrescar" className="img-others-filter" />
    </button>
  );
}
