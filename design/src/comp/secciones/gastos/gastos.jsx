import "./gastos.css";
import { useState } from "react"; 

import Encabezado from "../../encabezado-seccion/encabezado.jsx";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import OpcionesFilter from "../../opciones-filter/opciones-filter.jsx";
import Filtrador from "../../filtrador-seccion/filtrador-seccion.jsx";

// Importación de las pestañas 
import { GastosDiarios as TbGastosDiarios } from "./encabezado_gastos/gastosDiarios.jsx";
import  TbVales from "./encabezado_gastos/vales.jsx"

// Rutas de imágenes corregidas
const img = {
    gastos: "/media/img/gastosDiarios.png",
    vales: "/media/img/vales.png",
}

export default function Gastos() {
    const [componenteSeleccionado, setComponenteSeleccionado] = useState(<TbGastosDiarios />);
    const [filtroSeleccionado, setFiltroSeleccionado] = useState("Gastos Diarios");

    const handleFilterClick = (filtro) => {
        if (filtro === filtroSeleccionado) return;

        // Cambiar de componente
        setFiltroSeleccionado(filtro);
        switch (filtro) {
            case "Gastos Diarios":
                setComponenteSeleccionado(<TbGastosDiarios />);
                break;
            case "Vales":
                setComponenteSeleccionado(<TbVales />);
                break;
        }
    }

    return (
        <>
            <Encabezado 
                titEncabezado={"Gastos"}
                conBtCrear={"none"}
                withSearch={"cont-buscador-none"} 
            />
            <SepXNegro />
            <div className="con-gastos">
                <Filtrador>
                    <OpcionesFilter
                        txtFilter={"Gastos Diarios"}
                        imgFilter={img.gastos}
                        clase={filtroSeleccionado === "Gastos Diarios" ? "azul" : ""}
                        onClick={() => handleFilterClick("Gastos Diarios")}
                    />
                    <OpcionesFilter
                        txtFilter={"Vales Empleados"}
                        imgFilter={img.vales}
                        clase={filtroSeleccionado === "Vales" ? "azul" : ""}
                        onClick={() => handleFilterClick("Vales")}
                    />
                </Filtrador>
            </div>
            {componenteSeleccionado}
        </>
    )
}
