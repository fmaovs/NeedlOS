export default function ContTxt({ titulo, id, type }) {
  return (
    <div className="cont-detalle">
      <span className="detalles-titulo">{titulo}</span>
      <input className="detalles-txt-input" id={id} type={type}></input>
    </div>
  );
}
