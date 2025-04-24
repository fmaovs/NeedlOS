import "./opciones-nav.css";

export default function Secciones({ img, txt, clase, onClick }) {
  return (
    <div className={clase} onClick={onClick}>
      <img src={img} className="img-seccion" />
      <span className="text-seccion">{txt}</span>
    </div>
  );
}
