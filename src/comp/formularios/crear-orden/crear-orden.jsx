import React, { useState, useEffect, useRef } from "react";
import { isDate } from "date-fns";
import printJS from "print-js";
import axios from "axios";
import WebCam from "react-webcam";
import "./crear-orden.css";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro";
import SepYNegro from "../../separadores/sep-y-negro/sep-y-negro";
import ContTxtForm from "../../section/cont-txt-form/cont-txt-form";
import TxtForm from "../../input/txt-form/txt-form";
import SpanForm from "../../parrafos/span-form/span-form";
import CustomDateInput from "../../calendario/custom-calendar/calendario";
import CardPrenda from "../../cards/card-prenda/card-prenda";
import basura from "../../../../public/media/img/basura.png";
import masNegro from "../../../../public/media/img/mas-negro.png";
import imprimirPedido from "../../../../public/media/img/imprimir-pedido.png";

/*CARPETA PRENDAS*/
const prendasUbi = "../../../../public/media/img/prendas/";
const Aprobado = "../../../../public/media/img/aprobado.png";
const ErrorMP3 = "../../../../public/media/sounds/error.mp3";
const PedidoCreado = "../../../../public/media/sounds/pedidoCreado.mp3";

export default function CrearOrden({ onClick, ejecutarFuncion }) {
  const [isVisible, setIsVisible] = useState(true);

  /*ANIMACION MOSTRAR FORMULARIO*/
  useEffect(() => {
    setIsVisible(true);
    mostrarPrendas();
    mostrarUsers();
    setCameraOn((prevState) => !prevState);
  }, []);

  /*SALIR DEL FORMULARIO*/
  const handleExit = (event) => {
    if (event.target.classList.contains("salir")) {
      setIsVisible(false);
      setTimeout(onClick, 300);
    }
    setCameraOn((prevState) => !prevState);
  };

  /*FUNCION SONIDO ERROR*/
  function sonidoError() {
    const soundError = new Audio(ErrorMP3);
    soundError.play();
  }

  /*ACCEDER A LA CAMARA Y TOMAR FOTO*/
  const webcamRef = useRef(null);
  const [foto, setFoto] = useState(null);
  const [fotoBlob, setFotoBlob] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const capturarFoto = (event) => {
    event.preventDefault();
    const imgSrc = webcamRef.current.getScreenshot();
    setFoto(imgSrc);

    /*Convertir base64 a blob*/
    /*Remover el prefijo data url*/
    const base64Data = imgSrc.split(",")[1];
    // Convertir base64 a array de bytes
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    // Crear Blob
    const blob = new Blob([byteArray], { type: "image/jpeg" });
    setFotoBlob(blob);
  };

  /*OBSERVAR EL CAMBIO DE FOTO Y ENVIA LA ORDEN*/
const [ordenEnProceso, setOrdenEnProceso] = useState(false)

  useEffect(() => {
    if (ordenEnProceso){
      return;
    } else if (fotoBlob) {
      setOrdenEnProceso(true);
      enviarOrden();
    }
  }, [fotoBlob]);

  /*INSERTAR NOMBRE SEGUN TELEFONO*/
  async function insertarNombre() {
    const valueNombre = document.getElementById("nombre");
    const valueApellido = document.getElementById("apellido");
    const contTelefono = document.getElementById("telefono");
    const valueTelefono = parseInt(document.getElementById("telefono").value);

    // Quitar por defecto el color
    valueNombre.classList.remove("err");
    valueApellido.classList.remove("err");
    contTelefono.classList.remove("err");

    // If para manejar el caso en el que en valueTelefono no haya nada
    if (!valueTelefono || isNaN(valueTelefono)) {
      return;
    }

    try {
      // Llamada a la API para obtener todos los clientes utilizando axios
      const response = await axios.get("http://localhost:8080/customers/all", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      // Filtrar el cliente cuyo teléfono coincida
      const customer = response.data.find((c) => c.phone === valueTelefono);

      if (customer) {
        // Si se encuentra el cliente, actualizamos el campo nombre
        valueNombre.value = customer.name;
        valueApellido.value = customer.lastname;
        valueNombre.classList.remove("err");
        valueApellido.classList.remove("err");
        contTelefono.classList.remove("err");
      } else {
        // Si no se encuentra, mostrar un mensaje
        valueNombre.classList.add("err");
        valueApellido.classList.add("err");
        contTelefono.classList.add("err");
      }
    } catch (error) {
      // Manejo de errores
      console.error("Error al obtener los clientes:", error);
      alert("Hubo un problema al obtener los datos");
    }
  }

  /*INSERTAR VALOR UNITARIO SEGUN NOMBRE PRENDA*/
  async function insertarValor() {
    const namePrenda = document.getElementById("producto").value.toLowerCase();
    let vlrUnit = document.getElementById("vlr-uni");
    try {
      const response = await axios.get("http://localhost:8080/prendas/all", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      const prenda = response.data.find((p) => p.descripcion === namePrenda);
      if (prenda) {
        const valorFormateado = new Intl.NumberFormat("es-CO").format(
          prenda.valor
        );
        vlrUnit.value = valorFormateado;
      }
    } catch {
      console.log("Error encontrando el valor de la prenda", error.message);
    }
  }

  /*LLAMAR A PRENDAS*/
  const [prendas, setPrendas] = useState([]);
  const mostrarPrendas = async () => {
    try {
      const response = await axios.get("http://localhost:8080/prendas/all", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      setPrendas(response.data); // Actualizar el estado con las prendas obtenidas
    } catch (error) {
      console.error("Error al cargar las prendas:", error);
    }
  };

  /*BOTON PRENDAS*/
  const botonPrenda = async (id) => {
    const txtNamePrenda = document.getElementById("producto");
    const txtValorPrenda = document.getElementById("vlr-uni");
    try {
      const response = await axios.get(`http://localhost:8080/prendas/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      txtNamePrenda.value = response.data.descripcion;
      const valorPrenda = response.data.valor;
      const valorPrendaFormat = new Intl.NumberFormat("es-CO").format(
        valorPrenda
      );
      txtValorPrenda.value = valorPrendaFormat;
    } catch (error) {
      console.log(error);
    }
  };

  /*TRY ASIGANR ID SASTRE*/
  const [users, setUsers] = useState([]);
  const mostrarUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/users/all", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      setUsers(response.data);
    } catch {
      console.log("Error buscando clientes", response.message);
    }
  };

  /*SELECCIONAR FECHA*/
  const [selectedDate, setSelectedDate] = useState(null);

  /*ASIGNAR DIAS RESTANTES*/
  const [numeroDias, setNumeroDias] = useState("0");
  function diasRestantes(date) {
    if (fechaPedido > date) {
      return;
    }

    const diferencia = date.getTime() - fechaPedido.getTime();

    const diasDiferencia = Math.ceil(
      diferencia / (1000 * 3600 * 24)
    ).toString();

    setNumeroDias(diasDiferencia);
  }

  /*LISTA DETALLES Y OBJETO A ENVIAR (VACIOS)*/
  const [filas, setFilas] = useState([]);
  let [dataPedido, setDataPedido] = useState({
    date: new Date(),
    customerId: null,
    detalles: [],
    fechaEntrega: null,
  });

  /*IMPRIMIR EL NUEVO ESTADO DEL PEDIDO*/
  useEffect(() => {
    /*console.log(dataPedido);*/
  }, [dataPedido]);

  /*ASIGNAR VALORES PIEZAS, SUBTOTAL, TOTAL*/
  const [piezasTotal, setPiezasTotal] = useState(null);
  const [subTotal, setSubtotal] = useState("");
  const [total, setTotal] = useState("");
  const [triggerEffect, setTriggerEffect] = useState(0);

  useEffect(() => {
    /* Asignar valor piezas */
    const piezasTotal = document.querySelectorAll(".td-cantidad");
    let totalPiezas = 0;

    piezasTotal.forEach((celdaPzs) => {
      const nPiezas = celdaPzs.textContent.trim();
      const nPiezasInt = parseInt(nPiezas, 10);

      totalPiezas += nPiezasInt;
    });
    setPiezasTotal(totalPiezas);

    /* Asignar valor subtotal */
    const valorTotal = document.querySelectorAll(".td-valor-total");
    let total = 0;

    valorTotal.forEach((celda) => {
      const valor = celda.textContent.trim().replace(/\./g, "");
      const valorInt = parseInt(valor, 10);

      total += valorInt;
    });
    const pesoCop = new Intl.NumberFormat("es-CO").format(total);
    setSubtotal(`$ ${pesoCop}`);

    /* Restar abono */
    const abonoValue = document.getElementById("abono")?.value || "";
    if (abonoValue !== "" && !isNaN(Number(abonoValue))) {
      const abono = +abonoValue;
      const resta = total - abono;
      const pesoCop = new Intl.NumberFormat("es-CO").format(resta);
      setTotal(`$ ${pesoCop}`);
    } else {
      setTotal(`$ ${pesoCop}`);
    }
  }, [dataPedido, triggerEffect]);

  /*CARGAR EL ABONO*/
  function calcTotal() {
    setTriggerEffect((prev) => prev + 1); // Forzar la ejecución del useEffect
  }

  /*FUNCION PARA AGREGAR LOS VALORES DE DETALLES A LA LISTA*/
  async function agregarDetalles(event) {
    event.preventDefault();

    /*VARIABLES PARA LA LISTA*/
    let idPrenda;
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const idSastre = parseInt(document.getElementById("select-sastre").value);
    const concepto = document.getElementById("detalles").value;
    const tipoTrabajo = document.getElementById("tipo-trabajo").value;

    /*VARIABLES PARA LA TABLA*/
    let producto;
    let vlrUnit;
    let vlrTotal;

    /*TRY PARA ASIGNAR LA PRENDA A LA VARIABLE*/
    try {
      const namePrenda = document.getElementById("producto").value;

      const response = await axios.get("http://localhost:8080/prendas/all", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      // Filtrar prenda según nombre
      const prenda = response.data.find((p) => p.descripcion === namePrenda);

      if (prenda) {
        idPrenda = prenda.id;
        producto = prenda.descripcion;
        vlrUnit = prenda.valor;
        vlrTotal = vlrUnit * cantidad;
      } else {
        sonidoError();
        await new Promise((resolve) => setTimeout(resolve, 0));
        setTimeout(() => {
          alert("La prenda debe ser valida");
        }, 10);
        return;
      }
    } catch {
      console.log("Error al cargar el id-prenda");
      return;
    }

    /*IF PARA QUE LA CANTIDAD NO PUEDE SER NAN O 0*/
    if (cantidad <= 0 || isNaN(cantidad)) {
      sonidoError();
      await new Promise((resolve) => setTimeout(resolve, 0));
      setTimeout(() => {
        alert("Cantidad posee dato inválido");
      }, 10);
      return;
    }

    /*IF PARA QUE LOS DETALLES NO SEAN NULOS*/
    if (concepto.trim() === "") {
      sonidoError();
      await new Promise((resolve) => setTimeout(resolve, 0));
      setTimeout(() => {
        alert("Los detalles no pueden ir vacios");
      }, 10);
      return;
    }

    /*IF PARA ASEGURARNOS QUE EL SASTRE ESTE SELECCIONADO*/
    if (!isFinite(idSastre)) {
      sonidoError();
      await new Promise((resolve) => setTimeout(resolve, 0));
      setTimeout(() => {
        alert("Selecciona un sastre");
      }, 10);
      return;
    }

    const nuevosDetalles = {
      prendaId: idPrenda,
      cantidad: cantidad,
      detallePedido: concepto,
      user: idSastre,
      concepto: tipoTrabajo,
    };

    // Actualizar el estado de 'dataPedido' de manera correcta
    setDataPedido((prevData) => ({
      ...prevData,
      detalles: [...prevData.detalles, nuevosDetalles], // Usamos spread para crear una nueva referencia
    }));

    //ACTUALIZAR LA LISTA
    setFilas((filasActuales) => {
      // Crear la nueva fila con la propiedad 'isAnimada' para aplicar la animación
      const nuevaFila = {
        cantidad: cantidad,
        detalles: concepto,
        producto: producto,
        vlrUnit: new Intl.NumberFormat("es-CO").format(vlrUnit),
        vlrTotal: new Intl.NumberFormat("es-CO").format(vlrTotal),
        isAnimada: true, // Marcamos que la fila está animada
      };

      // Agregar la nueva fila a las filas actuales
      return [...filasActuales, nuevaFila];
    });

    // Después de un tiempo, quitar la animación de la fila
    setTimeout(() => {
      setFilas((filasActuales) =>
        filasActuales.map((fila) =>
          fila.isAnimada ? { ...fila, isAnimada: false } : fila
        )
      );
    }, 150); // Tiempo de la animación (ajústalo según sea necesario)

    /*LIMPIAR LISTA*/
    document.getElementById("cantidad").value = "";
    document.getElementById("producto").value = "";
    document.getElementById("vlr-uni").value = "";
    document.getElementById("detalles").value = "";
  }

  /*ELIMINAR FILAS DE TABLA Y DATAPEDIDO*/
  function eliminarFila(index) {
    // Marcar la fila como eliminada en el estado antes de hacer la animación
    setFilas((filasActuales) =>
      filasActuales.map((fila, i) =>
        i === index ? { ...fila, isEliminado: true } : fila
      )
    );

    // Después de un tiempo, eliminar la fila completamente
    setTimeout(() => {
      setFilas((filasActuales) => filasActuales.filter((_, i) => i !== index));
      setDataPedido((prevData) => ({
        ...prevData,
        detalles: prevData.detalles.filter((_, i) => i !== index),
      }));
    }, 150);
  }

  /*VARIBLES PARA LAS ORDENES*/
  let fechaPedido = new Date(dataPedido.date);

  /*REINICIAR DATAPEDIDO*/
  function limpiarPedido() {
    /*Actualizar el estado del pedido a vacio*/
    setDataPedido({
      date: new Date(),
      customerId: null,
      detalles: [],
      fechaEntrega: null,
    });

    /*Vaciar campos nombre, apellido, telefono*/
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("telefono").value = "";

    /*Eliminar filas de la tabla*/
    setFilas((filasActuales) =>
      filasActuales.map((fila) => ({ ...fila, isEliminado: true }))
    );

    // Después de un tiempo, eliminar todas las filas completamente
    setTimeout(() => {
      setFilas([]);
      setDataPedido((prevData) => ({
        ...prevData,
        detalles: [],
      }));
    }, 150);

    /*Eliminar fecha entrega*/
    setNumeroDias("0");
    setSelectedDate(null);

    /*Elimina el abono*/
    document.getElementById("abono").value = "";
  }

  /*Mostrar notifiicacion*/
  const [notificacion, setNotificacion] = useState(false);
  const [notVisible, setNotVisible] = useState(false);

  /*Sonido notificacion*/
  const sonidoPedido = new Audio(PedidoCreado);

  /*MANDAR ORDEN*/
  let idOrden = null;
  async function enviarOrden() {
    console.log("Creando pedido...")

    /*EVALUA QUE HAYAN PRENDAS INGRESADAS*/
    if (dataPedido.detalles.length < 1) {
      sonidoError();
      await new Promise((resolve) => setTimeout(resolve, 0));
      setTimeout(() => {
        alert("Añada prendas a la lista");
      }, 10);
      return;
    }

    /*ASIGNAR FECHA ENTREGA*/
    if (isDate(selectedDate)) {
      /*IF PARA ASEGURARNOS QUE NO ES UNA FECHA MENOR A LA ACTUAL*/
      if (selectedDate.getTime() < fechaPedido.getTime()) {
        sonidoError();
        await new Promise((resolve) => setTimeout(resolve, 0));
        setTimeout(() => {
          alert("No se aceptan fechas anteriores al dia actual");
        });
        return;
      } else {
        dataPedido.date = fechaPedido.toISOString();
        dataPedido.fechaEntrega = selectedDate.toISOString();
      }
    } else {
      sonidoError();
      await new Promise((resolve) => setTimeout(resolve, 0));
      setTimeout(() => {
        alert("Ingrese una fecha");
      }, 10);
      return;
    }

    /*EXTRAER NOMBRE, APELLIIDO, TELEFONO, ID*/
    try {
      const valueTelefono = +document.getElementById("telefono").value;

      if (!valueTelefono || isNaN(valueTelefono)) {
        alert("Ingresa un número válido");
        return;
      }

      // Intenta buscar el cliente existente
      const response = await axios.get(
        "http://localhost:8080/customers/phone",
        {
          params: { phone: valueTelefono },
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      // Si encontramos el cliente, asignamos su ID
      dataPedido.customerId = response.data.id;
    } catch (error) {
      console.error("Cliente no encontrado, Creando...");

      // Obtener y validar campos
      const valueNombre = document
        .getElementById("nombre")
        .value.trim()
        .toLowerCase();
      const valueApellido = document
        .getElementById("apellido")
        .value.trim()
        .toLowerCase();
      const valueTelefono = +document.getElementById("telefono").value.trim();

      if (!valueNombre || !valueApellido || !valueTelefono) {
        let mensajeError = "Por favor completa los siguientes campos:\n";

        if (!valueNombre) mensajeError += "- Nombre\n";
        if (!valueApellido) mensajeError += "- Apellido\n";

        alert(mensajeError);
        return;
      }

      const nuevoCliente = {
        name: valueNombre,
        lastname: valueApellido,
        phone: valueTelefono,
      };

      try {
        const createResponse = await axios.post(
          "http://localhost:8080/customers",
          nuevoCliente,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        dataPedido.customerId = createResponse.data.id;
        console.error("Cliente creado ID = ", createResponse.data.id);
      } catch (creationError) {
        console.error("Error al crear cliente:", creationError.message);
      }
    }

    /*VERIFICAR SI EL ABONO ES VALIDO*/
    /*Datos para el abono*/
    let abono = +document.getElementById("abono").value;
    let valorSubtotal = +subTotal.replace("$", "").replace(".", "").trim();
    let tipoPago = document.getElementById("tipoPago").value;

    /*Verifica si el abono es un numero o es diferente de 0*/
    if (Number.isInteger(abono) && abono != 0) {
      /*Verifca que el abono no sea un numero negativo*/
      if (abono > 0) {
        /*Verifica que el abono no supere al Subtotal*/
        if (abono < valorSubtotal) {
          /*Verifica que el abono sea un multiplo de 50*/
          if (abono % 50 == 0) {
            /*Verifica el metodo de pago*/
            if (tipoPago != "null") {
              /*Asignar abono al pedido*/
            } else {
              sonidoError();
              await new Promise((resolve) => setTimeout(resolve, 0));
              setTimeout(() => {
                alert("Elige un metodo de pago");
              }, 10);
              return;
            }
          } else {
            sonidoError();
            await new Promise((resolve) => setTimeout(resolve, 0));
            setTimeout(() => {
              alert("La cantidad del abono no es multiplo de 50");
            }, 10);
            return;
          }
        } else {
          sonidoError();
          await new Promise((resolve) => setTimeout(resolve, 0));
          setTimeout(() => {
            alert("El Abono no puede ser mayor al subtotal");
          }, 10);
          return;
        }
      } else {
        sonidoError();
        await new Promise((resolve) => setTimeout(resolve, 0));
        setTimeout(() => {
          alert("El abono no puede ser negativo");
        }, 10);
        return;
      }
    }

    /*TRY PARA CREAR EL PEDIDO*/
    try {
      const responsePedido = await axios.post(
        "http://localhost:8080/orders",
        dataPedido,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (responsePedido.status >= 200 && responsePedido.status < 300) {
        idOrden = responsePedido.data.id;

        /*Aparecer notificacion*/
        setNotificacion(true);
        setTimeout(() => {
          setNotVisible(true);
          sonidoPedido.play();
        }, 0);
        /*Desaparecer notificacion*/
        setTimeout(() => {
          setNotVisible(false);
          setTimeout(() => {
            setNotificacion(false);
          }, 300);
        }, 3000);

        /*TRY PARA ASIGNAR LA FOTO AL PEDIDO*/
        try {
          const formData = new FormData();
          formData.append("file", fotoBlob);

          const response = await axios.post(
            `http://localhost:8080/orders/${idOrden}/upload-photo-entrega`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
            }
          );
        } catch (error) {
          console.error(error);
          return;
        }

        /*ASIGNAR ABONO*/
        if (Number.isInteger(abono) && abono != 0) {
          /*Variables Abono*/
          let DatosAbono = {
            idPedido: idOrden,
            monto: abono,
            metodoPago: tipoPago,
          };

          try {
            const response = await axios.post(
              "http://localhost:8080/abonos",
              DatosAbono,
              {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
              }
            );
            console.log("Abono asignado");
          } catch {
            console.log("Error Asignando abono");
          }
        }

        // Quitar colores campos
        const valueNombre = document.getElementById("nombre");
        const valueApellido = document.getElementById("apellido");
        const contTelefono = document.getElementById("telefono");
        valueNombre.classList.remove("err");
        valueApellido.classList.remove("err");
        contTelefono.classList.remove("err");

        try {
          // IMPRIMIR SASTRERIA
          const responseSastreria = await axios.get(
            `http://localhost:8080/orders/pdf/sastreria/{Id}?id=${idOrden}`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
              responseType: "blob",
            }
          );

          const fileSastreria = new Blob([responseSastreria.data], {
            type: "application/pdf",
          });
          const fileURLSastreria = URL.createObjectURL(fileSastreria);

          await new Promise((resolve) => {
            printJS({
              printable: fileURLSastreria,
              type: "pdf",
              onPrintDialogClose: () => {
                resolve();
              },
            });
          });

          // IMPRIMIR CLIENTE
          const responseCliente = await axios.get(
            `http://localhost:8080/orders/pdf/cliente/{Id}?id=${idOrden}`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
              responseType: "blob",
            }
          );

          const fileCliente = new Blob([responseCliente.data], {
            type: "application/pdf",
          });
          const fileURLCliente = URL.createObjectURL(fileCliente);

          await new Promise((resolve) => {
            printJS({
              printable: fileURLCliente,
              type: "pdf",
              onPrintDialogClose: () => {
                resolve();
              },
            });
          });
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(
        "Error al crear el pedido:",
        error.response?.data || error.message
      );
      return;
    }

    /*MOSTRAR ORDEN CREADA*/
    console.log(dataPedido);

    /*EJECUTAR FUNCION DE LIIMPIAR DATOS Y REFRESCAR*/
    limpiarPedido();
    ejecutarFuncion();
    
    /*CERRAR FORMULARIO*/
    setIsVisible(false);
    setCameraOn((prevState) => !prevState);
  }

  return (
    <div className={"salir"} onClick={handleExit}>
      <div className={`cont-form-crearOrden ${!isVisible ? "exit" : ""}`}>
        {notificacion && (
          <div
            className={`notificacion-orden ${
              notVisible ? "notiVisible" : "notiNotVisible"
            }`}
          >
            <img src={Aprobado} className="pedido-aprobado-img" />
            <span>Orden creada</span>
          </div>
        )}
        <div className="cont-tit-creandoP">
          <span className="tit-creandoP">Creando pedido</span>
        </div>
        <SepXNegro />
        <div className="cont-form-crearPedido">
          <form action="" className="form-crearPedido">
            <ContTxtForm className={"uno"}>
              <TxtForm
                type={"number"}
                className={"one"}
                placeholder={"Telefono..."}
                id={"telefono"}
                onBlur={insertarNombre}
              />
              <TxtForm
                type={"text"}
                className={"one-2"}
                placeholder={"Nombre..."}
                id={"nombre"}
              />
              <TxtForm
                type={"text"}
                className={"two"}
                placeholder={"Apellido..."}
                id={"apellido"}
              />
            </ContTxtForm>
            <ContTxtForm className={"dos"}>
              <TxtForm
                type={"number"}
                className={"box-form thre"}
                placeholder={"Cant..."}
                id={"cantidad"}
              />
              <TxtForm
                type={"text"}
                className={"box-form four"}
                placeholder={"Producto..."}
                id={"producto"}
                onBlur={insertarValor}
              />
              <TxtForm
                type={"number"}
                className={"box-form five"}
                placeholder={"Vlr. Unit..."}
                id={"vlr-uni"}
              />
            </ContTxtForm>
            <ContTxtForm className={"tres"}>
              <TxtForm
                type={"text"}
                className={"box-form six"}
                placeholder={"Detalles..."}
                id={"detalles"}
              />
              <select className="box-form six-2" id="tipo-trabajo">
                <option value="arreglo">Arreglo</option>
                <option value="confeccion">Confeccion</option>
              </select>
              <select className="box-form six-2" id="select-sastre">
                <option className="option" value="null">
                  Sastre
                </option>
                {users.map((user) => (
                  <option className="option" key={user.id} value={user.id}>
                    {`${user.name} ${user.lastname}`}
                  </option>
                ))}
              </select>
              <button className="seven" onClick={agregarDetalles}>
                <img src={masNegro} alt="Simbolo sumar" />
              </button>
            </ContTxtForm>
            <SepXNegro />
            <div className="tb-lista">
              <table className="tb-detalles" id="tb-detalles">
                <thead>
                  <tr className="sep-fila-detalles-2"></tr>
                  <tr>
                    <th className="th-detalles">Cant.</th>
                    <th className="th-detalles">Detalles</th>
                    <th className="th-detalles"> Producto </th>
                    <th className="th-detalles"> Vlr.Unit </th>
                    <th className="th-detalles"> Vlr.Total </th>
                    <th className="th-detalles">
                      <img src={basura} className="img-basura" />
                    </th>
                  </tr>
                  <tr className="sep-fila-detalles-2"></tr>
                </thead>
                <tbody id="detalles-body">
                  {filas.map((fila, index) => (
                    <React.Fragment key={index}>
                      <tr
                        className={`fila-detalles ${
                          fila.isEliminado ? "fila-eliminada" : ""
                        } 
          ${fila.isAnimada ? "fila-animada" : ""}`}
                      >
                        <td className="td-detalles td-cantidad">
                          {fila.cantidad}
                        </td>
                        <td className="td-detalles">{fila.detalles}</td>
                        <td className="td-detalles">{fila.producto}</td>
                        <td className="td-detalles">{fila.vlrUnit}</td>
                        <td className="td-detalles td-valor-total">
                          {fila.vlrTotal}
                        </td>
                        <td
                          className="td-detalles"
                          onClick={() => eliminarFila(index)}
                        >
                          <button className="btn-eliminar-fila" type="button">
                            <img
                              src={basura}
                              className="img-basura"
                              alt="eliminar"
                            />
                          </button>
                        </td>
                      </tr>
                      <tr className="sep-fila-detalles"></tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <SepXNegro />
            <div className="cont-dateEtc">
              <div className="camara">
                <WebCam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/png"
                  height={206}
                  width={206}
                />
              </div>
              <div className="div-column-full">
                <div className="div-row">
                  <SpanForm txt={"Dias:"} id={"dias"} insert={numeroDias} />
                  <SpanForm txt={"Pzs:"} id={"piezas"} insert={piezasTotal} />
                </div>
                <SpanForm txt={"Subtotal:"} id={"subtotal"} insert={subTotal} />
                <SpanForm
                  txt={"Abono:"}
                  onHover={"on"}
                  label={"abono"}
                  cursor={"onCursor"}
                >
                  <input
                    type="number"
                    id="abono"
                    className="inp-abono"
                    onBlur={calcTotal}
                    placeholder="$ 0.000... *"
                  />
                </SpanForm>
                <SpanForm txt={"Total:"} id={"total"} insert={total} />
              </div>
              <div className="div-column">
                <CustomDateInput
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    diasRestantes(date);
                  }}
                />
                <select className="tipoPago" id="tipoPago">
                  <option value="null">Met. Pago?</option>
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="NEQUI">Nequi</option>
                  <option value="DAVIPLATA">Daviplata</option>
                  <option value="BANCOLOMBIA">BanColom</option>
                </select>
                <button className="clean-print" onClick={capturarFoto}>
                  <img src={imprimirPedido} alt="simbolo imprimir" />
                  <span>Crear</span>
                </button>
              </div>
            </div>
          </form>
          <SepYNegro />
          <div className="cont-prendas">
            {prendas.map((prenda) => (
              <CardPrenda
                key={prenda.id}
                id={prenda.id}
                name={prenda.descripcion}
                imgPrenda={`${prendasUbi}${prenda.descripcion}.png`}
                onClick={() => botonPrenda(prenda.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
