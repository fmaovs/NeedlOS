import React, { useState, useEffect } from "react";
import { isDate } from "date-fns";
import { tokenPass } from "../iniciar-sesion/iniciar-sesion";
import axios from "axios";
import "./crear-orden.css";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro";
import SepYNegro from "../../separadores/sep-y-negro/sep-y-negro";
import ContTxtForm from "../../section/cont-txt-form/cont-txt-form";
import TxtForm from "../../input/txt-form/txt-form";
import SpanForm from "../../parrafos/span-form/span-form";
import CustomDateInput from "../../calendario/calendario";
import CardPrenda from "../../card-prenda/card-prenda";
import basura from "../../../../public/media/img/basura.png";

/*CARPETA PRENDAS*/
const prendasUbi = "../../../../public/media/img/prendas/";

export default function CrearOrden({ onClick }) {
  const [isVisible, setIsVisible] = useState(true);

  /*ANIMACION MOSTRAR FORMULARIO*/
  useEffect(() => {
    // Al cargar el componente, aseguramos que la animación de entrada se ejecute
    setIsVisible(true);
    mostrarPrendas();
    mostrarUsers();
  }, []);

  /*SALIR DEL FORMULARIO*/
  const handleExit = (event) => {
    // Verifica si el clic fue directamente en el contenedor "salir"
    if (event.target.classList.contains("salir")) {
      setIsVisible(false);
      setTimeout(onClick, 500); // Llama onClick después de que la animación termine
    }
  };

  /*INSERTAR NOMBRE SEGUN TELEFONO*/
  async function insertarNombre() {
    const contTelefono = document.getElementById("telefono");
    const valueTelefono = parseInt(document.getElementById("telefono").value);
    const valueNombre = document.getElementById("nombre");
    const valueApellido = document.getElementById("apellido");

    try {
      // Llamada a la API para obtener todos los clientes utilizando axios
      const response = await axios.get("http://localhost:8080/customers/all", {
        headers: {
          Authorization: `Bearer ${tokenPass}`,
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
    const namePrenda = document.getElementById("producto").value;
    let vlrUnit = document.getElementById("vlr-uni");
    try {
      const response = await axios.get("http://localhost:8080/prendas/all", {
        headers: {
          Authorization: `Bearer ${tokenPass}`,
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
          Authorization: `Bearer ${tokenPass}`,
        },
      });
      setPrendas(response.data); // Actualizar el estado con las prendas obtenidas
    } catch (error) {
      console.error("Error al cargar las prendas:", error);
    }
  };

  /*TRY ASIGANR ID SASTRE*/
  const [users, setUsers] = useState([]);
  const mostrarUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/users/all", {
        headers: {
          Authorization: `Bearer ${tokenPass}`,
        },
      });
      setUsers(response.data);
    } catch {
      console.log("Error buscando clientes", response.message);
    }
  };

  /*SELECCIONAR FECHA*/
  const [selectedDate, setSelectedDate] = useState(null);

  /*LISTA DETALLES Y OBJETO A ENVIAR (VACIOS)*/
  let fechaPedidotoISO = new Date().toISOString();
  const [filas, setFilas] = useState([]);
  let [dataPedido, setDataPedido] = useState({
    date: new Date(),
    customerId: null,
    detalles: [],
    fechaEntrega: null,
  });

  useEffect(() => {}, [dataPedido]); // Observa los cambios en dataPedido

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
          Authorization: `Bearer ${tokenPass}`,
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
        alert("La prenda debe ser valida");
        return;
      }
    } catch {
      console.log("Error al cargar el id-prenda");
      return;
    }

    /*IF PARA QUE LA CANTIDAD NO PUEDE SER NAN O 0*/
    if (cantidad <= 0 || isNaN(cantidad)) {
      alert("Cantidad posee dato inválido");
      return;
    }

    /*IF PARA QUE LOS DETALLES NO SEAN NULOS*/
    if (concepto.trim() === "") {
      alert("Los detalles no pueden ir vacios");
      return;
    }

    /*IF PARA ASEGURARNOS QUE EL SASTRE ESTE SELECCIONADO*/
    if (!isFinite(idSastre)) {
      alert("Selecciona un sastre");
      return;
    }

    const nuevosDetalles = {
      prendaId: idPrenda,
      cantidad: cantidad,
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

  /*MANDAR ORDEN*/
  async function enviarOrden(event) {
    event.preventDefault();

    /*VARIBLES PARA LAS ORDENES*/
    let fechaPedido = new Date(dataPedido.date);
    let idCliente;

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
            Authorization: `Bearer ${tokenPass}`,
          },
        }
      );

      // Si encontramos el cliente, asignamos su ID
      dataPedido.customerId = response.data.id;
    } catch (error) {
      // Si no se encontró el cliente (error 404), creamos uno nuevo
      console.error(
        "Error al buscar cliente, creando uno nuevo:",
        error.message
      );

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
              Authorization: `Bearer ${tokenPass}`,
            },
          }
        );
        console.log(createResponse.data);
        if (createResponse.status === 200) {
          idCliente = createResponse.data.id; // Asignar ID del cliente creado
          console.log("Nuevo Cliente creado ID: ", idCliente);
        } else {
          throw new Error("Error en la creación del cliente");
        }
      } catch (creationError) {
        console.error("Error al crear cliente:", creationError.message);
      }
    }

    /*ASIGNAR FECHA ENTREGA*/
    if (isDate(selectedDate)) {
      /*IF PARA ASEGURARNOS QUE NO ES UNA FECHA MENOR A LA ACTUAL*/
      if (selectedDate.getTime() < fechaPedido.getTime()) {
        alert("No se aceptan fechas anteriores al dia actual");
        return;
      } else {
        dataPedido.date = fechaPedido.toISOString();
        dataPedido.fechaEntrega = selectedDate.toISOString();
      }
    } else {
      alert("Ingrese una fecha");
      return;
    }

    console.log(dataPedido);

    /*
    try {
      const responsePedido = await axios.post(
        "http://localhost:8080/orders",
        dataPedido,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPass}`,
          },
        }
      );

      //Mostrar resultado
      console.log("Pedido Creado", responsePedido.dataPedido);
    } catch (error) {
      console.log(
        "Error creando pedido:",
        error.response ? error.response.data : error.message
      );
    }
    */
  }

  return (
    <div className={"salir"} onClick={handleExit}>
      <div className={`cont-form-crearOrden ${!isVisible ? "exit" : ""}`}>
        <div className="cont-tit-creandoP">
          <span className="tit-creandoP">Creando pedido</span>
        </div>
        <SepXNegro />
        <div className="cont-form-crearPedido">
          <form action="" className="form-crearPedido">
            <ContTxtForm className={"uno"}>
              <TxtForm
                type={"text"}
                className={"one"}
                placeholder={"Nombre..."}
                id={"nombre"}
              />
              <TxtForm
                type={"text"}
                className={"one-2"}
                placeholder={"Apellido..."}
                id={"apellido"}
              />
              <TxtForm
                type={"number"}
                className={"two"}
                placeholder={"Telefono..."}
                id={"telefono"}
                onBlur={insertarNombre}
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
                onBlur={insertarValor}
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
              <button className="seven" onClick={agregarDetalles}>
                Agregar a lista
              </button>
            </ContTxtForm>
            <SepXNegro />
            <div className="tb-lista">
              <table className="tb-detalles">
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
                        <td className="td-detalles">{fila.cantidad}</td>
                        <td className="td-detalles">{fila.detalles}</td>
                        <td className="td-detalles">{fila.producto}</td>
                        <td className="td-detalles">{fila.vlrUnit}</td>
                        <td className="td-detalles">{fila.vlrTotal}</td>
                        <td
                          className="td-detalles"
                          onClick={() => eliminarFila(index)}
                        >
                          <img
                            src={basura}
                            className="img-basura"
                            alt="eliminar"
                          />
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
              <video
                className="camara"
                id="camara"
                autoPlay
                playsInline
                muted
              ></video>
              <div className="div-column-2">
                <CustomDateInput
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                />
                <select className="select-form" id="select-sastre">
                  <option className="option" value="null">
                    Sastre
                  </option>
                  {users.map((user) => (
                    <option className="option" key={user.id} value={user.id}>
                      {`${user.name} ${user.lastname}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="div-column-full">
                <div className="div-row">
                  <SpanForm txt={"Dias:"} id={"dias"} insert={"8"} />
                  <SpanForm txt={"Pzs:"} id={"piezas"} insert={"7"} />
                </div>
                <SpanForm
                  txt={"Subtotal:"}
                  id={"subtotal"}
                  insert={"$ 85.000"}
                />
                <SpanForm
                  txt={"Abono:"}
                  onHover={"on"}
                  label={"abono"}
                  cursor={"onCursor"}
                >
                  <input type="number" id="abono" className="inp-abono" />
                </SpanForm>
                <SpanForm txt={"Total:"} id={""} insert={"$ 65.000"} />
              </div>
              <div className="div-column">
                <button className="clean-print">Limpiar</button>
                <button className="clean-print" onClick={enviarOrden}>
                  Imprimir
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
