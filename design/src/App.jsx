import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import FpAndLogin from './comp/pestañas/fpAndLogin/fpAndLogin.jsx'
import CrearMaterial from "./comp/formularios/crear-material/crear-material.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< FpAndLogin/>} />
        <Route path="/inventario/nuevo" element={<CrearMaterial />}></Route>
      </Routes>
    </Router>
  );
}
