import { useEffect } from "react";
import "./detalle-pedido.css";
import ContDetalle from "./cont-detalle";

export default function CardDetallePedido({ estado, onClick }) {
  useEffect(() => {
    const hijo = document.getElementById("hijo-tarjeta-detalles");
    if (hijo) {
      hijo.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    }

    return () => {
      if (hijo) {
        hijo.removeEventListener("click", (event) => {
          event.stopPropagation();
        });
      }
    };
  }, []);

  return (
    <section
      className={`salir-detalles ${
        estado ? "detalles-visible" : "detalles-oculto"
      }`}
      onClick={onClick}
    >
      <div className="tarjet-detalles" id="hijo-tarjeta-detalles">
        <section className="fila-detalles-ordenes">
          <ContDetalle titulo={"Nombre:"} txt={"pablo"} />
          <ContDetalle titulo={"Apellido:"} txt={"rivas"} />
          <ContDetalle titulo={"Telefono:"} txt={"3133585900"} />
        </section>
        <section className="fila-detalles-ordenes">
          <ContDetalle titulo={"Sastre Asignado:"} txt={"pablo rivas"} />
          <ContDetalle titulo={"Estado:"} txt={"en proceso"} />
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
              <tr>
                <td>2</td>
                <td>2 cm largo</td>
                <td>camisa</td>
                <td>35.000</td>
                <td>70.000</td>
              </tr>
              <tr>
                <td>2</td>
                <td>2 cm largo</td>
                <td>camisa</td>
                <td>35.000</td>
                <td>70.000</td>
              </tr>
              <tr>
                <td>2</td>
                <td>2 cm largo</td>
                <td>camisa</td>
                <td>35.000</td>
                <td>70.000</td>
              </tr>
              <tr>
                <td>2</td>
                <td>2 cm largo</td>
                <td>camisa</td>
                <td>35.000</td>
                <td>70.000</td>
              </tr>
              <tr>
                <td>2</td>
                <td>2 cm largo</td>
                <td>camisa</td>
                <td>35.000</td>
                <td>70.000</td>
              </tr>
              <tr>
                <td>2</td>
                <td>2 cm largo</td>
                <td>camisa</td>
                <td>35.000</td>
                <td>70.000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <section className="fila-detalles-ordenes">
          <ContDetalle titulo={"Fecha Pedido"} txt={"13/09/2023 - 10:13 AM"} />
          <ContDetalle titulo={"Fecha Entrega"} txt={"10/01/2024 - 01:13 PM"} />
        </section>
        <button className="boton-finalizar-estado">Finalizado</button>
      </div>
    </section>
  );
}
