import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Frontpage from "./comp/pestañas/portada/front-page.jsx";
import Login from "./comp/pestañas/login/login.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/frontpage" replace />} />
        <Route path="/frontpage" element={<Frontpage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
