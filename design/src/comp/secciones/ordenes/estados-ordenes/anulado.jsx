import "./estado-ordenes.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { tokenPass } from "../../../formularios/iniciar-sesion/iniciar-sesion";
import DetallesOrden from "../../../botones/abrir-detalles-orden/detalles-orden";
import CardDetallePedido from "../../../cards/card-detalle-pedido/detalle-pedido";

const noEncontrado = "../../../../../public/media/img/no-encontrado.png";

export default function TbAnulado() {
  useEffect(() => {
    mostrarPedido();
  }, []);

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const mostrarPedido = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/orders/estado/anulado",
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
    } finally {
      setIsLoading(false);
    }
  };

  /*MOSTRAR DETALLES ORDEN*/
  const [detalles, setDetalles] = useState(null);
  const [detallesVisible, setDetallesVisible] = useState(false);
  const [mostrarDt, setMostrarDt] = useState(false);
  const [primerEstado, setPrimerEstado] = useState(null);
  const mostrarDetalles = async (id) => {
    try {
      if (detallesVisible) {
        await ocultarDetalles();
      }

      // Obtenemos los nuevos datos
      const response = await axios.get(`http://localhost:8080/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${tokenPass}`,
        },
      });

      setPrimerEstado(response.data.estado);

      // Mostramos los nuevos detalles
      setDetallesVisible(true);
      setTimeout(() => {
        setDetalles(response.data);
        setMostrarDt(true);
      }, 15);
    } catch (error) {
      console.log("Error obteniendo detalles:", error);
    }
  };

  /*OCULTAR DETALLES ORDEN*/
  const ocultarDetalles = () => {
    return new Promise((resolve) => {
      setMostrarDt(false);
      setTimeout(() => {
        setDetallesVisible(false);
        setCambiarColor("");
        setColorAnulado("");
        setPrimerEstado(null);
        resolve();
      }, 300);
    });
  };

  const [tiempoPresionado, setTiempoPresionado] = useState(null);
  const [tiempoPresionadoAnulado, setTiempoPresionadoAnulado] = useState(null);
  const [cambiarColor, setCambiarColor] = useState("");
  const [colorAnulado, setColorAnulado] = useState("");

  /*CAMBIAR ESTADO DE ORDEN*/
  const cambiarEstado = async (estado) => {
    if (estado === "EN_PROCESO") {
      try {
        const response = await axios.patch(
          `http://localhost:8080/orders/${detalles.id}/estado`,
          "FINALIZADO",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenPass}`,
            },
          }
        );
        console.log(response.data);
        setCambiarColor("oprimido");
        await mostrarPedido();
        setDetalles((prevDetalles) => ({
          ...prevDetalles,
          estado: "FINALIZADO",
        }));
      } catch (error) {
        console.log(error);
      }
    }

    setTimeout(() => {
      ocultarDetalles();
    }, 1000);
  };

  const botonPresionado = () => {
    setTiempoPresionado(Date.now());
  };
  const botonNOPresionado = () => {
    if (tiempoPresionado && Date.now() - tiempoPresionado > 300) {
      cambiarEstado(detalles.estado);
    }
    setTiempoPresionado(null);
  };

  /*CAMBIAR ESTADO NULO*/
  const estadoNulo = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/orders/${detalles.id}/estado`,
        "ANULADO",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPass}`,
          },
        }
      );
      console.log(response.data);
      setColorAnulado("oprimido");
      await mostrarPedido();
      setDetalles((prevDetalles) => ({
        ...prevDetalles,
        estado: "ANULADO",
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const botonPresionadoAnulado = () => {
    setTiempoPresionadoAnulado(Date.now());
  };
  const botonNOPresionadoAnulado = () => {
    if (tiempoPresionadoAnulado && Date.now() - tiempoPresionadoAnulado > 300) {
      estadoNulo(detalles.id);
    }
    setTiempoPresionadoAnulado(null);
  };

  return (
    <>
      {detallesVisible && detalles && (
        <CardDetallePedido
          nPedido={detalles.id}
          estado={mostrarDt}
          onClick={ocultarDetalles}
          nombre={detalles.customerName || "Desconocido"}
          apelliido={detalles.customerLastName || "Desconocido"}
          telefono={detalles.telefono || "N/A"}
          sastreAsignado={detalles.sastre || "Sin asignar"}
          tipoArreglo={detalles.concepto || "No especificado"}
          estadoPedido={(detalles.estado || "Desconocido").replace(/_/g, " ")}
          abono={
            "$ " + new Intl.NumberFormat("es-CO").format(detalles.totalAbonos)
          }
          totalPedido={
            "$ " + new Intl.NumberFormat("es-CO").format(detalles.saldo)
          }
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
          mostrarAnulado={detalles.estado}
          colorAnulado={colorAnulado}
          pedidoAnulado={detalles.estado}
          onMouseDownAnulado={botonPresionadoAnulado}
          onMouseUpAnulado={botonNOPresionadoAnulado}
          onMouseLeaveAnulado={() => setTiempoPresionadoAnulado(null)}
          estadoBoton={primerEstado}
          color={cambiarColor}
          onMouseDown={botonPresionado}
          onMouseUp={botonNOPresionado}
          onMouseLeave={() => setTiempoPresionado(null)}
        >
          {detalles.prenda?.map((prenda, index) => (
            <React.Fragment key={prenda.id || index}>
              <tr>
                <td>{prenda.cantidad}</td>
                <td>{prenda.detalle_pedido}</td>
                <td>{prenda.descripcion}</td>
                <td>
                  {"$ " +
                    new Intl.NumberFormat("es-CO").format(
                      prenda.valor / prenda.cantidad
                    )}
                </td>
                <td>
                  {"$ " + new Intl.NumberFormat("es-CO").format(prenda.valor)}
                </td>
              </tr>
              <tr className="last-row-tb-tarjeta-detalles"></tr>
            </React.Fragment>
          ))}
        </CardDetallePedido>
      )}
      <div className="cont-tabla">
        <table className="tabla">
          {isLoading ? null : orders.length > 0 ? (
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
                        {`$ ${new Intl.NumberFormat("es-CO", {
                          style: "decimal",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(order.saldo)}`}
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
                        <DetallesOrden clase={"anulado"} />
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
