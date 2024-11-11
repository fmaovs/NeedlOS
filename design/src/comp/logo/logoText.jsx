import "./logo.css";

const R = "/public/media/img/r-blanco.png";

export default function LogoTxt() {
  return (
    <>
      <div className="marca-titulo">
        <h1 className="nombre-marca">NeedlOS</h1>
        <h2 className="description">Tailor Software</h2>
      </div>
      <img src={R} alt="" className="r" />
    </>
  );
}
