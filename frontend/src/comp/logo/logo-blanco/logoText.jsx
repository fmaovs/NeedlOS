import "./logo-blanco.css";

import R from "../../../assets/img/r-blanco.png";

export default function LogoTxt() {
  return (
    <>
      <div className="marca-titulo-blanco">
        <h1 className="nombre-marca-blanco">NeedlOS</h1>
        <h2 className="description-blanco">Tailor Software</h2>
      </div>
      <img src={R} alt="Icono copyright" className="r-blanco" />
    </>
  );
}
