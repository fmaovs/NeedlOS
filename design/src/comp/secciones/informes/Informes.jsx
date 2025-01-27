import "./Informes.css";

import Encabezado from "../../encabezado-seccion/encabezado.jsx";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import CardInforme from "./card-informe.jsx";
// Constantes de imágenes
const images = {
  tiempo: "../../../../public/media/img/tiempo.png",
  recasteCliente: "../../../../public/media/img/recaste-clien.png",
  prendaDinero: "../../../../public/media/img/prenda-dinero.png",
  usuario: "../../../../public/media/img/usuario.png",
  nuevoCliente: "../../../../public/media/img/nuevo-cliente.png",
  movimientoInv: "../../../../public/media/img/moviminto-inv.png",
  movimientoClien: "../../../../public/media/img/movimiento-clien.png",
  movimientoCaja: "../../../../public/media/img/movimiento-caja.png",
  mejoresClien: "../../../../public/media/img/mejores-clien.png",
  egreso: "../../../../public/media/img/egresos.png",
  gastoMes: "../../../../public/media/img/gastos-mensual.png",
  gastodetalle: "../../../../public/media/img/gastos-generales.png",
  entradaSalida: "../../../../public/media/img/entrada-salida.png",
  entradaProduc: "../../../../public/media/img/entrada-producto.png",
  consumoP: "../../../../public/media/img/consumop.png",
  anulada: "../../../../public/media/img/anulada.png"
};

export default function Informe() {
  return (
    <>
    <Encabezado titEncabezado={"Informes"} />
    <SepXNegro />
    <div className="cont-informes">
      <h2 className="tit-informes">Selecionar informe</h2>
      <SepXNegro/>
      <div className="informes">
        <CardInforme txt={"Entrada y salida"} txt2={"por hora"} img={images.tiempo}/>
        <CardInforme txt={"Entrada y salida"} txt2={"por periodo"} img={images.entradaSalida}/>
        <CardInforme txt={"Entrada y salida"} txt2={"por producto"} img={images.entradaProduc}/>
        <CardInforme txt={"Entrada y salida"} txt2={"por usuario"} img={images.usuario}/>
        <CardInforme txt={"Movimiento de "} txt2={"inventario general"} img={images.movimientoInv}/>
        <CardInforme txt={"Informe de "} txt2={"movimiento de caja"} img={images.movimientoCaja}/>
        <CardInforme txt={"Detalldo ingreso"} txt2={"de gastos"} img={images.gastodetalle}/>
        <CardInforme txt={"general ingresos"} txt2={"de gastos"} img={images.egreso}/>
        <CardInforme txt={"Ingreso de"} txt2={"prendas y dinero"} img={images.prendaDinero}/>
        <CardInforme txt={"Ingreso de gastos"} txt2={"mensuales"} img={images.gastoMes}/>
        <CardInforme txt={"Ordenes de "} txt2={"servicio anulada"} img={images.anulada}/>
        <CardInforme txt={"Movimiento"} txt2={"inventario clie."} img={images.movimientoClien}/>
        <CardInforme txt={"Consumo"} txt2={"producto clie."} img={images.consumoP}/>
        <CardInforme txt={"Recaste"} txt2={"de clientes"} img={images.recasteCliente}/>
        <CardInforme txt={"Clientes nuevos"} txt2={"periodo"} img={images.nuevoCliente}/>
        <CardInforme txt={"Mejor cliente"} txt2={""} img={images.mejoresClien}/>
      </div>
    </div>
    </>
  );
}