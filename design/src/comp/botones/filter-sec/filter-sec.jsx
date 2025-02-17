import "./filter-sec.css";

const Recargar = "../../../../public/media/img/recargar.png";

export default function BotonFilter({ onClick }) {
  return (
    <button className="other-filters" onClick={onClick}>
      <img src={Recargar} className="img-others-filter" />
    </button>
  );
}
