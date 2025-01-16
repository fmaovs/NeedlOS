import "./estado-ordenes.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { tokenPass } from "../../../formularios/iniciar-sesion/iniciar-sesion";

export default function TbTodo() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const apiURL = "http://localhost:8080/orders/all";
      try {
        const response = await axios.get(apiURL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPass}`, // Incluimos el token en el encabezado Authorization
          },
        });
        // Mostrar todos los pedidos en la consola
        console.log(response.data);
        // Actualizar el estado con los pedidos obtenidos
        setOrders(response.data);
      } catch (error) {
        if (error.response) {
          setError(`Error en la respuesta: ${error.response.statusText}`);
        } else if (error.request) {
          setError("No se recibió respuesta del servidor.");
        } else {
          setError(`Error: ${error.message}`);
        }
      }
    };

    fetchOrders();
  }, []);

  /*MOSTRAR COMO PESO COLOMBIANO*/
  const formatoPesoColombiano = new Intl.NumberFormat("es-CO", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const valor = 70000;
  const valorFormateado = formatoPesoColombiano.format(valor);

  /*TRANSFORMAR LA FECHA*/
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Usar toLocaleString() para formatear la fecha y luego reemplazar la coma por un guion
    const formattedDate = date.toLocaleString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Esto asegura que use AM/PM
    });

    // Reemplazar la coma por un guion
    return formattedDate
      .replace(",", " -")
      .replace("a. m.", "AM")
      .replace("p. m.", "PM");
  };

  return (
    <div className="cont-tabla">
      <table className="tabla">
        <thead className="th-tabla">
          <tr className="separacion-fila-head"></tr>
          <tr className="tr-encabezado">
            <th className="th">N°</th>
            <th className="th"> Cliente </th>
            <th className="th">Telefono</th>
            <th className="th">Fecha radicacion</th>
            <th className="th">Fecha entrega</th>
            <th className="th"> Valor </th>
            <th className="th"> Prenda </th>
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
                  {order.prenda && order.prenda.length > 0
                    ? order.prenda
                        .slice(0, 2)
                        .map((p) => p.descripcion)
                        .join(", ") + (order.prenda.length > 2 ? "..." : "")
                    : "Sin prendas"}
                </td>
                <td className="td">{order.estado}</td>
              </tr>
              <tr className="separacion-fila"></tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
