import './checkbox.css'

export default function CheckBox() {
  return (
    <label className="cont-cb">
      <input type="checkbox" id="recuerdame" />
      <div className="check-style"></div>
    </label>
  );
}
