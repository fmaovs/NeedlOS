export default function ContDetalle({ titulo, txt, id, children, clase }) {
  return (
    <div className="cont-detalle">
      <span className="detalles-titulo">{titulo}</span>
      <span className={`detalles-txt ${clase}`} id={id}>
        {txt}
        {children}
      </span>
    </div>
  );
}
