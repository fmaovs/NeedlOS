import "./crearN.css";

export default function CrearNSec({ visible, onClick, claseBoton, imgBoton, title }) {
  return (
    <button className={`cont-crear-nuevo ${claseBoton}`} id={visible} onClick={onClick} title={title}>
      <img src={imgBoton} className="img-crear-nuevo" />
    </button>
  );
}
