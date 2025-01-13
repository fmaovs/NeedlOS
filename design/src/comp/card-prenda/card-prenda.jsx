import "./card-prenda.css";

export default function CardPrenda({ id, imgPrenda, name }) {
  return (
    <div className="cont-card-prenda">
      <span className="id-prenda">{id}</span>
      <img className="img-prenda" src={imgPrenda} />
      <span className="name-prenda">{name}</span>
    </div>
  );
}
