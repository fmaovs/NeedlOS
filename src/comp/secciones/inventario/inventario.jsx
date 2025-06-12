import React, { useEffect, useState } from "react";
import axios from "axios";
import "./inventario.css";
import Encabezado from "../../encabezado-seccion/encabezado.jsx";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import DetallesOrden from "../../botones/abrir-detalles-orden/detalles-orden.jsx";
import ContTxt from "../../cards/card-detalle-pedido/cont-txt.jsx";
import ContDetalle from "../../cards/card-detalle-pedido/cont-detalle.jsx";
import ContSelect from "../../cards/card-detalle-pedido/cont-select.jsx";

const cerrarInventario = "../../../../public/media/img/cerrar.png";
const ErrorMP3 = "../../../../public/media/sounds/error.mp3";

export default function Inventario() {
  useEffect(() => {
    mostrarInventario();
    insertarPrendas();
  }, []);

  /*Funcion mostrar error*/
  function sonidoError() {
    const soundError = new Audio(ErrorMP3);
    soundError.play();
  }

  /*Traer inventario*/
  const [inventarios, setInventarios] = useState([]);
  const mostrarInventario = async () => {
    try {
      const response = await axios.get("http://localhost:8080/inventario/all", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      const inventariosOrdenados = response.data.sort(
        (a, b) =>
          new Date(b.fecha_actualizacion) - new Date(a.fecha_actualizacion)
      );

      setInventarios(inventariosOrdenados);
    } catch {
      console.log("Error accediendo a inventario");
    }
  };

  /*Mostrar formulario de crear inventario*/
  const [formularioInventario, setFormularioInventario] = useState(false);
  const [formularioVisible, setFormularioVisible] = useState(false);
  async function mostrarCrearInventario() {
    if (showEditarInventario) {
      hidenEditarInventario();
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    if (formularioInventario === true) {
      setFormularioVisible(false);
      setTimeout(() => {
        setFormularioInventario(!formularioInventario);
      }, 300);
    } else {
      setFormularioInventario(!formularioInventario);
      setTimeout(() => {
        setFormularioVisible(!formularioVisible);
      }, 0);
    }
  }

  /*Creacion del inventario*/
  async function crearInventario() {
    /*Datos inventario*/
    const material = document.getElementById("material").value;
    const descripcion = document.getElementById("descripcion-material").value;
    const stock = +document.getElementById("stock").value;
    const precioUnit = +document.getElementById("precio-unitario").value;

    if (material === "") {
      sonidoError();
      await new Promise((resolve) => setTimeout(resolve, 0));
      setTimeout(() => {
        alert("Ingrese un nombre de material");
      }, 15);
      return;
    }

    if (descripcion === "") {
      sonidoError();
      await new Promise((resolve) => setTimeout(resolve, 0));
      setTimeout(() => {
        alert("Ingrese una descripción");
      }, 15);
      return;
    }

    // If para que el precio sea multiplo de 50 ni pueda ser 0
    if (precioUnit <= 0 || precioUnit % 50 !== 0) {
      sonidoError();
      await new Promise((resolve) => setTimeout(resolve, 0));
      setTimeout(() => {
        alert("Ingrese un valor unitario válido (multiplo de 50 y mayor a 0)");
      }, 15);
      return;
    }

    // if para que el stock sea mayor a 0
    if (stock <= 0) {
      sonidoError();
      await new Promise((resolve) => setTimeout(resolve, 0));
      setTimeout(() => {
        alert("Ingrese una cantidad válida (mayor a 0)");
      }, 15);
      return;
    }

    const nuevoMaterial = {
      nombre: material.toLowerCase(),
      descripcion: descripcion.toLowerCase(),
      precio: precioUnit,
      stockActual: stock,
    };

    console.log("Material creado.");
    console.log(nuevoMaterial);

    try {
      const response = await axios.post(
        "http://localhost:8080/inventario/nuevo",
        nuevoMaterial,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      await mostrarInventario();
    } catch (error) {
      console.log("No se pudo crear el materal", error);
    }
    mostrarCrearInventario();
  }

  /*Mostrar editar inventario*/
  const [showEditarInventario, setShowEditarInventario] = useState(false);
  const [editarInvVisible, setEditarInvVisible] = useState(false);
  const [idMaterial, setIdMaterial] = useState(undefined);

  const [descripcion, setDescripcion] = useState("");
  const [producto, setProducto] = useState("");
  const [stockActual, setStockActual] = useState("");

  /*Variable que almacenará el valor unitario del producto seleccionado*/
  const [valorUnitario, setValorUnitario] = useState(null);
  async function editarInventario(id_material) {
    if (id_material === idMaterial) {
      return;
    }

    setCalculoPresionado("");
    setStockActual("");
    setValorUnitario(null);

    if (showEditarInventario) {
      // Primero iniciamos la animación de desaparición
      setEditarInvVisible(false);

      // Esperamos a que termine la animación de desaparición
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Ocultamos el contenedor
      setShowEditarInventario(false);

      /*Reiniciar botones de suma/resta*/
      setIsResta(false);
      setIsSuma(false);
      setIsAñadir(undefined);
      setInicial(true);

      // Esperamos un momento mínimo
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Volvemos a mostrar el contenedor
      setShowEditarInventario(true);

      /*Mostrar detalles actuales*/
      try {
        const response = await axios.get(
          `http://localhost:8080/inventario/{id}?id=${id_material}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        /* Esperar a que el DOM se actualice */
        setTimeout(() => {
          setProducto(response.data.nombre);
          setDescripcion(response.data.descripcion);
          setStockActual(response.data.stockActual);
          setValorUnitario(response.data.precio);

          setEditarInvVisible(true);
        }, 0);
      } catch (error) {
        console.error(error);
      }

      // Iniciamos la animación de aparición
      setTimeout(() => {
        setEditarInvVisible(true);
      }, 300);
    } else {
      /*Reiniciar botones de suma/resta*/
      setIsResta(false);
      setIsSuma(false);
      // Mostramos el formulario de edición
      setShowEditarInventario(true);

      try {
        const response = await axios.get(
          `http://localhost:8080/inventario/{id}?id=${id_material}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        /* Esperar a que el DOM se actualice */
        setTimeout(() => {
          setProducto(response.data.nombre);
          setDescripcion(response.data.descripcion);
          setStockActual(response.data.stockActual);
          setValorUnitario(response.data.precio);

          setEditarInvVisible(true);
        }, 0);
      } catch {
        console.log("No se pudo acceder al material");
      }
    }

    setIdMaterial(id_material);
  }

  /*Ocultar editar inventario*/
  function hidenEditarInventario() {
    setEditarInvVisible(false);
    setIdMaterial(undefined);
    setDescripcion(undefined);
    setCalculoPresionado("");
    setStockActual("");
    setTimeout(() => {
      setShowEditarInventario(false);
      setIsResta(false);
      setIsSuma(false);
      setIsAñadir(undefined);
      setInicial(true);
      setValorUnitario(null);
    }, 300);
  }

  /*Mostrar Prendas en el select*/
  const [prendas, setPrendas] = useState([]);
  const insertarPrendas = async () => {
    try {
      const response = await axios.get("http://localhost:8080/prendas/all", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      setPrendas(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  /*Que mostrar dependiendo el caso*/
  const [isAñadir, setIsAñadir] = useState(undefined);
  const [inicial, setInicial] = useState(true);

  const [calculoPresionado, setCalculoPresionado] = useState("");
  const [isSuma, setIsSuma] = useState(false);
  const [isResta, setIsResta] = useState(false);
  async function asignarCalculo(operacion) {
    setCalculoPresionado(operacion);

    if (operacion === "-") {
      setIsSuma(false);
      setIsResta(true);
      setIsAñadir(false);
      setInicial(false);
    }

    if (operacion === "+") {
      setIsResta(false);
      setIsSuma(true);
      setIsAñadir(true);
      setInicial(false);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const precioUnit = document.getElementById("precio-unitario");
      precioUnit.value = valorUnitario;
    }
  }

  async function aplicarEditar() {
    if (calculoPresionado != "-" && calculoPresionado != "+") {
      sonidoError();
      await new Promise((resolve) => setTimeout(resolve, 0));
      setTimeout(() => {
        alert("Indique una accion Retirar/Añadir");
      }, 15);
      return;
    }

    const stock = +document.getElementById("stock").value;

    if (calculoPresionado === "-") {
      const idPrenda = document.getElementById(
        "select-inventario-prenda"
      ).value;

      if (idPrenda === "null") {
        sonidoError();
        await new Promise((resolve) => setTimeout(resolve, 0));
        setTimeout(() => {
          alert("Seleccione una prenda");
        }, 15);
        return;
      }

      if (stock <= 0) {
        sonidoError();
        await new Promise((resolve) => setTimeout(resolve, 0));
        setTimeout(() => {
          alert("El stock a retirar debe ser mayor a 0");
        }, 15);
        return;
      }

      if (stock >= stockActual) {
        sonidoError();
        await new Promise((resolve) => setTimeout(resolve, 0));
        setTimeout(() => {
          alert("El stock no puede quedar en 0");
        }, 15);
        return;
      }

      const idPrendaInt = parseInt(idPrenda);

      const retiroMaterial = {
        id_prenda: idPrendaInt,
        id_material: idMaterial,
        cantidad_usada: stock,
      };

      try {
        const response = await axios.put(
          "http://localhost:8080/inventario/Usando",
          retiroMaterial,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        console.log("Material Retirado");
        await mostrarInventario();
      } catch (error) {
        console.error(error);
      }
    }

    if (calculoPresionado === "+") {
      // Evaluar que el precio a ingresar el mayor de 0 y es multiplo de 50
      const precioUnit = +document.getElementById("precio-unitario").value;
      console.log(precioUnit);
      if (precioUnit <= 0 || precioUnit % 50 != 0) {
        sonidoError();
        await new Promise((resolve) => setTimeout(resolve, 0));
        setTimeout(() => {
          alert(
            "El precio unitario debe ser un numero mayor a 0 y multiplo de 50"
          );
        }, 15);
        return;
      }

      //Evaluar que el stock no sea 0
      if (stock <= 0) {
        sonidoError();
        await new Promise((resolve) => setTimeout(resolve, 0));
        setTimeout(() => {
          alert("El stock a ingresar debe ser mayor a 0");
        }, 15);
        return;
      }

      let idIngreso;
      try {
        const response = await axios.post(
          "http://localhost:8080/ingresos/nuevo",
          { claseIngreso: descripcion },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        console.log("Ingreso creado: ", response.data);
        idIngreso = response.data.id_ingreso;
      } catch (error) {
        console.error(error);
      }

      const ingresoMaterial = {
        id_material: idMaterial,
        id_ingreso: idIngreso,
        precio: valorUnitario,
        cantidad_ingresada: stock,
      };

      try {
        const response = await axios.put(
          "http://localhost:8080/inventario/ingresando",
          ingresoMaterial,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        console.log("Material añadido");
        await mostrarInventario();
      } catch (error) {
        console.error(error);
      }
    }

    hidenEditarInventario();
  }

  return (
    <>
      <Encabezado
        titEncabezado={"Inventario"}
        conBtCrear={""}
        opc1={"Código"}
        opc2={"Producto"}
        onClick={mostrarCrearInventario}
        imgBoton={"../../../../public/media/img/crear.png"}
      />
      <SepXNegro />
      {formularioInventario && (
        <div
          className={`cont-form-inventario ${
            formularioVisible ? "inventario-visible" : ""
          }`}
          onClick={mostrarCrearInventario}
        >
          <div
            className="form-inventario"
            onClick={(event) => event.stopPropagation()}
          >
            <span>Crear material</span>
            <SepXNegro />
            <section className="fila-detalles-ordenes">
              <ContTxt
                type={"text"}
                titulo={"Producto:"}
                id={"material"}
                placeholder={"Hilo"}
              />
              <ContTxt
                type={"text"}
                titulo={"Descripcion:"}
                id={"descripcion-material"}
                placeholder={"Rojo"}
              />
            </section>
            <section className="fila-detalles-ordenes">
              <ContTxt
                type={"number"}
                titulo={"Vlr. Uni:"}
                id={"precio-unitario"}
                placeholder={"$ 40.000"}
              />
              <ContTxt
                type={"number"}
                titulo={"Cantidad:"}
                id={"stock"}
                placeholder={"0"}
              />
            </section>
            <button onClick={crearInventario}>Crear Material</button>
          </div>
        </div>
      )}
      {showEditarInventario && (
        <div
          className={`form-inventario editar-material ${
            editarInvVisible ? "inventario-visible" : ""
          }`}
        >
          <button onClick={hidenEditarInventario}>
            <img src={cerrarInventario} />
          </button>
          <span>Editando material</span>
          <SepXNegro />
          <section className="fila-detalles-ordenes">
            <ContDetalle titulo={"Producto:"} txt={producto} />
            <ContDetalle titulo={"Descripcion:"} txt={descripcion} />
          </section>
          <span id="span-accion">Accion:</span>
          <section className="fila-detalles-ordenes">
            <button
              className={`sumar-restar ${isResta ? "resta-presionada" : ""}`}
              onClick={() => asignarCalculo("-")}
            >
              Descontar -
            </button>
            <button
              className={`sumar-restar ${isSuma ? "suma-presionada" : ""}`}
              onClick={() => asignarCalculo("+")}
            >
              Añadir +
            </button>
          </section>
          <section className="fila-detalles-ordenes">
            {isAñadir === true ? (
              <ContTxt
                type={"number"}
                titulo={"Vlr. Uni:"}
                id={"precio-unitario"}
              />
            ) : isAñadir === false ? (
              <ContSelect titulo={"Prenda:"} id={"select-inventario-prenda"}>
                <option value="null">Prenda...</option>
                {prendas.map((prenda) => (
                  <React.Fragment key={prenda.id}>
                    <option
                      value={prenda.id}
                    >{`${prenda.id}. ${prenda.descripcion}`}</option>
                  </React.Fragment>
                ))}
              </ContSelect>
            ) : null}
            {inicial && <ContDetalle titulo={""} txt={""} />}
            <ContTxt
              type={"number"}
              titulo={`Cantidad actual: ${stockActual}`}
              id={"stock"}
              placeholder={
                isResta
                  ? "Cantidad a descontar"
                  : isSuma
                  ? "Cantidad a añadir"
                  : ""
              }
            />
          </section>
          <button onClick={aplicarEditar}>Editar</button>
        </div>
      )}
      <div className="cont-tabla tb-inventario">
        <table className="tabla">
          <thead className="th-tabla">
            <tr className="separacion-fila-head"></tr>
            <tr className="tr-encabezado">
              <th className="th">Cod. Prdc</th>
              <th className="th">Producto</th>
              <th className="th">Descripción</th>
              <th className="th">Vrl. Uni</th>
              <th className="th">Cantidad</th>
              <th className="th">Ult. Actualización</th>
              <th className="th">Editar</th>
            </tr>
            <tr className="separacion-fila-head"></tr>
          </thead>
          <tbody className="body-tabla">
            {inventarios.map((inventario) => (
              <React.Fragment key={inventario.id_material}>
                <tr className="tr-body">
                  <td className="td">{inventario.id_material}</td>
                  <td className="td">{inventario.nombre}</td>
                  <td className="td">
                    {inventario.descripcion.length > 20
                      ? inventario.descripcion.slice(0, 20) + "..."
                      : inventario.descripcion}
                  </td>

                  <td className="td">
                    {`$ ${new Intl.NumberFormat("es-CO", {
                      style: "decimal",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(inventario.precio)}`}
                  </td>
                  <td className="td">{inventario.stockActual}</td>
                  <td className="td">
                    {new Date(inventario.fecha_actualizacion)
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
                  <td
                    className="td"
                    onClick={() => editarInventario(inventario.id_material)}
                  >
                    <DetallesOrden clase={"gris-boton"} />
                  </td>
                </tr>
                <tr className="separacion-fila"></tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
