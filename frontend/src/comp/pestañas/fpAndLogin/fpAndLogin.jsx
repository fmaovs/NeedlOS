import { useState } from "react";

import './fpAndLogin.css'
import Fondo from "../../fondos/fondo.jsx";
import FrontPage from "./portada/front-page.jsx";
import Login from "./login/login.jsx";

export default function fpAndLogin() {
  const [showLogin, setShowLogin] = useState(false); 
  const [isAnimating, setIsAnimating] = useState(false);

  function changeFrame() {
    setIsAnimating(true); 
    setTimeout(() => {
      setShowLogin(true);
      setIsAnimating(false);
    }, 500); 
  }

  return (
    <>
      <Fondo />
      <div
        className={`frame-container ${isAnimating ? "fade-out" : "fade-in"}`}
      >
        {showLogin ? <Login /> : <FrontPage funShow2={changeFrame} />}
      </div>
    </>
  );
}
