import "./gastos.css";
import React, { useEffect, useRef, useState } from "react";
import { tokenPass } from "../../formularios/iniciar-sesion/iniciar-sesion.jsx";
import Encabezado from "../../encabezado-seccion/encabezado.jsx";
import Calendario from "../../calendario/nomina-calendario/nomina-calendario.jsx";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import { startOfWeek, endOfWeek } from "date-fns";
import axios from "axios";

export default function Gastos() {
  const [formData, setFormData] = useState({
    descripcion: "",
    monto: "",
    fecha: "",
  });

  const [error, setError] = useState("");
  const [gastos, setGastos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [empleados, setEmpleados] = useState([]);

  const categoriaRef = useRef(null);
  const empleadoRef = useRef(null);

  const [fechaDesde, setFechaDesde] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [fechaHasta, setFechaHasta] = useState(() =>
    endOfWeek(new Date(), { weekStartsOn: 1 })
  );

  useEffect(() => {
    cargarGastos();
    traerEmpleados();
  }, []);

  const cargarGastos = async () => {
    try {
      const res = await axios.get("http://localhost:8080/gastos/all", {
        headers: { Authorization: `Bearer ${tokenPass}` },
      });
      setGastos(res.data);
      setCargando(false);
    } catch (error) {
      console.error("Error al cargar gastos:", error);
    }
  };

  const traerEmpleados = async () => {
    try {
      const res = await axios.get("http://localhost:8080/users/all", {
        headers: { Authorization: `Bearer ${tokenPass}` },
      });
      setEmpleados(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoriaSeleccionada = categoriaRef.current.value;
    const empleadoSeleccionado = empleadoRef.current.value;

    if (
      !formData.descripcion ||
      !formData.monto ||
      !categoriaSeleccionada ||
      !empleadoSeleccionado
    ) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    const fechaFinal =
      formData.fecha || new Date().toISOString().split("T")[0];

    const nuevoGasto = {
      ...formData,
      fecha: fechaFinal,
      categoria: categoriaSeleccionada,
      empleadoId: empleadoSeleccionado,
    };

    console.log("Gasto a enviar:", nuevoGasto);
    try {
      const response = await axios.post(
        "http://localhost:8080/gastos/crear",
        nuevoGasto,
        {
          headers: {
            Authorization: `Bearer ${tokenPass}`,
          },
        }
      );

      alert("Gasto creado exitosamente");
      cargarGastos();

      setFormData({
        descripcion: "",
        monto: "",
        fecha: "",
      });

      if (categoriaRef.current) categoriaRef.current.value = "";
      if (empleadoRef.current) empleadoRef.current.value = "";
    } catch (error) {
      console.error(error);
      setError("Error al crear gasto");
    }
  };

  const renderTablaGastos = () => (
    <table className="tabla">
      <thead className="th-tabla">
        <tr className="separacion-fila-head"></tr>
        <tr className="tr-encabezado">
          <th className="th">Descripción</th>
          <th className="th">Monto</th>
          <th className="th">Fecha</th>
          <th className="th">Categoría</th>
          <th className="th">Empleado</th>
        </tr>
      </thead>
      <tbody>
        {gastos.map((gasto, index) => (
          <tr className="tr-gastos" key={index}>
            <td className="td-user">{gasto.descripcion}</td>
            <td className="td-user">${parseFloat(gasto.monto).toFixed(2)}</td>
            <td className="td-user">{gasto.fecha}</td>
            <td className="td-user">{gasto.categoria}</td>
            <td className="td-user">{gasto.empleado?.username || "No asignado"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <Encabezado
        titEncabezado={"Gastos"}
        claseCont={"cont-espacio-nomina"}
        conBtCrear={"none"}
        opc1={"Cliente"}
        opc2={"Prenda"}
        opc3={"Valor"}
        opc4={"N°"}
        withSearch={"cont-buscador-none"}
      >
        <Calendario
          selected={fechaDesde}
          onChange={setFechaDesde}
          desdeHasta={"Desde:"}
        />
        <div className="span-separacion">/</div>
        <Calendario
          selected={fechaHasta}
          onChange={setFechaHasta}
          desdeHasta={"Hasta:"}
        />
      </Encabezado>

      <SepXNegro />

      <form className="form" onSubmit={handleSubmit}>
      <div className="form-row">
          <div className="form-group">
            <label className="form-label">Descripción:</label>
            <input
              className="form-input"
              type="text"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Categoría:</label>
            <select ref={categoriaRef} defaultValue="" className="form-select">
              <option value="" disabled>Selecciona una categoría</option>
              <option value="ARRIENDO">Arriendo</option>
              <option value="AGUA">Agua</option>
              <option value="LUZ">Luz</option>
              <option value="GAS">Gas</option>
              <option value="TELEFONO">Teléfono</option>
              <option value="INTERNET">Internet</option>
              <option value="NOMINA">Nómina</option>
              <option value="GASOLINA">Gasolina</option>
              <option value="PLASTICOS">Plásticos</option>
              <option value="GANCHOS">Ganchos</option>
              <option value="PAPELERIA">Papelería</option>
              <option value="BOLSAS">Bolsas</option>
              <option value="MATERIAL">Material</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
              <option value="VALE">Vale</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Monto:</label>
            <input
              className="form-input"
              type="number"
              value={formData.monto}
              onChange={(e) =>
                setFormData({ ...formData, monto: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Empleado:</label>
            <select ref={empleadoRef} defaultValue="" className="form-select">
              <option value="">Selecciona un empleado</option>
              {empleados.map((empleado) => (
                <option key={empleado.id} value={empleado.id}>
                  {empleado.username}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="btn-crear">
          Crear Gasto
        </button>
      </form>

      {resultado && <div className="resultado">{resultado}</div>}

      <div className="tabla-cont">
        {!cargando && gastos.length > 0 && renderTablaGastos()}
      </div>
    </>
  );
}
