import { useEffect, useState } from "react";
import "./render-secciones.css";

// Importación de los componentes
import Ordenes from "../secciones/ordenes/ordenes.jsx";
import Informes from "../secciones/informes/Informes.jsx";
import Inventario from "../secciones/inventario/Inventario.jsx";
import Usuarios from "../secciones/usuarios/Usuarios.jsx";
import Gastos from "../secciones/gastos/Gastos.jsx";
import ArqueoCaja from "../secciones/arqueo-caja/arqueo-caja.jsx";
import Nomina from "../secciones/nomina/Nomina.jsx";
import Ajustes from "../secciones/ajustes/Ajustes.jsx";

export default function Render({ componenteSeleccionado }) {
  const [componenteActual, setComponenteActual] = useState(
    componenteSeleccionado
  );
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (componenteSeleccionado !== componenteActual) {
      setAnimating(true);
      setTimeout(() => {
        setComponenteActual(componenteSeleccionado);
        setAnimating(false);
      }, 300); // Duración de la animación
    }
  }, [componenteSeleccionado, componenteActual]);

  const renderComponente = () => {
    switch (componenteActual) {
      case "Ordenes":
        return <Ordenes />;
      case "Informes":
        return <Informes />;
      case "Inventario":
        return <Inventario />;
      case "Usuarios":
        return <Usuarios />;
      case "Gastos":
        return <Gastos />;
      case "ArqueoCaja":
        return <ArqueoCaja />;
      case "Nomina":
        return <Nomina />;
      case "Ajustes":
        return <Ajustes />;
      default:
        return <Ordenes />;
    }
  };

  return (
    <div className={`cont-render ${animating ? "animating" : ""}`}>
      {renderComponente()}
    </div>
  );
}
