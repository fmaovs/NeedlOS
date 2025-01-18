import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { tokenPass } from "../iniciar-sesion/iniciar-sesion";
import "./crear-orden.css";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro";
import SepYNegro from "../../separadores/sep-y-negro/sep-y-negro";
import ContTxtForm from "../../section/cont-txt-form/cont-txt-form";
import TxtForm from "../../input/txt-form/txt-form";
import SpanForm from "../../parrafos/span-form/span-form";
import CustomDateInput from "../../calendario/calendario";
import CardPrenda from "../../card-prenda/card-prenda";

/*CARPETA PRENDAS*/
const prendasUbi = "../../../../public/media/img/prendas/";

export default function CrearOrden({ onClick }) {
  const [isVisible, setIsVisible] = useState(true);
  const [prendas, setPrendas] = useState([]);

  /*ANIMACION MOSTRAR FORMULARIO*/
  useEffect(() => {
    // Al cargar el componente, aseguramos que la animación de entrada se ejecute
    setIsVisible(true);
    mostrarPrendas();
  }, []);

  const handleExit = (event) => {
    // Verifica si el clic fue directamente en el contenedor "salir"
    if (event.target.classList.contains("salir")) {
      setIsVisible(false);
      setTimeout(onClick, 500); // Llama onClick después de que la animación termine
    }
  };

  /*INSERTAR NOMBRE SEGUN TELEFONO*/
  async function insertarNombre() {
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
      } else {
        // Si no se encuentra, mostrar un mensaje
        valueNombre.classList.add("err");
        valueApellido.classList.add("err");
      }
    } catch (error) {
      // Manejo de errores
      console.error("Error al obtener los clientes:", error);
      alert("Hubo un problema al obtener los datos");
    }
  }

  /*LLAMAR A PRENDAS*/
  const mostrarPrendas = async () => {
    try {
      const response = await axios.get("http://localhost:8080/prendas/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenPass}`,
        },
      });
      setPrendas(response.data); // Actualizar el estado con las prendas obtenidas
    } catch (error) {
      console.error("Error al cargar las prendas:", error);
    }
  };

  /*MANDAR ORDEN*/
  async function enviarOrden(event) {
    event.preventDefault();

    /*VARIBLES PARA LAS ORDENES*/
    let fechaPedido = new Date();
    let idCliente;
    let idPrenda;
    let cantidad = parseInt(document.getElementById("cantidad").value);
    let idSastre;
    let concepto = document.getElementById("detalles").value;
    let fechaEntrega;

    try {
      const valueTelefono = +document.getElementById("telefono").value;

      if (!valueTelefono || isNaN(valueTelefono)) {
        alert("Ingresa un número válido");
        return;
      }

      console.log("Buscando cliente");

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
      idCliente = response.data.id;
      console.log("Cliente encontrado ID: ", idCliente);
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
        console.log(createResponse.data)
        if (createResponse.status === 201) {
          idCliente = createResponse.data.id; // Asignar ID del cliente creado
          console.log("Nuevo Cliente creado ID: ", idCliente);
        } else {
          throw new Error("Error en la creación del cliente");
        }
      } catch (creationError) {
        console.error("Error al crear cliente:", creationError.message);
      }
    }

    console.log("-------------------------");
    console.log("FechaPedido", fechaPedido);
    console.log("IdCliente", idCliente);
    console.log("IdPrenda", idPrenda);
    console.log("Cantidad", cantidad);
    console.log("IdSastre", idSastre);
    console.log("Detalles", concepto);
    console.log("FechaEntrega", fechaEntrega);

    /*TRY PARA ASIGNAR LA PRENDA A LA VARIBALE*/
    /*
    try {
      const namePrenda = document.getElementById("producto");

      const response = await axios.get("http://localhost:8080/prendas/all", {
        headers: {
          Authorization: `Bearer ${tokenPass}`,
        },
      });

      //Filtrar prenda según nombre
      const prenda = response.data.find((p) => p.descripcion === namePrenda);

      if(prenda) {
        idPrenda = prenda.id
        console.log(idPrenda)
      }
    } catch {
      console.log("Error al cargar el id-prenda");
    }
    */

    /*
    const dataPedido = {
      date: new Date(fechaPedido).toString(),
      customerId: idCliente,
      detalles: [
        {
          prendaId: idPrenda,
          cantidad: cantidad,
          user: idSastre,
          concepto: concepto,
        },
      ],
      fechaEntrega: new Date(fechaEntrega).toISOString(),
    };
    */

    /*
    const crearPedido = async () => {
      try {
        const responsePedido = await axios.get(
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
      } catch {
        console.log("Error creando pedido");
      }
    };
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
              <select className="box-form six-2" id="">
                <option>Arreglo</option>
                <option>Confeccion</option>
              </select>
              <button className="seven">Agregar a lista</button>
            </ContTxtForm>
            <SepXNegro />
            <div className="tb-lista"></div>
            <SepXNegro />
            <div className="cont-dateEtc">
              <video
                className="camara"
                id="camara"
                autoPlay
                playsInline
                muted
              ></video>
              <div className="div-column">
                <CustomDateInput />
                <select className="select-form">
                  <option>. . .</option>
                  <option>Maria</option>
                  <option>Luis</option>
                  <option>Juliana</option>
                  <option>Carlos</option>
                </select>
              </div>
              <div className="div-column-full">
                <div className="div-row">
                  <SpanForm txt={"Dias"} insert={"8"} />
                  <SpanForm txt={"Pzs"} insert={"7"} />
                </div>
                <SpanForm txt={"Subtotal"} insert={"$ 85.000"} />
                <SpanForm txt={"Abono"} insert={"$ 20.000"} />
                <SpanForm txt={"Total"} insert={"$ 65.000"} />
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
