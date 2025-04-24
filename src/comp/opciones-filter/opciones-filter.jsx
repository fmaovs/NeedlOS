import "./opciones-filter.css";

export default function OpcionesFilter({
  clase,
  txtFilter,
  imgFilter,
  onClick,
}) {
  return (
    <div className={`filter ${clase}`} onClick={onClick}>
      <span className="filter-txt">{txtFilter}</span>
      <img src={imgFilter} className="filter-img" />
    </div>
  );
}
