import "./informes.css";

export default function TotalGrafico({ bgColor, color, txt }) {
  return (
    <div className={`cont-total-grafico ${bgColor}`}>
      <div className={`${color}`}></div>
      <span>{txt}</span>
    </div>
  );
}
