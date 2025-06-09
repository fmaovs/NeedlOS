import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FpAndLogin from "./comp/pestañas/fpAndLogin/fpAndLogin.jsx";
import Home from "./comp/pestañas/home/home.jsx";
import RecContraseña from "./comp/pestañas/recuperarContraseña/rec-contrasena.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FpAndLogin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/reset-password" element={<RecContraseña />} />
      </Routes>
    </Router>
  );
}
