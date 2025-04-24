import "react-datepicker/dist/react-datepicker.css";
import "./nomina-calendario.css";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import { useRef } from "react";

const calendarioImg = "../../../../public/media/img/calendario.png";

export default function CalendarioNomina({ selected, onChange, desdeHasta }) {
  const datePickerRef = useRef();

  const handleDivClick = (e) => {
    if (e.target.closest(".react-datepicker")) {
      return;
    }
    datePickerRef.current.setOpen(true);
  };

  return (
    <div className="cont-calendario-nomina" onClick={handleDivClick}>
      <span className="span-desde-hasta">{desdeHasta}</span>
      <DatePicker
        ref={datePickerRef}
        selected={selected}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        locale={es}
        calendarStartDay={0}
      />
      <img src={calendarioImg} />
    </div>
  );
}
