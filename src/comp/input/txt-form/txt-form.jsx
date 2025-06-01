import "./txt-form.css";

export default function TxtForm({ type, className, placeholder, id, onBlur, onInput }) {
  return (
    <input
      type={type}
      className={`box-form ${className}`}
      placeholder={`${placeholder} *`}
      id={id}
      onBlur={onBlur}
      onInput={onInput}
    />
  );
}
