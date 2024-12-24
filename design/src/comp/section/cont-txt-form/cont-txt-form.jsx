import "./cont-txt-form.css";

export default function ContTxtForm({ children, className }) {
  return <section className={`cont-txt-form ${className}`}>{children}</section>;
}
