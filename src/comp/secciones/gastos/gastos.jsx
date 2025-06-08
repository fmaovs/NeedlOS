import "./gastos.css";
import Encabezado from "../../encabezado-seccion/encabezado.jsx";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const Mas = "../../../../public/media/img/crear.png";

export default function Gastos() {
  // Primer render
  useEffect(() => {
    traerGastos();
    traerEmpleados();
  }, []);

  // Estado Formulario y funcion ocultar
  const [formularioVisible, setFormularioVisible] = useState(false);
  const ocultarFormulario = (e) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    setFormularioVisible(!formularioVisible);
  };

  // Traer todos los gastos
  const [gastos, setGastos] = useState([]);
  const traerGastos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/gastos/all", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      setGastos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Traer todos los empleados
  const [empleados, setEmpleados] = useState([]);
  const traerEmpleados = async () => {
    try {
      const response = await axios.get("http://localhost:8080/users/all", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setEmpleados(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Referencia de los campos
  const usuarioRef = useRef(null);
  const categoriaRef = useRef(null);
  const montoRef = useRef(null);
  const descripcionRef = useRef(null);

  // Funcion crear gasto
  const crearGasto = async () => {
    // Validaciones de datos
    if (usuarioRef.current.value === "none") {
      alert("Selecciona un usuario");
      return;
    }

    if (categoriaRef.current.value === "none") {
      alert("Selecciona una categoria");
      return;
    }

    if (montoRef.current.value <= 0 || montoRef.current.value % 50 !== 0) {
      alert("El debe ser un numero mayor a 0 multiplo de 50");
      return;
    }

    if (descripcionRef.current.value.length < 5) {
      alert("Especifica una descripcion");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/gastos/crear",
        {
          descripcion: descripcionRef.current.value.toLowerCase(),
          monto: montoRef.current.value,
          categoria: categoriaRef.current.value,
          empleadoId: usuarioRef.current.value,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      traerGastos();
      setFormularioVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Encabezado
        titEncabezado={"Gastos"}
        opc1={"Usuario"}
        opc2={"Categoria"}
        imgBoton={Mas}
        onClick={() => setFormularioVisible(true)}
      />
      <SepXNegro />
      {formularioVisible && (
        <div className="modal-backdrop" onClick={ocultarFormulario}>
          <form className="form-gasto">
            <span className="tit-creandoP tit-form">Registrar Gasto</span>
            <SepXNegro />
            <div className="cont-form-group">
              <div className="form-group">
                <label className="form-label" htmlFor="usuario">
                  Usuario
                </label>
                <select
                  id="usuario"
                  className="form-input no-capitalize"
                  ref={usuarioRef}
                >
                  <option value="none">Seleccione un usuario</option>
                  {empleados.map((empleado) => (
                    <option
                      key={empleado.id}
                      value={empleado.id}
                    >{`${empleado.name} ${empleado.lastname}`}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="categoria">
                  Categoria
                </label>
                <select
                  id="categoria"
                  className="form-input no-capitalize"
                  ref={categoriaRef}
                >
                  <option value="none">Seleccione una categoria</option>
                  <option value="AGUA">Agua</option>
                  <option value="ARRIENDO">Arriendo</option>
                  <option value="BOLSAS">Bolsas</option>
                  <option value="GANCHOS">Ganchos</option>
                  <option value="GAS">Gas</option>
                  <option value="GASOLINA">Gasolina</option>
                  <option value="INTERNET">Internet</option>
                  <option value="LUZ">Luz</option>
                  <option value="MANTENIMIENTO">Mantenimiento</option>
                  <option value="MATERIAL">Material</option>
                  <option value="NOMINA">Nómina</option>
                  <option value="PAPELERIA">Papelería</option>
                  <option value="PLASTICOS">Plásticos</option>
                  <option value="TELEFONO">Teléfono</option>
                  <option value="VALE">Vale</option>
                </select>
              </div>
            </div>
            <div className="cont-form-group">
              <div className="form-group">
                <label className="form-label" htmlFor="monto">
                  Monto
                </label>
                <input
                  id="monto"
                  ref={montoRef}
                  type="number"
                  className="form-input"
                  placeholder="$0.000"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="descripcion">
                  Descripcion
                </label>
                <input
                  id="descripcion"
                  ref={descripcionRef}
                  className="form-input"
                  placeholder="Arriendo"
                />
              </div>
            </div>
            <button
              className="btn-crear-usuario"
              type="button"
              onClick={() => crearGasto()}
            >
              Crear Gasto
            </button>
          </form>
        </div>
      )}
      <div className="cont-tabla tb-inventario">
        <table className="tabla">
          <thead className="th-tabla">
            <tr className="separacion-fila-head"></tr>
            <tr className="tr-encabezado">
              <th className="th">Usuario</th>
              <th className="th">Categ.</th>
              <th className="th">Descripcion</th>
              <th className="th">Valor</th>
              <th className="th">Fecha</th>
            </tr>
            <tr className="separacion-fila-head"></tr>
          </thead>
          <tbody className="body-tabla">
            {gastos.map((gasto, index) => (
              <React.Fragment key={index}>
                <tr className="tr-body">
                  <td className="td">
                    {(empleados.find((emp) => emp.id === gasto.empleadoId)
                      ?.name || "") +
                      " " +
                      (empleados.find((emp) => emp.id === gasto.empleadoId)
                        ?.lastname || "")}
                  </td>
                  <td className="td">{gasto.categoria.toLowerCase()}</td>
                  <td className="td">
                    {gasto.descripcion.length > 20
                      ? gasto.descripcion.slice(0, 20) + "..."
                      : gasto.descripcion}
                  </td>

                  <td className="td">{gasto.monto}</td>
                  <td className="td">
                    {new Date(gasto.fecha).toLocaleDateString("en-US")}
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
