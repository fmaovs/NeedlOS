import React, { useState } from "react";
import Encabezado from "../../encabezado-seccion/encabezado.jsx";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import ConUsuari from "./con-usuario.jsx";
import { RegistroUsuario } from "./registro-usuario.jsx";  

const ima = {
  admi: "../../../../public/media/img/administrador.png",
  metro: "../../../../public/media/img/metro.png",
};

export default function Usuarios() {
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const handleRegistrarUsuario = (nuevoUsuario) => {
    console.log("Usuario registrado:", nuevoUsuario);
    setMostrarRegistro(false); // Cierra la modal tras registrar
  };

  return (
    <>
      <Encabezado
        titEncabezado={"Usuarios"}
        conBtCrear={"Crear Usuario"}
        onClick={() => setMostrarRegistro(true)} // Muestra el formulario al hacer clic
      />  
      <SepXNegro />
      
      <div className="usuarios">
        <ConUsuari txt1={"Administrador"} img1={ima.admi} txt2={"Sastre"} img2={ima.metro} />
      </div>
      
      <SepXNegro />

      {mostrarRegistro && (
        <RegistroUsuario
          onClose={() => setMostrarRegistro(false)}
          onSubmit={handleRegistrarUsuario}
        />
      )}
    </>
  );
}

