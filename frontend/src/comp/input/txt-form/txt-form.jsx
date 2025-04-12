import "./txt-form.css";

export default function TxtForm({ type, className, placeholder, id, onBlur }) {
  return (
    <input
      type={type}
      className={`box-form ${className}`}
      placeholder={`${placeholder} *`}
      id={id}
      onBlur={onBlur}
    />
  );
}
