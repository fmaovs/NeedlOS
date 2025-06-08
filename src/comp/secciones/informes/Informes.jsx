import "./Informes.css";
import { useEffect, useRef, useState } from "react";
import Encabezado from "../../encabezado-seccion/encabezado.jsx";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import TotalGrafico from "./total-grafico.jsx";
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

const pdf = "../../../../public/media/img/pdf.svg";

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
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
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
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
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
    const fecha = new Date(year, month - 1, day);

    const opciones = { weekday: "short", day: "numeric" };
    let texto = new Intl.DateTimeFormat("es-ES", opciones).format(fecha);

    // Reemplazar abreviaturas como "dom." por "Dom", "lun." por "Lun", etc.
    texto = texto
      .replace(".", "") // quitar el punto al final
      .replace(/^./, (str) => str.toUpperCase()); // capitaliza la primera letra

    return texto;
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

  async function traerPdf() {
    if (!/^\d+$/.test(añoRef.current.value)) {
      alert("El año debe ser una cadena de números");
      return;
    }

    const primerDia = new Date(+añoRef.current.value, +mesRef.current.value, 1)
      .toISOString()
      .split("T")[0];

    const ultimoDia = new Date(
      +añoRef.current.value,
      +mesRef.current.value + 1,
      0
    )
      .toISOString()
      .split("T")[0];

    try {
      const response = await axios.get(
        `http://localhost:8080/informe/pdf/mensual?fechaInicio=${primerDia}&fechaFin=${ultimoDia}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          responseType: "blob", // 👈 Esto es clave para que funcione
        }
      );

      // Crear blob y generar descarga
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
      const mesNombre = meses[+mesRef.current.value]; 

      link.setAttribute(
        "download",
        `Informe ${mesNombre} ${añoRef.current.value}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Limpieza
    } catch (error) {
      console.error("Error descargando PDF:", error);
      alert("Hubo un error al generar el PDF");
    }
  }

  return (
    <>
      <Encabezado
        titEncabezado={"Informes"}
        conBtCrear={""}
        withSearch={"cont-buscador-none"}
        claseCont={"cont-buscador-informes"}
        claseBoton={"descargar-excell"}
        imgBoton={pdf}
        onClick={() => {
          traerPdf();
        }}
        title={"Descargar PDF"}
      >
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
          txt={`Gastos: $ ${new Intl.NumberFormat("es-CO", {
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
            <YAxis
              tickFormatter={formatearCOP}
              width={94}
              domain={() => {
                const maxValor = Math.max(
                  ...datosFormateados.map((d) =>
                    Math.max(
                      Math.abs(d.ingresos || 0),
                      Math.abs(d.gastos || 0),
                      Math.abs(d.saldo || 0)
                    )
                  )
                );

                // Añadir 20% de margen y redondear al múltiplo de 25000 más cercano
                const maxAbsConMargen =
                  Math.ceil((maxValor * 1.1) / 10000) * 10000;

                return [-maxAbsConMargen, maxAbsConMargen];
              }}
              interval={0}
              tickCount={11}
            />
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
