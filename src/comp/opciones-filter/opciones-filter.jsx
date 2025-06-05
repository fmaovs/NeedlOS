import "./opciones-filter.css";

export default function OpcionesFilter({
  clase,
  txtFilter,
  imgFilter,
  onClick,
  isLast,
  tabIndex,
}) {
  return (
    <button className={`filter ${clase}`} onClick={onClick} tabIndex={tabIndex}>
      <span className="filter-txt">{txtFilter}</span>
      <img src={imgFilter} className={`filter-img ${isLast}`} />
    </button>
  );
}
