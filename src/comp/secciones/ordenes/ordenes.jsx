import "./ordenes.css";
import { useState } from "react";

import Encabezado from "../../encabezado-seccion/encabezado.jsx";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import Filtrador from "../../filtrador-seccion/filtrador-seccion.jsx";
import BotonFilter from "../../botones/filter-sec/filter-sec.jsx";
import OpcionesFilter from "../../opciones-filter/opciones-filter.jsx";
import EspacioRender from "../../espacio-render/espacio-render.jsx";
import CrearOrden from "../../formularios/crear-orden/crear-orden.jsx";

const EnProceso = "../../../../public/media/img/enProceso.png";
const Finalizado = "../../../../public/media/img/entregado.png";
const Entregado = "../../../../public/media/img/entregado.png";
const Anulado = "../../../../public/media/img/anulado.png";
const Todo = "../../../../public/media/img/historial.png";

/*ESTADO DE PEDIDO*/
import TbEnProceso from "./estados-ordenes/en-proceso.jsx";
import TbFinalizado from "./estados-ordenes/finalizado.jsx";
import TbEntregado from "./estados-ordenes/entregado.jsx";
import TbAnulado from "./estados-ordenes/anulado.jsx";
import TbTodo from "./estados-ordenes/todo.jsx";

export default function Ordenes() {
  // Estado para controlar qué filtro está seleccionado y qué componente renderizar
  const [componenteSeleccionado, setComponenteSeleccionado] = useState(
    <TbEnProceso />
  );
  const [filtroSeleccionado, setFiltroSeleccionado] = useState("En Proceso");
  const [refreshKey, setRefreshKey] = useState(0);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleFilterClick = (filtro) => {
    // Si es el mismo que ya esta no hace nada
    if (filtro === filtroSeleccionado) return;

    // Cambiar el componente según el filtro seleccionado
    setFiltroSeleccionado(filtro);
    switch (filtro) {
      case "En Proceso":
        setComponenteSeleccionado(<TbEnProceso />);
        break;
      case "Finalizado":
        setComponenteSeleccionado(<TbFinalizado />);
        break;
      case "Entregado":
        setComponenteSeleccionado(<TbEntregado />);
        break;
      case "Anulado":
        setComponenteSeleccionado(<TbAnulado />);
        break;
      case "Todo":
        setComponenteSeleccionado(<TbTodo />);
        break;
    }
  };

  // Función modificada para refrescar solo TbEnProceso y TbTodo
  const refreshCurrentComponent = () => {
    // Solo refrescar si el filtro actual es "En Proceso" o "Todo"
    if (filtroSeleccionado === "En Proceso" || filtroSeleccionado === "Todo") {
      switch (filtroSeleccionado) {
        case "En Proceso":
          setComponenteSeleccionado(<TbEnProceso key={refreshKey} />);
          break;
        case "Todo":
          setComponenteSeleccionado(<TbTodo key={refreshKey} />);
          break;
      }
      setRefreshKey((prevKey) => prevKey + 1);
    }
  };

  // Mostrar formulario de crear orden y activar cámara
  const mostrarCrearOrden = async () => {
    setMostrarFormulario(true);
  };

  //Ocultar Formulario de crear orden
  const ocultarCrearOrden = () => {
    setMostrarFormulario(false);
  };

  return (
    <>
      <Encabezado
        titEncabezado={"Ordenes"}
        conBtCrear={""}
        opc1={"Cliente"}
        opc2={"Prenda"}
        opc3={"Valor"}
        opc4={"N°"}
        onClick={mostrarCrearOrden}
        imgBoton={'../../../../public/media/img/crear.png'}
      />
      {mostrarFormulario && (
        <CrearOrden
          onClick={ocultarCrearOrden}
          ejecutarFuncion={refreshCurrentComponent}
        />
      )}
      <SepXNegro />
      <div className="cont-filterAndBoton">
        <Filtrador>
          <OpcionesFilter
            txtFilter={"En Proceso"}
            imgFilter={EnProceso}
            clase={filtroSeleccionado === "En Proceso" ? "azul" : ""}
            onClick={() => handleFilterClick("En Proceso")}
          />
          <OpcionesFilter
            txtFilter={"Finalizado"}
            imgFilter={Finalizado}
            clase={filtroSeleccionado === "Finalizado" ? "verde" : ""}
            onClick={() => handleFilterClick("Finalizado")}
          />
          <OpcionesFilter
            txtFilter={"Entregado"}
            imgFilter={Entregado}
            clase={filtroSeleccionado === "Entregado" ? "amarillo" : ""}
            onClick={() => handleFilterClick("Entregado")}
          />
          <OpcionesFilter
            txtFilter={"Anulado"}
            imgFilter={Anulado}
            clase={filtroSeleccionado === "Anulado" ? "rojo" : ""}
            onClick={() => handleFilterClick("Anulado")}
          />
          <OpcionesFilter
            txtFilter={"Todo"}
            imgFilter={Todo}
            clase={filtroSeleccionado === "Todo" ? "gris" : ""}
            onClick={() => handleFilterClick("Todo")}
          />
        </Filtrador>
        <BotonFilter onClick={refreshCurrentComponent} />
      </div>
      <EspacioRender>{componenteSeleccionado}</EspacioRender>
    </>
  );
}
