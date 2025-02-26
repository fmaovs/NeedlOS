import "./arqueo-caja.css";
import Encabezado from "../../encabezado-seccion/encabezado.jsx";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import SepYNegroSmall from "../../separadores/sep-y-negro-small/sep-y-negro-small.jsx";
import CalendarioNomina from "../../calendario/nomina-calendario/nomina-calendario.jsx";
import Filtrador from "../../filtrador-seccion/filtrador-seccion.jsx";
import OpcionesFilter from "../../opciones-filter/opciones-filter.jsx";
import { useState } from "react";

const entradaPrendas = "../../../../public/media/img/ingresoPrendas.png";
const retiroPrendas = "../../../../public/media/img/retiroPrendas.png";
const maximizar = "../../../../public/media/img/maximizar.png";

export default function AqrueoCaja() {
  const [fecha1, setFecha1] = useState(null);
  const [fecha2, setFecha2] = useState(null);

  const [resumenIsVisible, setResumenIsVisible] = useState(false);
  const [resumenMax, setResumenMax] = useState(false);
  const [imageReverse, setImageReverse] = useState(false);
  const handleResumen = () => {
    if (resumenIsVisible) {
      setResumenMax();
      setImageReverse();
      setTimeout(() => {
        setResumenIsVisible();
      }, 300);
      return;
    }

    setResumenIsVisible(true);
    setImageReverse(true);
    setTimeout(() => {
      setResumenMax(true);
    }, 0);
  };
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
        <CalendarioNomina
          selected={fecha1}
          onChange={setFecha1}
          desdeHasta={"Desde:"}
        />
        <div className="span-separacion">/</div>
        <CalendarioNomina
          selected={fecha2}
          onChange={setFecha2}
          desdeHasta={"Hasta:"}
        />
      </Encabezado>
      <SepXNegro />
      <div className="cont-filterAndBoton">
        <Filtrador>
          <OpcionesFilter
            txtFilter={"Pedidos creados"}
            imgFilter={entradaPrendas}
            clase={"dos-diez"}
          />
          <OpcionesFilter
            txtFilter={"Dinero recaudado"}
            imgFilter={retiroPrendas}
            clase={"ocho-diez"}
          />
        </Filtrador>
      </div>
      {resumenIsVisible && (
        <div
          className={`cont-resumen-arqueo ${
            resumenMax ? "cont-resumen-arqueo-max" : ""
          }`}
        >
          <div className="head-resumen-arqueo">
            <span>Resumen entradas</span>
            <div className="sep-y-small-arqueo"></div>
            <span>Resumen gastos</span>
            <div className="sep-y-small-arqueo"></div>
            <span>Resumen ingresos</span>
          </div>
          <SepXNegro />
          <div className="cont-info-resumenes">
            <section className="section-resu-entradas">
              <table>
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr></tr>
                  <tr>
                    <td>Ordenes</td>
                    <td>8</td>
                  </tr>
                  <tr>
                    <td>Piezas</td>
                    <td>12</td>
                  </tr>
                  <tr>
                    <td>Valor Ord.</td>
                    <td>$78.000</td>
                  </tr>
                </tbody>
              </table>
            </section>
            <section className="section-resu-entradas">
              <table>
                <thead>
                  <tr>
                    <th>Novedad</th>
                    <th>Valor</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr></tr>
                  <tr>
                    <td>Vl. Eduardo Rodriguez</td>
                    <td>$697.000</td>
                    <td>13/09/2023</td>
                  </tr>
                  <tr>
                    <td>Vl. Camila Ramirez</td>
                    <td>$697.000</td>
                    <td>13/09/2023</td>
                  </tr>
                  <tr>
                    <td>Vl. Carlos Gaitan</td>
                    <td>$697.000</td>
                    <td>13/09/2023</td>
                  </tr>
                </tbody>
              </table>
            </section>
            <section className="section-resu-entradas resu-ingresos">
              <table>
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th>Concepto</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr></tr>
                  <tr>
                    <td rowspan="2">
                      <b>Órdenes</b>
                    </td>
                    <td>Órdenes entregadas</td>
                    <td>$78.000</td>
                  </tr>
                  <tr>
                    <td>Piezas entregadas</td>
                    <td>$78.000</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Gastos</b>
                    </td>
                    <td>Gastos</td>
                    <td>$78.000</td>
                  </tr>
                  <tr>
                    <td rowspan="3">
                      <b>Abonos</b>
                    </td>
                    <td>Abonos efectivo</td>
                    <td>$78.000</td>
                  </tr>
                  <tr>
                    <td>Abonos electrónicos</td>
                    <td>$78.000</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Total abonos</b>
                    </td>
                    <td>$78.000</td>
                  </tr>
                  <tr>
                    <td rowspan="3">
                      <b>Pagos</b>
                    </td>
                    <td>Pagos efectivo</td>
                    <td>$78.000</td>
                  </tr>
                  <tr>
                    <td>Pagos electrónicos</td>
                    <td>$78.000</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Total pagos</b>
                    </td>
                    <td>$78.000</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Ingresos</b>
                    </td>
                    <td>
                      <b>Total ingresos</b>
                    </td>
                    <td>$78.000</td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        </div>
      )}
      <button
        className={`buton-resumen-arqueo ${
          resumenIsVisible ? "buton-resumen-arqueo-open" : ""
        }`}
        onClick={handleResumen}
      >
        <img
          src={maximizar}
          className={`img-maximizar ${imageReverse ? "image-reversed" : ""}`}
        />
      </button>
      <div className="cont-tablas-arqueo">
        {/*Tabla prendas añadidas*/}
        <div className="cont-tabla tb-arqueo1">
          <table className="tabla min-wi-tb1">
            <thead className="th-tabla">
              <tr className="separacion-fila-head"></tr>
              <tr className="tr-encabezado">
                <th className="th">N° Ord</th>
                <th className="th">Sastre Asig.</th>
                <th className="th">Pzs</th>
                <th className="th">Vlr. Ord</th>
                <th className="th">Cliente</th>
              </tr>
              <tr className="separacion-fila-head"></tr>
            </thead>
            <tbody className="body-tabla"></tbody>
          </table>
        </div>

        {/*Tabla prendas retiradas*/}
        <div className="cont-tabla tb-arqueo2">
          <table className="tabla min-wi-tb2">
            <thead className="th-tabla">
              <tr className="separacion-fila-head"></tr>
              <tr className="tr-encabezado">
                <th className="th">N° Ord</th>
                <th className="th">Sastre Asig.</th>
                <th className="th">Pzs</th>
                <th className="th">Mvto</th>
                <th className="th">Vlr. Ord</th>
                <th className="th">Cliente</th>
                <th className="th">Fecha</th>
              </tr>
              <tr className="separacion-fila-head"></tr>
            </thead>
            <tbody className="body-tabla"></tbody>
          </table>
        </div>
      </div>
    </>
  );
}
