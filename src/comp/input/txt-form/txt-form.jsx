import "./txt-form.css";

export default function TxtForm({
  type,
  className,
  placeholder,
  id,
  onBlur,
  onInput,
  onClick,
}) {
  return (
    <input
      type={type}
      className={`box-form ${className}`}
      placeholder={`${placeholder} *`}
      id={id}
      onBlur={onBlur}
      onInput={onInput}
      onClick={onClick}
      autoComplete="off"
    />
  );
}
