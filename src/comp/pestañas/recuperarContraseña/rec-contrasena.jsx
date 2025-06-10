import "./rec-contrasena.css";
import Fondo from "../../fondos/fondo";
import InpText from "../../input/text/inp-text.jsx";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const Password = "../../../../public/media/img/password.png";
const Verificado = "../../../../public/media/img/aprobado.png";

export default function RecContraseña() {
  // Extraer token
  const token = new URL(window.location.href).searchParams.get("token");

  // Estado del mensaje
  const navigate = useNavigate();
  const [isCorreo, setIsCorreo] = useState(false);
  const [correoIsVisible, setCorreoIsVisible] = useState(false);

  // Cambiar contraseña
  const [password1, setPassword1] = useState(null);
  const [password2, setPassword2] = useState(null);
  const isProcesing = useRef(false);
  const cambiarContraseña = async () => {
    // Valida que la solicitud no se este ejcutando dos veces
    if (isProcesing.current) {
      return;
    }
    isProcesing.current = true;

    // Validar que haya algo escrito en almenos 1 de las dos
    if (password1 === "" || password2 === "") {
      isProcesing.current = false;
      alert("No se admiten contraseñas vacias");
      return;
    }

    // Validar que las dos contraseñas sean iguales
    if (password1 !== password2) {
      isProcesing.current = false;
      alert("Las contraseñas no coinciden");
      return;
    }

    // Validar que cumpla con requisitos mínimos de seguridad
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!regex.test(password1)) {
      isProcesing.current = false;
      alert(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial"
      );
      return;
    }

    // Solicitud para cambiar contraseña
    try {
      const response = await axios.post(
        `http://localhost:8080/users/reset-password?token=${encodeURIComponent(
          token
        )}&newPassword=${encodeURIComponent(password1)}`
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
      isProcesing.current = false;
      return;
    }

    // Mostrar mensaje de exito
    setIsCorreo(true);
    setTimeout(() => {
      setCorreoIsVisible(true);
    }, 10);
  };

  return (
    <>
      <Fondo />
      <div className="cont-form cont-form-forgotPa"></div>
      <div className="cont-form-forgot">
        {isCorreo && (
          <div
            className={`cont-modal-forgot ${
              correoIsVisible ? "cont-correo-visible" : ""
            }`}
          >
            <div className={"cont-correo mensaje-forgot"}>
              <img src={Verificado} className="img-apro" />
              <p className="text-apro">
                Contraseña actualizada, puede cerrar esta ventana
              </p>
            </div>
          </div>
        )}
        <div className="forgot-border">
          <form action="" className="form-forgot">
            <h2 className="welcome">Restablecer contraseña</h2>
            <h3 className="credenciales credenciales-forgot">
              Restablecimiento contraseña NeedlOS
            </h3>
            <InpText
              lbDireccion="contrasena1"
              txt="Nuevo contraseña"
              type={"password"}
              img={Password}
              placeholder="∗ ∗ ∗ ∗ ∗ ∗ ∗"
              id="contrasena1"
              cambio={(e) => setPassword1(e.target.value)}
            />
            <InpText
              lbDireccion="contrasena2"
              txt="Confirmacion contraseña"
              type={"password"}
              img={Password}
              placeholder="∗ ∗ ∗ ∗ ∗ ∗ ∗"
              id="contrasena2"
              cambio={(e) => setPassword2(e.target.value)}
            />
            <button
              type="button"
              className="buttom-login buttom-forgot"
              onClick={() => cambiarContraseña()}
            >
              Restablecer
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
