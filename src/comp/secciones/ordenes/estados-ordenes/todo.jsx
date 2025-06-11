import "./estado-ordenes.css";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import WebCam from "react-webcam";
import DetallesOrden from "../../../botones/abrir-detalles-orden/detalles-orden";
import CardDetallePedido from "../../../cards/card-detalle-pedido/detalle-pedido";
import { set } from "date-fns";

const noEncontrado = "../../../../../public/media/img/no-encontrado.png";
const ErrorMP3 = "../../../../../public/media/sounds/error.mp3";

export default function TbTodo() {
  useEffect(() => {
    mostrarPedido();
  }, []);

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const mostrarPedido = async () => {
    try {
      const response = await axios.get("http://localhost:8080/orders/all", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
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

  /*FUNCION SONIDO ERROR*/
  function sonidoError() {
    const soundError = new Audio(ErrorMP3);
    soundError.play();
  }

  /*Fotos*/
  const [fotoIzVisible, setFotoIzVisible] = useState(false);
  const [fotoIzExist, setFotoIzExist] = useState(false);

  const [fotoDeVisible, setFotoDeVisible] = useState(false);
  const [fotoDeExist, setFotoDeExist] = useState(false);

  const [ftIzquierda, setFtIzquierda] = useState(null);
  const [ftDerecha, setFtDerecha] = useState(null);

  /*MOSTRAR DETALLES ORDEN*/
  const [detalles, setDetalles] = useState(null);
  const [detallesVisible, setDetallesVisible] = useState(false);
  const [mostrarDt, setMostrarDt] = useState(false);
  const [primerEstado, setPrimerEstado] = useState(null);
  const mostrarDetalles = async (id, estado) => {
    try {
      if (detallesVisible) {
        await ocultarDetalles();
      }

      // Obtenemos los nuevos datos
      const response = await axios.get(`http://localhost:8080/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      setPrimerEstado(response.data.estado);

      // Mostramos los nuevos detalles
      setDetallesVisible(true);
      setTimeout(() => {
        setDetalles(response.data);
        setMostrarDt(true);
      }, 15);

      if (response.data.estado === "FINALIZADO") {
        setIsFinalizado(true);
        setCamaraFotoEntrega(true);
        setTimeout(() => {
          setCamaraVisible(true);
        }, 0);
      }
    } catch (error) {
      console.log("Error obteniendo detalles:", error);
    }

    // Evaluar que mostrar segun el estado
    switch (estado) {
      case "EN_PROCESO":
        // Conseguir foto de entrada
        try {
          const response = await axios.get(
            `http://localhost:8080/orders/${id}/download-photo-entrega`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
              responseType: "blob",
            }
          );

          setFtDerecha(URL.createObjectURL(response.data));

          setFotoDeExist(true);
          setTimeout(() => {
            setFotoDeVisible(true);
          }, 15);
        } catch (error) {
          console.log("Error obteniendo foto:", error);
        }
        break;
      case "FINALIZADO":
        // Conseguir foto de entrada
        try {
          const response = await axios.get(
            `http://localhost:8080/orders/${id}/download-photo-entrega`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
              responseType: "blob",
            }
          );

          setFtDerecha(URL.createObjectURL(response.data));

          setFotoDeExist(true);
          setTimeout(() => {
            setFotoDeVisible(true);
          }, 15);
        } catch (error) {
          console.log("Error obteniendo foto:", error);
        }
        break;
      case "ENTREGADO":
        // Conseguir foto de entrada
        try {
          const response = await axios.get(
            `http://localhost:8080/orders/${id}/download-photo-entrega`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
              responseType: "blob",
            }
          );

          setFtDerecha(URL.createObjectURL(response.data));

          setFotoDeExist(true);
          setTimeout(() => {
            setFotoDeVisible(true);
          }, 15);
        } catch (error) {
          console.log("Error obteniendo foto:", error);
        }

        // Conseguir foto de salida
        try {
          const response = await axios.get(
            `http://localhost:8080/orders/${id}/download-photo-recogida`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
              responseType: "blob",
            }
          );

          setFtIzquierda(URL.createObjectURL(response.data));

          setFotoIzExist(true);
          setTimeout(() => {
            setFotoIzVisible(true);
          }, 15);
        } catch (error) {
          console.log("Error obteniendo foto:", error);
        }
        break;
      case "ANULADO":
        // Conseguir foto de entrada
        try {
          const response = await axios.get(
            `http://localhost:8080/orders/${id}/download-photo-entrega`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
              responseType: "blob",
            }
          );

          setFtDerecha(URL.createObjectURL(response.data));

          setFotoDeExist(true);
          setTimeout(() => {
            setFotoDeVisible(true);
          }, 15);
        } catch (error) {
          console.log("Error obteniendo foto:", error);
        }
        break;
    }
  };

  /*OCULTAR DETALLES ORDEN*/
  const ocultarDetalles = () => {
    return new Promise((resolve) => {
      setMostrarDt(false);
      setCamaraVisible(false);
      setFotoIzVisible(false);
      setFotoDeVisible(false);
      setTimeout(() => {
        setDetallesVisible(false);
        setCambiarColor("");
        setColorAnulado("");
        setPrimerEstado(null);
        setCamaraFotoEntrega(false);
        setFotoIzExist(false);
        setFotoDeExist(false);
        setIsFinalizado(false);
        resolve();
      }, 300);
    });
  };

  const [tiempoPresionado, setTiempoPresionado] = useState(null);
  const [tiempoPresionadoAnulado, setTiempoPresionadoAnulado] = useState(null);
  const [cambiarColor, setCambiarColor] = useState("");
  const [colorAnulado, setColorAnulado] = useState("");

  /*TOMAR FOTO*/
  const [camaraFotoEntrega, setCamaraFotoEntrega] = useState(false);
  const [camaraVisible, setCamaraVisible] = useState(false);
  const webcamRef = useRef(null);

  const tomarFoto = () => {
    if (webcamRef.current) {
      const imagenSrc = webcamRef.current.getScreenshot();

      if (imagenSrc) {
        const byteCharacters = atob(imagenSrc.split(",")[1]);
        const byteArrays = new Uint8Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteArrays[i] = byteCharacters.charCodeAt(i);
        }

        const blob = new Blob([byteArrays], { type: "image/png" });

        const formData = new FormData();
        formData.append("file", blob, "foto.png");

        return formData;
      }
    }
    return null;
  };

  /*CAMBIAR ESTADO DE ORDEN*/
  const [isFinalizado, setIsFinalizado] = useState(false);
  const cambiarEstado = async (estado) => {
    const fotoData = tomarFoto();
    if (estado === "EN_PROCESO") {
      try {
        const response = await axios.patch(
          `http://localhost:8080/orders/${detalles.id}/estado`,
          "FINALIZADO",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
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
    if (estado === "FINALIZADO") {
      //Valor a terminar de pagar
      const totalPedido = document.getElementById(
        "total-pedido-detalles"
      ).textContent;
      const totalPedidoInt = parseInt(totalPedido.replace(/[\$.]/g, ""), 10);

      //Metodo de pago
      const metPago = document.getElementById(
        "select-tipo-pago-entregado"
      ).value;

      if (metPago === "null") {
        sonidoError();
        await new Promise((resolve) => setTimeout(resolve, 0));
        setTimeout(() => {
          alert("Seleccione un metodo de pago");
        }, 10);
        return;
      }

      try {
        const response = await axios.patch(
          `http://localhost:8080/orders/${detalles.id}/estado`,
          "ENTREGADO",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data);
        setCambiarColor("oprimido");
        await mostrarPedido();
        setDetalles((prevDetalles) => ({
          ...prevDetalles,
          estado: "ENTREGADO",
        }));
      } catch (error) {
        console.log(error);
      }

      // Asignar foto recogida
      try {
        const response = await axios.post(
          `http://localhost:8080/orders/${detalles.id}/upload-photo-recogida`,
          fotoData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        console.log("Foto entrega asignada");
      } catch (error) {
        console.log(error);
      }

      //Asignar el resto del abono o pago
      try {
        const response = await axios.post(
          "http://localhost:8080/abonos",
          {
            idPedido: detalles.id,
            monto: totalPedidoInt,
            metodoPago: metPago,
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        console.log("Pago Completado Asignado");
      } catch (error) {
        console.error(error);
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
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
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

      setTimeout(() => {
        ocultarDetalles();
      }, 1000);
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
          idTotal={"total-pedido-detalles"}
          childrenSelect={
            isFinalizado ? (
              <select id="select-tipo-pago-entregado">
                <option value="null">MET. PAGO</option>
                <option value="EFECTIVO">EFECTIVO</option>
                <option value="NEQUI">NEQUI</option>
                <option value="DAVIPLATA">DAVIPLATA</option>
                <option value="BANCOLOMBIA">BANCOLOMBIA</option>
              </select>
            ) : null
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
      {camaraFotoEntrega && (
        <>
          <div
            className={`cont-camara-recibida-left ${
              camaraVisible ? "camara-isVisible" : ""
            }`}
          >
            <span className="tipo-foto">Foto Salida</span>
            <WebCam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              className={"camara-foto-recogida"}
            />
          </div>
        </>
      )}
      {fotoIzExist && (
        <>
          <div
            className={`cont-camara-recibida-left ${
              fotoIzVisible ? "camara-isVisible" : ""
            }`}
          >
            <span className="tipo-foto">Foto Salida</span>
            <img src={ftIzquierda} alt="" />
          </div>
        </>
      )}
      {fotoDeExist && (
        <>
          <div
            className={`cont-camara-recibida-right ${
              fotoDeVisible ? "camara-isVisible" : ""
            }`}
          >
            <span className="tipo-foto">Foto Entrada</span>
            <img src={ftDerecha} alt="" />
          </div>
        </>
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
                  <th className="th"> Teléfono </th>
                  <th className="th">Fecha radicación</th>
                  <th className="th">Fecha entrega</th>
                  <th className="th"> Valor </th>
                  <th className="th">Prenda</th>
                  <th className="th">Detalles</th>
                </tr>
                <tr className="separacion-fila-head"></tr>
              </thead>
              <tbody className="body-tabla">
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="tr-body">
                      <td className="td">{order.id}</td>
                      <td className="td">{`${order.customerName} ${order.customerLastName}`}</td>
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
                        }).format(order.saldo + order.totalAbonos)}`}
                      </td>
                      <td className="td">
                        {order.prenda
                          .slice(0, 2)
                          .map((p) => p.descripcion)
                          .join(", ") + (order.prenda.length > 2 ? "..." : "")}
                      </td>
                      <td
                        className="td"
                        onClick={() => mostrarDetalles(order.id, order.estado)}
                      >
                        {(() => {
                          switch (order.estado) {
                            case "EN_PROCESO":
                              return <DetallesOrden clase={"en-proceso"} />;
                            case "FINALIZADO":
                              return <DetallesOrden clase={"finalizado"} />;
                            case "ENTREGADO":
                              return <DetallesOrden clase={"entregado"} />;
                            case "ANULADO":
                              return <DetallesOrden clase={"anulado"} />;
                          }
                        })()}
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
