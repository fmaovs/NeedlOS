import "react-datepicker/dist/react-datepicker.css";
import "./nomina-calendario.css";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";

const calendarioImg = "../../../../public/media/img/calendario.png";

export default function CalendarioNomina({ selected, onChange }) {
  return (
    <div className="cont-calendario-nomina">
      <img src={calendarioImg} />
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        locale={es}
        calendarStartDay={0}
      />
    </div>
  );
}
