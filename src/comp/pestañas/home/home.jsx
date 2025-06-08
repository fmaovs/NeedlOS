import "./home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../nav/nav.jsx";
import SepYNegro from "../../separadores/sep-y-negro/sep-y-negro.jsx";
import Render from "../../render/render-secciones.jsx";
import { useEffect } from "react";

export default function Home() {
  const [componenteSeleccionado, setComponenteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token || token.trim() === "") {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) return null;

  return (
    <div className="cont-home">
      <Nav setComponenteSeleccionado={setComponenteSeleccionado} />
      <SepYNegro />
      <Render componenteSeleccionado={componenteSeleccionado} />
    </div>
  );
}
