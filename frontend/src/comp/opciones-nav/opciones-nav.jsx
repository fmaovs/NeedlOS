import "./opciones-nav.css";

export default function Secciones({ img, txt, clase, onClick, alt }) {
  return (
    <div className={clase} onClick={onClick}>
      <img src={img} alt={alt} className="img-seccion"/>
      <span className="text-seccion">{txt}</span>
    </div>
  );
}
