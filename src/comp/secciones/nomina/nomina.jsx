import "./nomina.css";
import axios from "axios";
import Encabezado from "../../encabezado-seccion/encabezado.jsx";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import Filtrador from "../../filtrador-seccion/filtrador-seccion.jsx";
import OpcionesFilter from "../../opciones-filter/opciones-filter.jsx";
import CalendarioNomina from "../../calendario/nomina-calendario/nomina-calendario.jsx";
import React, { useState } from "react";
import { useEffect } from "react";
import { startOfWeek, endOfWeek } from "date-fns";

const sastre = "../../../../public/media/img/sastre.png";
const dinero = "../../../../public/media/img/dinero.png";
const noEncontrado = "../../../../public/media/img/no-encontrado.png";

export default function Nomina() {
  /*Traer empleados*/
  const [empleados, setEmpleados] = useState([]);
  const traerEmpleados = async () => {
    try {
      const response = await axios.get("http://localhost:8080/users/all", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      setEmpleados(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    traerEmpleados();
  }, []);

  /*Asignar rango de fechas*/
  const [fechaDesde, setFechaDesde] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const [fechaHasta, setFechaHasta] = useState(() =>
    endOfWeek(new Date(), { weekStartsOn: 1 })
  );

  /*Traer resumen de cuenta de empleado*/
  const [empleadoPresionado, setEmpleadoPresionado] = useState(null);
  const [nominas, setNominas] = useState([]);
  const [totalPedidos, setTotalPedidos] = useState(null);
  const [vale, setVale] = useState(null);
  const [devengar, setDevengar] = useState(null);
  const [isVales, setIsVales] = useState(false);
  const [mostrarNoEncontrado, setMostrarNoEncontrado] = useState(false);
  const [seleccionaSastre, setSeleccionaSastre] = useState(true);
  async function resumenCuenta(id) {
    setEmpleadoPresionado(id);
    if (empleadoPresionado === id) {
      return;
    }

    let totalPedidos;
    let totalVales;

    try {
      const response = await axios.get(
        `http://localhost:8080/nomina/pedidos/${id}`,
        {
          params: {
            fechaInicio: fechaDesde.toISOString(),
            fechaFin: fechaHasta.toISOString(),
          },
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data);
      const total = response.data.reduce(
        (acc, item) => acc + (item.totalAbonos || 0),
        0
      );

      setIsVales(false);
      totalPedidos = total;
      if (nominas.length > 0) {
        setNominas([]);
        setTimeout(() => {
          setNominas(response.data);
          setIsVales(true);
          setTotalPedidos(total);
        }, 300);
      } else {
        setNominas(response.data);
        setIsVales(true);
        setTotalPedidos(total);
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/gastos/categoria/vales/semanal/empleado/${id}`,
        {
          params: {
            fechaInicio: fechaDesde.toISOString().split("T")[0],
            fechaFin: fechaHasta.toISOString().split("T")[0],
            categoria: "VALE",
          },
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      setVale(response.data);
      totalVales = response.data;
    } catch (error) {
      console.error(error);
    }

    setDevengar(totalPedidos - totalVales);
    setMostrarNoEncontrado(true);
    setSeleccionaSastre(false);
  }

  return (
    <>
      <Encabezado
        titEncabezado={"Nómina"}
        claseCont={"cont-espacio-nomina"}
        conBtCrear={"none"}
        opc1={"Cliente"}
        opc2={"Prenda"}
        opc3={"Valor"}
        opc4={"N°"}
        withSearch={"cont-buscador-none"}
      >
        <CalendarioNomina
          selected={fechaDesde}
          onChange={(nuevaFechaDesde) => {
            if (nuevaFechaDesde > fechaHasta) {
              alert("La fecha 'Desde' no puede ser mayor que la fecha 'Hasta'");
              return;
            }
            setFechaDesde(nuevaFechaDesde);
          }}
          desdeHasta={"Desde:"}
        />
        <div className="span-separacion">/</div>
        <CalendarioNomina
          selected={fechaHasta}
          onChange={(nuevaFechaHasta) => {
            if (nuevaFechaHasta < fechaDesde) {
              alert("La fecha 'Hasta' no puede ser menor que la fecha 'Desde'");
              return;
            }
            setFechaHasta(nuevaFechaHasta);
          }}
          desdeHasta={"Hasta:"}
        />
      </Encabezado>
      <SepXNegro />
      <div className="cont-filterAndBoton">
        <Filtrador>
          <OpcionesFilter
            txtFilter={"Sastres"}
            imgFilter={sastre}
            clase={"dos-diez"}
            tabIndex={"-1"}
          />
          <OpcionesFilter
            txtFilter={"Resumen Cuenta"}
            imgFilter={dinero}
            clase={"ocho-diez"}
            tabIndex={"-1"}
          />
        </Filtrador>
      </div>
      {/*Tabla empleado*/}
      <div className="cont-tablas-nomina">
        <div className="ocultar-scroll">
          <div className="cont-tabla tb-nomina">
            <table className="tabla tabla-nomina">
              <thead className="th-tabla">
                <tr className="separacion-fila-head"></tr>
                <tr className="tr-encabezado">
                  <th className="th">Empleado</th>
                  <th className="th">Cargo</th>
                </tr>
                <tr className="separacion-fila-head"></tr>
              </thead>
              <tbody className="body-tabla">
                {empleados.map((empleado) => (
                  <React.Fragment key={empleado.id}>
                    <tr
                      className={`tr-body tr-nomina ${
                        empleadoPresionado === empleado.id
                          ? "empleado-presionado"
                          : ""
                      }`}
                      onClick={() => resumenCuenta(empleado.id)}
                    >
                      <td className="td">
                        <button className="btn-resumen-nomina">{`${empleado.name} ${empleado.lastname}`}</button>
                      </td>
                      <td className="td" id="sastre-td">
                        {empleado.cargo.toLowerCase()}
                      </td>
                    </tr>
                    <tr className="separacion-fila"></tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/*Tabla resultado*/}
        <div className="cont-nomina-resumen-vales">
          <div className="ocultar-scroll2">
            <div className="cont-tabla tb-nomina-second">
              <table className="tabla">
                <thead className="th-tabla">
                  <tr className="separacion-fila-head"></tr>
                  <tr className="tr-encabezado">
                    <th className="th">N°</th>
                    <th className="th">Cliente</th>
                    <th className="th">Fecha radicacion</th>
                    <th className="th">Fecha entrega</th>
                    <th className="th">Valor</th>
                  </tr>
                  <tr className="separacion-fila-head"></tr>
                </thead>
                {seleccionaSastre && (
                  <span className="mensaje-sin-resultados-span">
                    Selecciona un sastre
                  </span>
                )}
                <tbody className="body-tabla">
                  {nominas.length === 0 && mostrarNoEncontrado ? (
                    <img
                      src={noEncontrado}
                      alt="Icono no encontrado"
                      className="mensaje-sin-resultados"
                    />
                  ) : (
                    nominas.map((nomina) => (
                      <React.Fragment key={nomina.id}>
                        <tr className="tr-body">
                          <td className="td">{nomina.id}</td>
                          <td className="td">{`${nomina.customerName} ${nomina.customerLastName}`}</td>
                          <td className="td">
                            {new Date(nomina.fechaPedido)
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
                            {new Date(nomina.fechaEntrega)
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
                          <td className="td td-nomina td-totalAbonos">
                            {`$ ${new Intl.NumberFormat("es-CO", {
                              style: "decimal",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(nomina.totalAbonos)}`}
                          </td>
                        </tr>
                        <tr className="separacion-fila"></tr>
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="cont-vales">
            <table className="tabla">
              <thead className="th-tabla">
                <tr className="separacion-fila-head"></tr>
                <tr className="tr-encabezado">
                  <th className="th">Total Pedidos</th>
                  <th className="th">Total Vales</th>
                  <th className="th">A Devengar</th>
                </tr>
                <tr className="separacion-fila-head"></tr>
              </thead>
              <tbody className="body-tabla">
                {isVales && (
                  <>
                    <tr className="tr-body">
                      <td className="td">
                        {`$ ${new Intl.NumberFormat("es-CO", {
                          style: "decimal",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(totalPedidos)}`}
                      </td>
                      <td className="td">
                        {`$ ${new Intl.NumberFormat("es-CO", {
                          style: "decimal",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(vale)}`}
                      </td>
                      <td className="td td-nomina">
                        {`$ ${new Intl.NumberFormat("es-CO", {
                          style: "decimal",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(devengar)}`}
                      </td>
                    </tr>
                    <tr className="separacion-fila"></tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
