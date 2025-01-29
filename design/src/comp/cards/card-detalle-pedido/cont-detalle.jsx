export default function ContDetalle({titulo, txt}) {
    return(
        <div className="cont-detalle">
            <span className="detalles-titulo">{titulo}</span>
            <span className="detalles-txt">{txt}</span>
        </div>
    )
}