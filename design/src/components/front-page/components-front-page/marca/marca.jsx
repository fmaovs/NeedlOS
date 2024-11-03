import "./marca.css";

const Logo = '/public/media/img/logo-blanco.png'
const R = '/public/media/img/r-blanco.png'

export default function Marca() {
  return (
    <div className="marca">
      <img src={Logo} alt="" className="logo-blanco" />
      <div className="marca-titulo">
        <h1 className="nombre-marca">NeedlOS</h1>
        <h2 className="description">Tailor Software</h2>
      </div>
      <img src={R} alt="" className="r"/>
    </div>
  );
}
