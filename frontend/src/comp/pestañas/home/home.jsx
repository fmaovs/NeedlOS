import "./home.css";
import { useState } from "react";
import Nav from "../../nav/nav.jsx";
import SepYNegro from "../../separadores/sep-y-negro/sep-y-negro.jsx";
import Render from "../../render/render-secciones.jsx";

export default function Home() {
  const [componenteSeleccionado, setComponenteSeleccionado] = useState(null);

  return (
    <div className="cont-home">
      <Nav setComponenteSeleccionado={setComponenteSeleccionado} />
      <SepYNegro />
      <Render componenteSeleccionado={componenteSeleccionado} />
    </div>
  );
}