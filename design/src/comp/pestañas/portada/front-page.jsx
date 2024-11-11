import "./front-page.css";

import Fondo from "../../fondos/fondo.jsx";
import LogoImgText from "../../logo/LogoImg+Text.jsx";
import SepXBlanco from "../../separadores/sep-x-blanco.jsx";
import Eslogan from "../../parrafos/eslogan/eslogan.jsx";
import IniciarSesion from "../../botones/Iniciar-sesion/iniciar-sesion.jsx";
import Footer from "../../footer/footer.jsx";

export default function FrontPage() {
  return (
    <div className="cont-frontPage">
      <Fondo />
      <LogoImgText />
      <SepXBlanco />
      <Eslogan />
      <IniciarSesion />
      <Footer />
    </div>
  );
}
