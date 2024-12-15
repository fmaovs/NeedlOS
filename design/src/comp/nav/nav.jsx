import "./nav.css";
import LogoImgTxt from "../logo/logo-negro/LogoImg+Text.jsx";
import SepXBlancoSmall from "../separadores/sep-x-blanco-small/sep-x-blanco-s.jsx";
import OpcionNav from "../opciones-nav/opciones-nav.jsx";

const Ordenes = "../../../public/media/img/ordenes.png";
const Informes = '../../../public/media/img/informes.png'
const Inventario = "../../../public/media/img/inventario.png";
const Usuarios = "../../../public/media/img/usuarios.png";
const Gastos = "../../../public/media/img/gastos.png";
const ArqueoCaja = "../../../public/media/img/arqueo-caja.png";
const Nomina = "../../../public/media/img/nomina.png";
const Ajustes = "../../../public/media/img/ajustes.png";

export default function Nav() {
  return (
    <div className="cont-nav">
      <LogoImgTxt />
      <SepXBlancoSmall />
      <OpcionNav img={Ordenes} txt={"Ordenes"} clase={"cont-seccion-first"} />
      <OpcionNav img={Informes} txt={"Informes"} clase={"cont-seccion"} />
      <OpcionNav img={Inventario} txt={"Inventario"} clase={"cont-seccion"} />
      <OpcionNav img={Usuarios} txt={"Usuarios"} clase={"cont-seccion"} />
      <OpcionNav img={Gastos} txt={"Gastos"} clase={"cont-seccion"} />
      <OpcionNav img={ArqueoCaja} txt={"Arqueo Caja"} clase={"cont-seccion"} />
      <OpcionNav img={Nomina} txt={"Nomina"} clase={"cont-seccion-last"} />
      <SepXBlancoSmall />
      <OpcionNav img={Ajustes} txt={"Ajustes"} clase={"cont-seccion-sett"} />
    </div>
  );
}
