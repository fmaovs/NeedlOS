import { Children } from "react";
import "./span-form.css";

export default function SpanForm({ txt, insert, children, onHover, label, cursor }) {
  return (
    <div className={`div-txt-tit ${onHover}`}>
      <label htmlFor={label} className={cursor}>
        {txt}
      </label>
      <span className="span-ins">
        {insert}
        {children}
      </span>
    </div>
  );
}
