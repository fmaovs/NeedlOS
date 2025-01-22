import "./espacio-render.css";
import { useState, useEffect } from "react";

export default function EspacioRender({ children }) {
  const [currentChildren, setCurrentChildren] = useState(children);
  const [prevChildren, setPrevChildren] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (children !== currentChildren) {
      setPrevChildren(<div className="exiting">{currentChildren}</div>);

      // Establecer la clase de entrada con opacity 0
      setIsVisible(false);

      setTimeout(() => {
        setCurrentChildren(children);
        setIsVisible(true);
      }, 150); // Tiempo de la animación de salida

      setTimeout(() => {
        setPrevChildren(null); // Eliminar el componente anterior
      }, 0); // Ajusta este tiempo según la duración total de la animación
    }
  }, [children]);

  return (
    <div className="cont-info">
      {prevChildren}
      {isVisible && <div className="entrando">{currentChildren}</div>}
    </div>
  );
}
