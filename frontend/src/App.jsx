import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import FpAndLogin from './comp/pestañas/fpAndLogin/fpAndLogin.jsx'
import Home from "./comp/pestañas/home/home.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FpAndLogin />} />
        <Route path="/home" element={<Home />}/>
      </Routes>
    </Router>
  );
}