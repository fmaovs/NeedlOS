import "./arqueo-caja.css";
import Encabezado from "../../encabezado-seccion/encabezado.jsx";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import Filtrador from "../../filtrador-seccion/filtrador-seccion.jsx";
import OpcionesFilter from "../../opciones-filter/opciones-filter.jsx";
import React, { useEffect, useState } from "react";
import axios from "axios";

const entradaPrendas = "../../../../public/media/img/ingresoPrendas.png";
const retiroPrendas = "../../../../public/media/img/retiroPrendas.png";
const maximizar = "../../../../public/media/img/maximizar.png";

export default function ArqueoCaja() {
  const [resumenIsVisible, setResumenIsVisible] = useState(true);
  const [resumenMax, setResumenMax] = useState(true);
  const [imageReverse, setImageReverse] = useState(true);
  const handleResumen = () => {
    if (resumenIsVisible) {
      setResumenMax(false);
      setImageReverse(false);
      setTimeout(() => {
        setResumenIsVisible(false);
      }, 300);
      return;
    }

    setResumenIsVisible(true);
    setImageReverse(true);
    setTimeout(() => {
      setResumenMax(true);
    }, 0);
  };

  const [pedidosCreadosHoy, setPedidosCreadosHoy] = useState([]);
  const [totalOrdenes, setTotalOrdenes] = useState(0);
  const [totalPzs, setTotalPzs] = useState(0);
  const [totalVlrPedido, setTotalVlrPedido] = useState(0);
  /*Traer los pedidos creados de hoy*/
  async function traerPedidosCreadosHoy() {
    const fecha = new Date();
    const fechaLocal = new Date(
      fecha.getTime() - fecha.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    try {
      const response = await axios.get(
        `http://localhost:8080/arqueo/pedidos/${fechaLocal}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      const pedidosOrdenados = response.data.sort(
        (a, b) => new Date(b.fechaPedido) - new Date(a.fechaPedido)
      );

      setTotalOrdenes(response.data.length);
      setTotalPzs(
        response.data.reduce(
          (acumulador, pedido) =>
            acumulador +
            pedido.prenda.reduce((sum, prenda) => sum + prenda.cantidad, 0),
          0
        )
      );
      setTotalVlrPedido(
        response.data.reduce(
          (acumulador, pedido) =>
            acumulador + pedido.saldo + pedido.totalAbonos,
          0
        )
      );

      setPedidosCreadosHoy(pedidosOrdenados);
    } catch (error) {
      console.error(error);
    }
  }

  /*Traer los pedidos entregados de hoy*/
  const [ordEntregadas, setOrdenesEntregadas] = useState(0);
  const [pzsEntregadas, setPzsEntregadas] = useState(0);
  const [pedidosEntregados, setPedidosEntregados] = useState([]);
  async function traerPedidosEntregado() {
    const fecha = new Date();
    const fechaLocal = new Date(
      fecha.getTime() - fecha.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    try {
      const response = await axios.get(
        `http://localhost:8080/arqueo/pedidos/abonos/${fechaLocal}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      setPedidosEntregados(response.data);
      setOrdenesEntregadas(response.data.length);
      setPzsEntregadas(
        response.data.reduce(
          (total, pedido) =>
            total +
            pedido.prenda.reduce((sum, prenda) => sum + prenda.cantidad, 0),
          0
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  /*Traer los gastos de hoy*/
  const [gastos, setGastos] = useState([]);
  const [totGastos, setTotGastos] = useState(null);
  async function traerGastos() {
    const fecha = new Date();
    const fechaLocal = new Date(
      fecha.getTime() - fecha.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    try {
      const response = await axios.get(
        `http://localhost:8080/gastos/detalles/dia?D%C3%ADa=${fechaLocal}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      setTotGastos(
        response.data.reduce((acumulador, gasto) => acumulador + gasto.monto, 0)
      );
      asignarNameEmpleado(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  /*Asignar nombre empleado segun id*/
  const [empleados, setEmpleados] = useState([]);
  async function asignarNameEmpleado(gastos) {
    for (let gasto of gastos) {
      let id = gasto.empleadoId;
      try {
        const response = await axios.get(`http://localhost:8080/users/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        gasto.empleadoId = `${response.data.name} ${response.data.lastname}`;
        setTimeout(() => {
          setGastos(gastos);
        }, 20);
      } catch (error) {
        console.error(error);
      }
    }
  }

  /*Traer los abonos y pago efectivo*/
  const [ingresosEfetivo, setIngresosEfectivo] = useState(0);
  const [ingresosElectronico, setIngresosElectronico] = useState(0);
  /*Traer pago/abono efectivo*/
  async function traerEfectivo() {
    const fecha = new Date();
    const fechaLocal = new Date(
      fecha.getTime() - fecha.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    let abonoEfectivo;
    let pagoEfectivo;

    /*Traer abonos efectivo*/
    try {
      const response = await axios.get(
        `http://localhost:8080/arqueo/abonos/efectivo/${fechaLocal}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      abonoEfectivo = response.data.reduce(
        (acumulador, pedido) => acumulador + pedido.monto,
        0
      );
    } catch (error) {
      console.error(error);
    }

    /*Traer pagos efectivo*/
    try {
      const response = await axios.get(
        `http://localhost:8080/arqueo/abonos/entregados/efectivo/${fechaLocal}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      pagoEfectivo = response.data.reduce(
        (acumulador, pedido) => acumulador + pedido.monto,
        0
      );
    } catch (error) {
      console.error(error);
    }

    setIngresosEfectivo(abonoEfectivo + pagoEfectivo);
  }

  /*Traer abono/pago electronico*/
  async function traerEletronico() {
    const fecha = new Date();
    const fechaLocal = new Date(
      fecha.getTime() - fecha.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    let abonoElectronico;
    let pagoElectronico;

    /*Traer abonos electronicos*/
    try {
      const response = await axios.get(
        `http://localhost:8080/arqueo/abonos/electronico/${fechaLocal}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      abonoElectronico = response.data.reduce(
        (acumulador, pedido) => acumulador + pedido.monto,
        0
      );
    } catch (error) {
      console.error(error);
    }

    /*Traer pagos electronicos*/
    try {
      const response = await axios.get(
        `http://localhost:8080/arqueo/abonos/entregados/electronico/${fechaLocal}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      pagoElectronico = response.data.reduce(
        (acumulador, pedido) => acumulador + pedido.monto,
        0
      );
    } catch (error) {
      console.error(error);
    }

    setIngresosElectronico(abonoElectronico + pagoElectronico);
  }

  useEffect(() => {
    traerPedidosCreadosHoy();
    traerPedidosEntregado();
    traerGastos();
    traerEfectivo();
    traerEletronico();
  }, []);

  return (
    <>
      <Encabezado
        titEncabezado={"Arqueo caja"}
        claseCont={"cont-espacio-arqueo"}
        conBtCrear={"none"}
        opc1={"Cliente"}
        opc2={"Prenda"}
        opc3={"Valor"}
        opc4={"N°"}
        withSearch={"cont-buscador-none"}
      ></Encabezado>
      <SepXNegro />
      <div className="cont-filterAndBoton">
        <Filtrador>
          <OpcionesFilter
            txtFilter={"Pedidos creados"}
            imgFilter={entradaPrendas}
            clase={"dos-diez"}
          />
          <OpcionesFilter
            txtFilter={"Pedidos entregados"}
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
            <section className="section-resu-entradas resu-entradas">
              <table>
                <thead>
                  <tr>
                    <th>Conpto</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr></tr>
                  <tr>
                    <td>Ordenes</td>
                    <td>{totalOrdenes}</td>
                  </tr>
                  <tr>
                    <td>Piezas</td>
                    <td>{totalPzs}</td>
                  </tr>
                  <tr>
                    <td>Vlr. Ord</td>
                    <td>
                      {`$ ${new Intl.NumberFormat("es-CO", {
                        style: "decimal",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(totalVlrPedido)}`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
            <section className="section-resu-entradas resu-gastos">
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
                  {gastos.map((gasto, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{`Vl. ${gasto.empleadoId}`}</td>
                        <td>{`$ ${new Intl.NumberFormat("es-CO", {
                          style: "decimal",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(gasto.monto)}`}</td>
                        <td>
                          {new Date(gasto.fecha).toLocaleDateString("es-CO", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </section>

            {/*Tabla resumen ingresos*/}
            <section className="section-resu-entradas resu-ingresos">
              <table>
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th>Ingreso Neto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr></tr>
                  <tr>
                    <td>
                      <b>ORD. ENTG</b>
                      {` ${ordEntregadas}`}
                    </td>
                    <td>
                      <b>EFV</b>
                      {` $ ${new Intl.NumberFormat("es-CO", {
                        style: "decimal",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(ingresosEfetivo)}`}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>PZS. ENTG</b>
                      {` ${pzsEntregadas}`}
                    </td>
                    <td>
                      <b>ELC</b>
                      {` $ ${new Intl.NumberFormat("es-CO", {
                        style: "decimal",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(ingresosElectronico)}`}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>GTS</b>
                      {` $ ${new Intl.NumberFormat("es-CO", {
                        style: "decimal",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(totGastos)}`}
                    </td>
                    <td>
                      <b>TA</b>
                      {` $ ${new Intl.NumberFormat("es-CO", {
                        style: "decimal",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(ingresosEfetivo + ingresosElectronico)}`}
                    </td>
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
                <th className="th">N°</th>
                <th className="th">Sastre Asig.</th>
                <th className="th">Pzs</th>
                <th className="th">Vlr. Ord</th>
                <th className="th">Cliente</th>
              </tr>
              <tr className="separacion-fila-head"></tr>
            </thead>
            <tbody className="body-tabla">
              {pedidosCreadosHoy.map((pedidoCreado) => (
                <React.Fragment key={pedidoCreado.id}>
                  <tr className="tr-body">
                    <td className="td">{pedidoCreado.id}</td>
                    <td className="td">{pedidoCreado.sastre}</td>
                    <td className="td">
                      {pedidoCreado.prenda.reduce(
                        (sum, prenda) => sum + prenda.cantidad,
                        0
                      )}
                    </td>
                    <td className="td">
                      {`$ ${new Intl.NumberFormat("es-CO", {
                        style: "decimal",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(
                        pedidoCreado.saldo + pedidoCreado.totalAbonos
                      )}`}
                    </td>
                    <td className="td td-arqueo">{`${pedidoCreado.customerName} ${pedidoCreado.customerLastName}`}</td>
                  </tr>
                  <tr className="separacion-fila"></tr>
                </React.Fragment>
              ))}
            </tbody>
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
                <th className="th">Vlr. Ord</th>
                <th className="th">Cliente</th>
                <th className="th">Fecha</th>
              </tr>
              <tr className="separacion-fila-head"></tr>
            </thead>
            <tbody className="body-tabla">
              {pedidosEntregados.map((pedidoEntregado) => (
                <React.Fragment key={pedidoEntregado.id}>
                  <tr className="tr-body">
                    <td className="td">{pedidoEntregado.id}</td>
                    <td className="td">{pedidoEntregado.sastre}</td>
                    <td className="td">
                      {pedidoEntregado.prenda.reduce(
                        (acc, item) => acc + item.cantidad,
                        0
                      )}
                    </td>
                    <td className="td">{`$ ${new Intl.NumberFormat("es-CO", {
                      style: "decimal",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(pedidoEntregado.totalAbonos)}`}</td>
                    <td className="td">{`${pedidoEntregado.customerName} ${pedidoEntregado.customerLastName}`}</td>
                    <td className="td">
                      {new Date(pedidoEntregado.fechaPedido).toLocaleDateString(
                        "es-CO",
                        {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        }
                      )}
                    </td>
                  </tr>
                  <tr className="separacion-fila"></tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
