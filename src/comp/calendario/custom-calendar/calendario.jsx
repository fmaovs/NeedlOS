import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./calendario.css";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import CustomCalendar from "./custom-calendar";

export default function CustomDateInput({ selected, onChange }) {
  const fechaFormateada = selected ? format(selected, "dd/MM/yyyy") : "Fecha?";

  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat="dd/MM/yyyy"
      locale={es}
      customInput={<CustomCalendar fecha={fechaFormateada} />}
      calendarStartDay={0}
    />
  );
}
