import "./filter-sec.css";

const Recargar = "../../../../public/media/img/recargar.png";

export default function BotonFilter() {
  return (
    <button className="other-filters">
      <img src={Recargar} className="img-others-filter" />
    </button>
  );
}
