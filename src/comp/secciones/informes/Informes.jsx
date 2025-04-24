import "./Informes.css";
import { useEffect, useRef, useState } from "react";
import Encabezado from "../../encabezado-seccion/encabezado.jsx";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import TotalGrafico from "./total-grafico.jsx";
import { tokenPass } from "../../formularios/iniciar-sesion/iniciar-sesion.jsx";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

export default function Informe() {
  useEffect(() => {
    establecerFecha();
    traerDatos();
  }, []);

  // Establecer año y mes actual
  const añoRef = useRef(null);
  const mesRef = useRef(null);
  function establecerFecha() {
    const fecha = new Date();

    añoRef.current.value = fecha.getFullYear();
    mesRef.current.value = fecha.getMonth();
  }

  const [data, setData] = useState([]);
  const [totalIngresos, setTotalIngresos] = useState(null);
  const [totalGastos, setTotalGastos] = useState(null);
  const [totalSaldo, setTotalSaldo] = useState(null);
  /*Traer datos*/
  async function traerDatos() {
    // Valida que el año sea valido
    if (/^\d+$/.test(añoRef.current.value)) {
    } else {
      setData([]);
      setTimeout(() => {
        alert("El año debe ser una cadena de numeros");
      }, 10);
      return;
    }

    // Crear fecha del primer día del mes
    const primerDia = new Date(+añoRef.current.value, +mesRef.current.value, 1)
      .toISOString()
      .split("T")[0];

    // Crear fecha del último día del mes
    const ultimoDia = new Date(
      +añoRef.current.value,
      +mesRef.current.value + 1,
      0
    )
      .toISOString()
      .split("T")[0];

    try {
      const response = await axios.get(
        `http://localhost:8080/informe/mensual?fechaInicio=${primerDia}&fechaFin=${ultimoDia}`,
        {
          headers: {
            Authorization: `Bearer ${tokenPass}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error(error);
    }

    // Traer Totales
    try {
      const response = await axios.get(
        `http://localhost:8080/informe/total?fechaInicio=${primerDia}&fechaFin=${ultimoDia}`,
        {
          headers: {
            Authorization: `Bearer ${tokenPass}`,
          },
        }
      );
      setTotalIngresos(response.data.ingresos);
      setTotalGastos(response.data.gastos);
      setTotalSaldo(response.data.saldo);
    } catch (error) {
      console.error(error);
    }
  }

  // Función para convertir "2025-04-16" a "Miércoles 16"
  const formatearFecha = (fechaISO) => {
    const [year, month, day] = fechaISO.split("-").map(Number);
    const fecha = new Date(year, month - 1, day); // mes - 1 porque enero = 0
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      day: "numeric",
    })
      .format(fecha)
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Función para formatear valores en pesos colombianos
  const formatearCOP = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);

  // Agregar etiqueta con nombre del día
  const datosFormateados = data.map((item) => ({
    ...item,
    etiqueta: formatearFecha(item.fecha),
  }));

  async function traerExcell() {
    // Valida que el año sea valido
    if (/^\d+$/.test(añoRef.current.value)) {
    } else {
      alert("El año debe ser una cadena de numeros");
      return;
    }

    // Crear fecha del primer día del mes
    const primerDia = new Date(+añoRef.current.value, +mesRef.current.value, 1)
      .toISOString()
      .split("T")[0];

    // Crear fecha del último día del mes
    const ultimoDia = new Date(
      +añoRef.current.value,
      +mesRef.current.value + 1,
      0
    )
      .toISOString()
      .split("T")[0];

    try {
      const response = await axios.get(
        `http://localhost:8080/informe/excel?fechaInicio=${primerDia}&fechaFin=${ultimoDia}`,
        {
          headers: {
            Authorization: `Bearer ${tokenPass}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Encabezado
        titEncabezado={"Gastos"}
        conBtCrear={""}
        withSearch={"cont-buscador-none"}
        claseCont={"cont-buscador-informes"}
        claseBoton={"descargar-excell"}
        imgBoton={"../../../../public/media/img/excell.svg"}
        onClick={() => {
          traerExcell();
        }}
      >
        <span className="buscar-por-txt">Año: </span>
        <input
          type="text"
          maxLength="4"
          pattern="\d*"
          inputMode="numeric"
          className="inp-year"
          ref={añoRef}
          onBlur={() => {
            traerDatos();
          }}
        />
        <span className="buscar-por-txt">Mes: </span>
        <select
          className="inp-year"
          ref={mesRef}
          onChange={() => {
            traerDatos();
          }}
        >
          <option value="0">Enero</option>
          <option value="1">Febrero</option>
          <option value="2">Marzo</option>
          <option value="3">Abril</option>
          <option value="4">Mayo</option>
          <option value="5">Junio</option>
          <option value="6">Julio</option>
          <option value="7">Agosto</option>
          <option value="8">Septiembre</option>
          <option value="9">Octubre</option>
          <option value="10">Noviembre</option>
          <option value="11">Diciembre</option>
        </select>
      </Encabezado>
      <SepXNegro />
      <div className="cont-colores-grafico">
        <TotalGrafico
          bgColor={"green"}
          color={"grafico-green"}
          txt={`Ingresos: $ ${new Intl.NumberFormat("es-CO", {
            style: "decimal",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(totalIngresos)}`}
        />
        <TotalGrafico
          bgColor={"red"}
          color={"grafico-red"}
          txt={`Gastso: $ ${new Intl.NumberFormat("es-CO", {
            style: "decimal",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(totalGastos)}`}
        />
        <TotalGrafico
          bgColor={"blue"}
          color={"grafico-blue"}
          txt={`Saldo : $ ${new Intl.NumberFormat("es-CO", {
            style: "decimal",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(totalSaldo)}`}
        />
      </div>
      <div className="grafico-container">
        <ResponsiveContainer width="100%">
          <LineChart data={datosFormateados}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis
              dataKey="etiqueta"
              angle={-45}
              textAnchor="end"
              height={70}
              tick={{ fontSize: 12 }}
            />
            <YAxis tickFormatter={formatearCOP} width={94} />
            <Tooltip
              formatter={(value, name) => [
                `$ ${new Intl.NumberFormat("es-CO").format(value)}`,
                name.charAt(0).toUpperCase() + name.slice(1),
              ]}
              labelFormatter={(label) => `Fecha: ${label}`}
              cursor={{
                stroke: "#BFBFBF",
                strokeWidth: 2,
                strokeDasharray: "0",
              }}
            />
            <Line
              type="monotone"
              dataKey="ingresos"
              stroke="#2ecc71"
              strokeWidth={3}
              dot
            />
            <Line
              type="monotone"
              dataKey="gastos"
              stroke="#e74c3c"
              strokeWidth={3}
              dot
            />
            <Line
              type="monotone"
              dataKey="saldo"
              stroke="#3498db"
              strokeWidth={3}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
