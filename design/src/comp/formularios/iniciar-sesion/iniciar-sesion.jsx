import "./iniciar-sesion.css";

const User = "../../../../public/media/img/user.png";
const Password = "../../../../public/media/img/password.png";

import CheckBox from "../../input/checkbox/checkbox.jsx";
import InpText from "../../input/text/inp-text.jsx";

export default function IniciarSesion() {
  return (
    <div className="fondo-formulario">
      <form action="" className="form-iniciar-sesion">
        <h2 className="welcome">Bienvenido de nuevo</h2>
        <h3 className="credenciales">Por favor ingrese sus credenciales.</h3>

        <InpText
          lbDireccion="usuario"
          txt="Usuario"
          img={User}
          type="text"
          placeholder="Ejemplo@gmail.com"
          id="usuario"
        />

        <InpText
          lbDireccion="contraseña"
          txt="Contraseña"
          img={Password}
          type="password"
          placeholder=" ∗ ∗ ∗ ∗ ∗ ∗ ∗ "
          id="contraseña"
        />
        
        <div className="cont-recovery">
          <CheckBox />
          <label for="recuerdame" className="lb-inp">
            Recuerdame
          </label>
          <a href="">Recuperar contraseña</a>
        </div>

        <button>Login</button>
      </form>
    </div>
  );
}
