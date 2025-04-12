import "./crearN.css";

export default function CrearNSec({
  visible,
  onClick,
  claseBoton,
  imgBoton,
  alt,
}) {
  return (
    <div
      className={`cont-crear-nuevo ${claseBoton}`}
      id={visible}
      onClick={onClick}
    >
      <img src={imgBoton} alt={alt} className="img-crear-nuevo" />
    </div>
  );
}
