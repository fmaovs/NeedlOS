import "./txt-form.css";

export default function TxtForm({ type, className, placeholder }) {
  return (
    <input
      type={type}
      className={`box-form ${className}`}
      placeholder={`${placeholder} *`}
    />
  );
}
