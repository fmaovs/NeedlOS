import "./nomina.css";
import Encabezado from "../../encabezado-seccion/encabezado.jsx";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import Filtrador from "../../filtrador-seccion/filtrador-seccion.jsx";
import OpcionesFilter from "../../opciones-filter/opciones-filter.jsx";
import CalendarioNomina from "../../calendario/nomina-calendario/nomina-calendario.jsx";
import { useState } from "react";
import { useEffect } from "react";

const camisa = "../../../../public/media/img/camisa.png";
const dinero = "../../../../public/media/img/dinero.png";

export default function Nomina() {
  /*Traer resumen de cuenta de empleado*/
  const [cuentaEmpleado, setCuentaEmpleado] = useState([]);
  const [empleadoPresionado, setEmpleadoPresionado] = useState(false);
  function resumenCuenta() {
    setEmpleadoPresionado(true);
  }
  
  return (
    <>
      <Encabezado
        titEncabezado={"Nomina"}
        claseCont={"cont-espacio-nomina"}
        conBtCrear={"none"}
        opc1={"Cliente"}
        opc2={"Prenda"}
        opc3={"Valor"}
        opc4={"N°"}
        withSearch={"cont-buscador-none"}
      >
        <CalendarioNomina />
      </Encabezado>
      <SepXNegro />
      <div className="cont-filterAndBoton">
        <Filtrador>
          <OpcionesFilter
            txtFilter={"Entrada Prendas"}
            imgFilter={camisa}
            clase={"dos-diez"}
          />
          <OpcionesFilter
            txtFilter={"Resumen Cuenta"}
            imgFilter={dinero}
            clase={"ocho-diez"}
          />
        </Filtrador>
      </div>
      {/*Tabla empleado*/}
      <div className="cont-tablas-nomina">
        <div className="cont-tabla tb-nomina">
          <table className="tabla">
            <thead className="th-tabla">
              <tr className="separacion-fila-head"></tr>
              <tr className="tr-encabezado">
                <th className="th">Empleado</th>
                <th className="th">Cargo</th>
              </tr>
              <tr className="separacion-fila-head"></tr>
            </thead>
            <tbody className="body-tabla">
              <tr
                className={`tr-body tr-nomina ${
                  empleadoPresionado ? "empleado-presionado" : ""
                }`}
                onClick={resumenCuenta}
              >
                <td className="td">Pablo Rivas</td>
                <td className="td" id="sastre-td">
                  Sastre
                </td>
              </tr>
              <tr className="separacion-fila"></tr>
            </tbody>
          </table>
        </div>
        {/*Tabla resultado*/}
        <div className="cont-tabla tb-nomina">
          <table className="tabla">
            <thead className="th-tabla">
              <tr className="separacion-fila-head"></tr>
              <tr className="tr-encabezado">
                <th className="th">Concepto</th>
                <th className="th">Fecha</th>
                <th className="th">Valor</th>
              </tr>
              <tr className="separacion-fila-head"></tr>
            </thead>
            <tbody className="body-tabla">
              <tr className="tr-body">
                <td className="td">Arreglo</td>
                <td className="td">13/09/2024 - 02:15 PM</td>
                <td className="td td-nomina">$ 10.000</td>
              </tr>
              <tr className="separacion-fila"></tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
