import './checkbox.css'

export default function CheckBox() {
  return (
    <label className="container">
      <input type="checkbox" />
      <div className="checkmark" />
    </label>
  );
}
