import "./estado-ordenes.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { tokenPass } from "../../../formularios/iniciar-sesion/iniciar-sesion";
import DetallesOrden from "../../../botones/abrir-detalles-orden/detalles-orden";
import CardDetallePedido from "../../../cards/card-detalle-pedido/detalle-pedido";

const noEncontrado = "../../../../../public/media/img/no-encontrado.png";

export default function TbTodo() {
  useEffect(() => {
    mostrarPedido();
  }, []);

  const [orders, setOrders] = useState([]);
  const mostrarPedido = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/orders/estado/en_proceso",
        {
          headers: {
            Authorization: `Bearer ${tokenPass}`,
          },
        }
      );
      const sortedOrders = response.data.sort(
        (a, b) => new Date(b.fechaPedido) - new Date(a.fechaPedido)
      );

      setOrders(sortedOrders);
    } catch {
      console.log("Error accediendo a las ordenes");
    }
  };

  /*MOSTRAR DETALLES ORDEN*/
  const [mensajeErr, setMensajeErr] = useState(null);
  const [detalles, setDetalles] = useState(null);
  const [detallesVisible, setDetallesVisible] = useState(false);
  const [mostrarDt, setMostrarDt] = useState(false);
  const mostrarDetalles = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${tokenPass}`,
        },
      });

      if (mostrarDt) {
        setMostrarDt(false);
        setTimeout(() => {
          setDetalles(response.data);
          setMostrarDt(true);
        }, 300);
      } else {
        setDetallesVisible(true);
        setTimeout(() => {
          setDetalles(response.data);
          setMostrarDt(true);
        }, 15);
      }
    } catch (error) {
      console.log("Error obteniendo detalles:", error);
      setMensajeErr("No se puede acceder a los datos");
    }
  };

  /*OCULTAR DETALLES ORDEN*/
  const ocultarDetalles = () => {
    setMostrarDt(false);
    setTimeout(() => {
      setDetallesVisible(false);
    }, 300);
  };

  return (
    <>
      {setMensajeErr && <span>{mensajeErr}</span>}
      {detallesVisible && detalles && (
        <CardDetallePedido
          estado={mostrarDt}
          onClick={ocultarDetalles}
          nombre={detalles.customerName || "Desconocido"}
          telefono={detalles.telefono || "N/A"}
          sastreAsignado={detalles.sastre || "Sin asignar"}
          tipoArreglo={detalles.concepto || "No especificado"}
          estadoPedido={detalles.estado || "Desconocido"}
          fechaPedido={
            detalles.fechaPedido
              ? new Date(detalles.fechaPedido)
                  .toLocaleString("es-CO", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .replace(",", " -")
                  .replace("a. m.", "AM")
                  .replace("p. m.", "PM")
              : "No disponible"
          }
          fechaEntrega={
            detalles.fechaEntrega
              ? new Date(detalles.fechaEntrega)
                  .toLocaleString("es-CO", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .replace(",", " -")
                  .replace("a. m.", "AM")
                  .replace("p. m.", "PM")
              : "No disponible"
          }
        >
          {detalles.prenda?.map((prenda, index) => (
            <>
              <tr key={index}>
                <td>{prenda.cantidad}</td>
                <td>detalles</td>
                <td>{prenda.descripcion}</td>
                <td>{new Intl.NumberFormat("es-CO").format(prenda.valor)}</td>
                <td>
                  {new Intl.NumberFormat("es-CO").format(
                    prenda.valor * prenda.cantidad
                  )}
                </td>
              </tr>
              <tr className="last-row-tb-tarjeta-detalles"></tr>
            </>
          ))}
        </CardDetallePedido>
      )}
      <div className="cont-tabla">
        <table className="tabla">
          {orders.length > 0 ? (
            <>
              <thead className="th-tabla">
                <tr className="separacion-fila-head"></tr>
                <tr className="tr-encabezado">
                  <th className="th">N°</th>
                  <th className="th"> Cliente </th>
                  <th className="th"> Telefono </th>
                  <th className="th">Fecha radicacion</th>
                  <th className="th">Fecha entrega</th>
                  <th className="th"> Valor </th>
                  <th className="th">Prenda</th>
                  <th className="th">Estado</th>
                </tr>
                <tr className="separacion-fila-head"></tr>
              </thead>
              <tbody className="body-tabla">
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="tr-body">
                      <td className="td">{order.id}</td>
                      <td className="td">{order.customerName}</td>
                      <td className="td">{order.telefono}</td>
                      <td className="td">
                        {new Date(order.fechaPedido)
                          .toLocaleString("es-CO", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          .replace(",", " -")
                          .replace("a. m.", "AM")
                          .replace("p. m.", "PM")}
                      </td>
                      <td className="td">
                        {new Date(order.fechaEntrega)
                          .toLocaleString("es-CO", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          .replace(",", " -")
                          .replace("a. m.", "AM")
                          .replace("p. m.", "PM")}
                      </td>
                      <td className="td">
                        {new Intl.NumberFormat("es-CO", {
                          style: "decimal",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(order.saldo)}
                      </td>
                      <td className="td">
                        {order.prenda
                          .slice(0, 2)
                          .map((p) => p.descripcion)
                          .join(", ") + (order.prenda.length > 2 ? "..." : "")}
                      </td>
                      <td
                        className="td"
                        onClick={() => mostrarDetalles(order.id)}
                      >
                        <DetallesOrden clase={"en-proceso"} />
                      </td>
                    </tr>
                    <tr className="separacion-fila"></tr>
                  </React.Fragment>
                ))}
              </tbody>
            </>
          ) : (
            <tbody className="body-tabla">
              <tr className="no-orders">
                <td colSpan="8">
                  <img src={noEncontrado} className="cont-mess-err" />
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </>
  );
}
