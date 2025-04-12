import React from "react";
import "./calendario.css";

import Calendario from "../../../assets/img/calendario.png";

function CustomCalendar({ onClick }, ref) {
  return (
    <button
      className="div-calendario"
      type="button"
      onClick={onClick}
      ref={ref}
    >
      <img src={Calendario} className="img-calendario" alt="Calendario" />
    </button>
  );
}

export default React.forwardRef(CustomCalendar);
