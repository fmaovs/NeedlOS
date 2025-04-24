export default function ContSelect({ titulo, id, children }) {
  return (
    <div className="cont-detalle">
      <span className="detalles-titulo">{titulo}</span>
      <select className="detalles-txt-input select" id={id}>
        {children}
      </select>
    </div>
  );
}
