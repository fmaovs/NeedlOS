import "./espacio-render.css";
import { useState, useEffect } from "react";

export default function EspacioRender({ children }) {
  const [currentChildren, setCurrentChildren] = useState(children);
  const [prevChildren, setPrevChildren] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (children !== currentChildren) {
      // Marcar el componente actual como saliente
      setPrevChildren(<div className="exiting">{currentChildren}</div>);

      // Hacer invisible el componente nuevo por un breve momento
      setIsVisible(false);

      // Actualizar al nuevo componente después de la animación de salida del anterior
      setTimeout(() => {
        setCurrentChildren(children);
        setIsVisible(true); // Mostrar el nuevo componente después del retraso
      }, 0); // Tiempo para la animación de salida

      // Remover el componente anterior después de su animación
      setTimeout(() => {
        setPrevChildren(null);
      }, 300); // Tiempo suficiente para que el componente anterior termine su animación
    }
  }, [children]);

  return (
    <div className="cont-info">
      {prevChildren}
      {isVisible && <div className="entrando">{currentChildren}</div>}
    </div>
  );
}
