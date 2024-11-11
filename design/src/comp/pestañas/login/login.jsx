import "./login.css";

import Fondo from "../../fondos/fondo.jsx";
import LogoImgText from '../../logo/LogoImg+Text.jsx'
import SepXBlanco from "../../separadores/sep-x-blanco.jsx";
import Eslogan from "../../parrafos/eslogan/eslogan.jsx";
import Footer from "../../footer/footer.jsx";
import FormLogin from '../../formularios/iniciar-sesion/iniciar-sesion.jsx'

export default function Login() {
  return (
    <div className="cont-login">
      <Fondo />
      <div className="cont-lados">
        <LogoImgText />
        <SepXBlanco />
        <Eslogan />
        <Footer />
      </div>
      <div className="cont-lados">
        <div className="cont-form">
          <FormLogin />
        </div>
      </div>
    </div>
  );
}
