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
        <section className="fila-detalles">
          <ContDetalle titulo={"Sastre Asiignado:"} txt={"pablo rivas"}/>
          <ContDetalle titulo={"Estado:"} txt={"en proceso"}/>
        </section>
      </div>
    </section>
  );
}
