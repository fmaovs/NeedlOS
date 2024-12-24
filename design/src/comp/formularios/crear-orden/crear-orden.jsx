import { useState, useEffect, useRef } from "react";
import "./crear-orden.css";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro";
import SepYNegro from "../../separadores/sep-y-negro/sep-y-negro";
import ContTxtForm from "../../section/cont-txt-form/cont-txt-form";
import TxtForm from "../../input/txt-form/txt-form";
import SpanForm from "../../parrafos/span-form/span-form";

const Calendar = "../../../../public/media/img/calendario.png";

export default function CrearOrden({ onClick }) {
  /*ANIMACION MOSTRAR FORMULARIO*/
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Al cargar el componente, aseguramos que la animación de entrada se ejecute
    setIsVisible(true);
  }, []);

  const handleExit = (event) => {
    // Verifica si el clic fue directamente en el contenedor "salir"
    if (event.target.classList.contains("salir")) {
      setIsVisible(false);
      setTimeout(onClick, 500); // Llama onClick después de que la animación termine
    }
  };

  return (
    <div className={"salir"} onClick={handleExit}>
      <div className={`cont-form-crearOrden ${!isVisible ? "exit" : ""}`}>
        <div className="cont-tit-creandoP">
          <span className="tit-creandoP">Creando pedido</span>
        </div>
        <SepXNegro />
        <div className="cont-form-crearPedido">
          <form action="" className="form-crearPedido">
            <ContTxtForm className={"uno"}>
              <TxtForm
                type={"text"}
                className={"one"}
                placeholder={"Nombre..."}
              />
              <TxtForm
                type={"number"}
                className={"two"}
                placeholder={"Telefono..."}
              />
            </ContTxtForm>
            <ContTxtForm className={"dos"}>
              <TxtForm
                type={"number"}
                className={"box-form thre"}
                placeholder={"Cant..."}
              />
              <TxtForm
                type={"text"}
                className={"box-form four"}
                placeholder={"Producto..."}
              />
              <TxtForm
                type={"number"}
                className={"box-form five"}
                placeholder={"Vlr. Unit..."}
              />
            </ContTxtForm>
            <ContTxtForm className={"tres"}>
              <TxtForm
                type={"text"}
                className={"box-form six"}
                placeholder={"Detalles..."}
              />
              <button className="seven">Agregar a lista</button>
            </ContTxtForm>
            <SepXNegro />
            <div className="tb-lista">tabla</div>
            <SepXNegro />
            <div className="cont-dateEtc">
              <video className="camara" id="camara" autoPlay></video>
              <div className="div-column">
                <input type="date" className="calendar" />
                <img src={Calendar} className="img-calendar" />
                <select className="select-form">
                  <option>Maria</option>
                  <option>Luis</option>
                  <option>Juliana</option>
                  <option>Carlos</option>
                </select>
              </div>
              <div className="div-column-full">
                <div className="div-row">
                  <SpanForm txt={"Dias"} insert={"8"} />
                  <SpanForm txt={"Pzs"} insert={"7"} />
                </div>
                <SpanForm txt={"Subtotal"} insert={"$ 85.000"} />
                <SpanForm txt={"Abono"} insert={"$ 20.000"} />
                <SpanForm txt={"Total"} insert={"$ 65.000"} />
              </div>
              <div className="div-column">
                <button className="clean-print">Limpiar</button>
                <button className="clean-print">Imprimir</button>
              </div>
            </div>
          </form>
          <SepYNegro />
          <div className="cont-prendas"></div>
        </div>
      </div>
    </div>
  );
}
