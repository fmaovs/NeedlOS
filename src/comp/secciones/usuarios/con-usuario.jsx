import "./con-usuario.css";

export default function CardInforme({ txt1, txt2, img1, img2 }) {
  return (
    <div className="con-usuario">
      <div className="con-usuario1">
        <span className="spam-usuario1">{txt1}</span>
        <img src={img1} alt="Icono 1" className="img-usuario" />
      </div>
      <div className="con-usuario2">
        <span className="spam-usuario2">{txt2}</span>
        <img src={img2} alt="Icono 2" className="img-usuario" />
      </div>
    </div>
  );
}
