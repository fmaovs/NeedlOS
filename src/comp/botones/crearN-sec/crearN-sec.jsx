import "./crearN.css";

export default function CrearNSec({ visible, onClick, claseBoton, imgBoton }) {
  return (
    <div className={`cont-crear-nuevo ${claseBoton}`} id={visible} onClick={onClick}>
      <img src={imgBoton} className="img-crear-nuevo" />
    </div>
  );
}
