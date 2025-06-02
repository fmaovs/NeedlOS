export default function ContTxt({ titulo, id, type, placeholder }) {
  return (
    <div className="cont-detalle">
      <span className="detalles-titulo">{titulo}</span>
      <input className="detalles-txt-input" id={id} type={type} placeholder={placeholder}></input>
    </div>
  );
}
