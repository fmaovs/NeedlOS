import "./crearN.css";

const CrearNuevo = "../../../../public/media/img/crear.png";

export default function CrearNSec({ visible, onClick }) {
  return (
    <div className="cont-crear-nuevo" id={visible} onClick={onClick}>
      <img src={CrearNuevo} className="img-crear-nuevo" />
    </div>
  );
}
