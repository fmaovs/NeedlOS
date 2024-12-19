import "./filter-sec.css";

const Filtro = '../../../../public/media/img/filtro.png'

export default function BotonFilter() {
  return (
    <button className="other-filters">
      <img src={Filtro} className="img-others-filter" />
    </button>
  );
}
