import React from "react";
import "./calendario.css";

const Calendario = "../../../../public/media/img/calendario.png";

function CustomCalendar({ onClick, fecha }, ref) {
  return (
    <button
      className="div-calendario"
      type="button"
      onClick={onClick}
      ref={ref}
    >
      <img src={Calendario} className="img-calendario" alt="Calendario" />
      <span>{fecha}</span>
    </button>
  );
}

export default React.forwardRef(CustomCalendar);
