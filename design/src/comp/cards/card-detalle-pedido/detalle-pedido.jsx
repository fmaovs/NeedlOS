import "./detalle-pedido.css";
import ContDetalle from "./cont-detalle";
const cerrar = "../../../../public/media/img/cerrar.png";

export default function CardDetallePedido({
  estado,
  onClick,
  nombre,
  apelliido,
  telefono,
  sastreAsignado,
  tipoArreglo,
  estadoPedido,
  fechaPedido,
  fechaEntrega,
  children,
}) {
  return (
    <div
      className={`cont-tarjeta-detalles ${
        estado ? "cont-tarjeta-detalles-visible" : ""
      }`}
    >
      <div className="tarjeta-detalles">
        <button className="salir-tarjeta-detalles" onClick={onClick}>
          <img src={cerrar} />
        </button>
        <section className="fila-detalles-ordenes">
          <ContDetalle titulo={"Nombre:"} txt={nombre} />
          <ContDetalle titulo={"Apellido:"} txt={apelliido} />
          <ContDetalle titulo={"Telefono:"} txt={telefono} />
        </section>
        <section className="fila-detalles-ordenes">
          <ContDetalle titulo={"Sastre Asignado:"} txt={sastreAsignado} />
          <ContDetalle titulo={"Tipo:"} txt={tipoArreglo} />
          <ContDetalle titulo={"Estado:"} txt={estadoPedido} />
        </section>
        <div className="cont-tb-card-detaPedido">
          <table className="tabla-card-detalles-pedido">
            <thead>
              <tr>
                <th>Cant.</th>
                <th>Detalles</th>
                <th>Producto</th>
                <th>Vlr.Unit</th>
                <th>Vlr.Total</th>
              </tr>
            </thead>
            <tbody>
              {children}
            </tbody>
          </table>
        </div>
        <section className="fila-detalles-ordenes">
          <ContDetalle titulo={"Fecha Pedido"} txt={fechaPedido} />
          <ContDetalle titulo={"Fecha Entrega"} txt={fechaEntrega} />
        </section>
        <button className="boton-finalizar-estado">Finalizado</button>
      </div>
    </div>
  );
}
