import { StrictMode } from "react";

import Fondo from "./components-front-page/fondo/fondo.jsx";
import Marca from "./components-front-page/marca/marca.jsx";
import Sep from "./components-front-page/sep-horizontal/sep-horizontal.jsx";
import P from "./components-front-page/p/p.jsx";
import Buttom from "./components-front-page/buttom/buttom.jsx";
import Footer from "./components-front-page/footer/footer.jsx";

export default function FrontPage() {
  return (
    <>
      <Fondo />
      <Marca />
      <Sep />
      <P />
      <Buttom />
      <Footer />
    </>
  );
}
