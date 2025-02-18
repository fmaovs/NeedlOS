import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./calendario.css";
import { es } from "date-fns/locale";
import CustomCalendar from "./custom-calendar";

export default function CustomDateInput({ selected, onChange }) {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat="dd/MM/yyyy"
      locale={es}
      customInput={<CustomCalendar />}
      calendarStartDay={0}
    />
  );
}
