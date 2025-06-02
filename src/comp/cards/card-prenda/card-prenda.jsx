import "./card-prenda.css";

export default function CardPrenda({ id, imgPrenda, name, onClick }) {
  return (
    <button className="cont-card-prenda" onClick={onClick} type="button">
      <span className="id-prenda">{id}</span>
      <img className="img-prenda" src={imgPrenda} />
      <span className="name-prenda">{name}</span>
    </button>
  );
}
