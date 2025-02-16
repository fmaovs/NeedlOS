export default function ContDetalle({ titulo, txt, id }) {
  return (
    <div className="cont-detalle">
      <span className="detalles-titulo">{titulo}</span>
      <span className="detalles-txt" id={id}>
        {txt}
      </span>
    </div>
  );
}
