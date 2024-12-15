import "./home.css";
import Nav from "../../nav/nav.jsx";
import SepYNegro from "../../separadores/sep-y-negro/sep-y-negro.jsx";
import Render from "../../render/render-secciones.jsx";

export default function Home() {
  return (
    <div className="cont-home">
      <Nav />
      <SepYNegro />
      <Render />
    </div>
  );
}
