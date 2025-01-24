import { useState } from "react";
import "./Informes.css";
import EntradaSalidaHora from "./selecion-informe/Entrada_salida_hora";

import Encabezado from "../../encabezado-seccion/encabezado.jsx";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
// Constantes de imágenes
const IMAGES = {
  Tiempo: "../../../../public/media/img/tiempo.png",
  RecasteCliente: "../../../../public/media/img/recaste-clien.png",
  PrendaDinero: "../../../../public/media/img/prenda-dinero.png",
  NuevoCliente: "../../../../public/media/img/nuevo-cliente.png",
  MovimientoInv: "../../../../public/media/img/moviminto-inv.png",
  MovimientoClien: "../../../../public/media/img/movimiento-clien.png",
  MovimientoCaja: "../../../../public/media/img/movimiento-caja.png",
  MejoresClien: "../../../../public/media/img/mejores-clien.png",
  Egreso: "../../../../public/media/img/egresos.png",
  GastoMes: "../../../../public/media/img/gastos-mensual.png",
  Gastodetalle: "../../../../public/media/img/gastos-generales.png",
  EntradaSalida: "../../../../public/media/img/entrada-salida.png",
  EntradaProduc: "../../../../public/media/img/entrada-producto.png",
  ConsumoP: "../../../../public/media/img/consumop.png",
  Anulada: "../../../../public/media/img/anulada.png"
};

const reports = [
  { id: 'time', title: 'Entrada y salida', subtitle: 'por hora', img: IMAGES.Tiempo, comp:EntradaSalidaHora },
  { id: 'period', title: 'Entrada y salida', subtitle: 'por periodo', img: IMAGES.EntradaSalida },
  { id: 'product', title: 'Entrada y salida', subtitle: 'por producto', img: IMAGES.EntradaProduc },
  { id: 'user', title: 'Entrada y salida', subtitle: 'por usuario', img: IMAGES.EntradaSalida },
  { id: 'inventory', title: 'Movimiento de', subtitle: 'inventario general', img: IMAGES.MovimientoInv },
  { id: 'cashflow', title: 'Informe', subtitle: 'movimiento caja', img: IMAGES.MovimientoCaja },
  { id: 'expenses', title: 'Detallado ingreso', subtitle: 'de gastos', img: IMAGES.Gastodetalle },
  { id: 'income', title: 'General ingresos', subtitle: 'de gastos', img: IMAGES.Egreso },
  { id: 'items', title: 'Ingreso de', subtitle: 'prendas y dinero', img: IMAGES.PrendaDinero },
  { id: 'monthly', title: 'Ingreso de gatos', subtitle: 'mensuales', img: IMAGES.GastoMes },
  { id: 'canceled', title: 'Ordenes de', subtitle: 'servicio anuladas', img: IMAGES.Anulada },
  { id: 'client-inv', title: 'Movimiento', subtitle: 'inventarios clie.', img: IMAGES.MovimientoClien },
  { id: 'consumption', title: 'Consumo', subtitle: 'productos clie.', img: IMAGES.ConsumoP },
  { id: 'recast', title: 'Recaste', subtitle: 'de clientes', img: IMAGES.RecasteCliente },
  { id: 'new-clients', title: 'Clientes nuevos', subtitle: 'periodos', img: IMAGES.NuevoCliente },
  { id: 'best-clients', title: 'Mejores', subtitle: 'clientes', img: IMAGES.MejoresClien },
];

export default function Informe() {
  const [informeSeleccionado, setInformeSeleccionado] = useState(null);

  const handleSelectInforme = (informeId) => {
    setInformeSeleccionado(informeId);
  };

  const selectedReport = reports.find(report => report.id === informeSeleccionado);

  return (
    <>
    <Encabezado titEncabezado={"Informes"} />
    <SepXNegro />
    <div className="cont-informes">
      {!informeSeleccionado ? (
        <div className="informe-content">
          
          <div className="informe-card">
            <div className="informe-inner">
              <h2 className="informe-subtitle">Selecciona de informe</h2>
              <SepXNegro />
              
              <div className="reports-grid">
                {reports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => handleSelectInforme(report.id)}
                    className="report-button"
                  >
                    <div className="report-icon">
                      <img src={report.img} alt={report.title} />
                    </div>
                    <div className="report-text">
                      <div className="report-title">{report.title}</div>
                      <div className="report-subtitle">{report.subtitle}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        selectedReport?.comp ? <selectedReport.comp /> : null
      )}
    </div>
    </>
  );
}