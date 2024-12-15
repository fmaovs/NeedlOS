import "./logo-negro.css";

const R = "/public/media/img/r-negro.png";

export default function LogoTxt() {
  return (
    <>
      <div className="marca-titulo-negro">
        <h1 className="nombre-marca-negro">NeedlOS</h1>
        <h2 className="description-negro">Tailor Software</h2>
      </div>
      <img src={R} alt="" className="r-negro" />
    </>
  );
}
