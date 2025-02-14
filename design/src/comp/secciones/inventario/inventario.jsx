import React, { useEffect, useState } from "react";
import { tokenPass } from "../../formularios/iniciar-sesion/iniciar-sesion.jsx";
import axios from "axios";
import "./inventario.css";
import Encabezado from "../../encabezado-seccion/encabezado.jsx";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import DetallesOrden from "../../botones/abrir-detalles-orden/detalles-orden.jsx";
import ContTxt from "../../cards/card-detalle-pedido/cont-txt.jsx";

const cerrarInventario = "../../../../public/media/img/cerrar.png";

export default function Inventario() {
  useEffect(() => {
    mostrarInventario();
  }, []);

  /*Traer inventario*/
  const [inventarios, setInventarios] = useState([]);
  const mostrarInventario = async () => {
    try {
      const response = await axios.get("http://localhost:8080/inventario/all", {
        headers: {
          Authorization: `Bearer ${tokenPass}`,
        },
      });

      setInventarios(response.data);
      console.log(response.data);
    } catch {
      console.log("Error accediendo a inventario");
    }
  };

  /*Datos inventario*/
  const material = document.getElementById("material");
  const descripcion = document.getElementById("descripcion-material");
  const stock = document.getElementById("stock");
  const precioUnit = document.getElementById("precio-unitario");

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
  function crearInventario() {
    mostrarCrearInventario();
  }

  /*Mostrar editar inventario*/
  const [showEditarInventario, setShowEditarInventario] = useState(false);
  const [editarInvVisible, setEditarInvVisible] = useState(false);
  const [idMaterial, setIdMaterial] = useState(undefined);
  async function editarInventario(id_material) {
    if (id_material === idMaterial) {
      return;
    }
    if (showEditarInventario) {
      // Primero iniciamos la animación de desaparición
      setEditarInvVisible(false);

      // Esperamos a que termine la animación de desaparición
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Ocultamos el contenedor
      setShowEditarInventario(false);

      // Esperamos un momento mínimo
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Volvemos a mostrar el contenedor
      setShowEditarInventario(true);

      // Iniciamos la animación de aparición
      setTimeout(() => {
        setEditarInvVisible(true);
      }, 300);
    } else {
      // Si no se está mostrando, simplemente lo mostramos
      setShowEditarInventario(true);
      setTimeout(() => {
        setEditarInvVisible(true);
      }, 0);
    }
    setIdMaterial(id_material);
  }

  /*Ocultar editar inventario*/
  function hidenEditarInventario() {
    setEditarInvVisible(false);
    setIdMaterial(undefined);
    setTimeout(() => {
      setShowEditarInventario(false);
    }, 300);
  }

  return (
    <>
      <Encabezado
        titEncabezado={"Inventario"}
        conBtCrear={""}
        opc1={"Cliente"}
        opc2={"Prenda"}
        opc3={"Valor"}
        opc4={"N°"}
        onClick={mostrarCrearInventario}
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
            <span>Creando nuevo material</span>
            <SepXNegro />
            <section className="fila-detalles-ordenes">
              <ContTxt type={"text"} titulo={"Material:"} id={"material"} />
              <ContTxt
                type={"text"}
                titulo={"Descripcion"}
                id={"descripcion-material"}
              />
            </section>
            <section className="fila-detalles-ordenes">
              <ContTxt type={"number"} titulo={"Stock Actual:"} id={"stock"} />
              <ContTxt
                type={"number"}
                titulo={"Precio Unit"}
                id={"precio-unitario"}
              />
            </section>
            <button onClick={crearInventario}>Crear</button>
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
            <ContTxt type={"text"} titulo={"Material:"} id={"material"} />
            <ContTxt
              type={"text"}
              titulo={"Descripcion"}
              id={"descripcion-material"}
            />
          </section>
          <section className="fila-detalles-ordenes">
            <ContTxt type={"number"} titulo={"Stock Actual:"} id={"stock"} />
            <ContTxt
              type={"number"}
              titulo={"Precio Unit"}
              id={"precio-unitario"}
            />
          </section>
          <button>Editar</button>
        </div>
      )}
      <div className="cont-tabla tb-inventario">
        <table className="tabla">
          <thead className="th-tabla">
            <tr className="separacion-fila-head"></tr>
            <tr className="tr-encabezado">
              <th className="th">Cod. Prdc</th>
              <th className="th">Producto</th>
              <th className="th">Vrl. Uni</th>
              <th className="th">Cantidad</th>
              <th className="th">Ult. Actualizacion</th>
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
                  <td className="td">{inventario.descripcion}</td>
                  <td className="td">{inventario.stock_actual}</td>
                  <td className="td"></td>
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
