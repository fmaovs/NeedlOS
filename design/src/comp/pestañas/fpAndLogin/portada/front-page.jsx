import "./front-page.css";

import LogoImgText from "../../../logo/LogoImg+Text.jsx";
import SepXBlanco from "../../../separadores/sep-x-blanco.jsx";
import Eslogan from "../../../parrafos/eslogan/eslogan.jsx";
import IniciarSesion from "../../../botones/Iniciar-sesion/iniciar-sesion.jsx";
import Footer from "../../../footer/footer.jsx";

export default function FrontPage({ funShow2 }) {
  return (
    <div className="cont-frontPage">
      <LogoImgText />
      <SepXBlanco />
      <Eslogan />
      <IniciarSesion funShow={funShow2}/>
      <Footer />
    </div>
  );
}
