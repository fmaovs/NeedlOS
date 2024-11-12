import "./inp-text.css";

export default function CheckBox({
  lbDireccion,
  txt,
  img,
  type,
  placeholder,
  id,
}) {
  return (
    <>
      <div className="cont-lb">
        <label for={lbDireccion} className="lb-inp">
          {txt}
        </label>
      </div>
      <div className="cont-inp">
        <img src={img} alt="" className="images" />
        <input
          type={type}
          placeholder={placeholder}
          id={id}
          className="inputs"
        />
      </div>
    </>
  );
}
