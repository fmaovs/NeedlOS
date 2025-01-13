import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./calendario.css";
import { es } from "date-fns/locale";
import CustomCalendar from "./custom-calendar/custom-calendar";

export default function CustomDateInput() {
  const [selectedDate, setSelectedDate] = useState(null);

  const handlePrintDate = () => {
    console.log(selectedDate);
  };

  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date) => setSelectedDate(date)}
      dateFormat="dd/MM/yyyy"
      locale={es}
      customInput={<CustomCalendar />}
      calendarStartDay={0}
    />
  );
}
