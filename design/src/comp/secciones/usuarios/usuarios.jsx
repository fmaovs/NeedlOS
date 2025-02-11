import React, { useState } from "react";
import Encabezado from "../../encabezado-seccion/encabezado.jsx";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import ConUsuari from "./con-usuario.jsx";
import "./usuarios.css";
import { RegistroUsuario } from "./registro-usuario.jsx";

const ima = {
  admi: "/media/img/administrador.png",
  metro: "/media/img/metro.png",
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]); // Estado para la lista de usuarios
  const [mostrarRegistro, setMostrarRegistro] = useState(false); // Controla la visibilidad del modal

  // Función para agregar un usuario a la tabla
  const handleRegistrarUsuario = (nuevoUsuario) => {
    if (!nuevoUsuario || !nuevoUsuario.nombre || !nuevoUsuario.apellido) {
      console.error("Error: Datos de usuario inválidos", nuevoUsuario);
      return;
    }

    const usuarioConId = { ...nuevoUsuario, id: crypto.randomUUID() };

    setUsuarios([...usuarios, usuarioConId]); // Agregar usuario a la lista
    setMostrarRegistro(false); // Cerrar el formulario
  };

  return (
    <>
  
      <Encabezado
        titEncabezado="Usuarios"
        conBtCrear="Crear Usuario"
        onClick={() => setMostrarRegistro(true)}
      />
      <SepXNegro />

      <div className="usuarios">
        <ConUsuari txt1="Administrador" img1={ima.admi} txt2="Sastre" img2={ima.metro} />
      </div>

      <div className="tablas">
        <div className="tabla-container">
          <table className="tabla">
            <thead className="th-tabla">
              <tr className="separacion-fila-head"></tr>
              <tr className="tr-encabezado">
                <th className="th">Nombre</th>
                <th className="th">Apellido</th>
                <th className="th">Teléfono</th>
                <th className="th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.filter(usuario => usuario.rol === "admin").map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellido}</td>
                  <td>{usuario.telefono}</td>
                  <td>
                    <div className="acciones">
                      <button className="btn-editar">Editar</button>
                      <button className="btn-eliminar">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="tabla-container">
          <table className="tabla">
            <thead className="th-tabla">
              <tr className="separacion-fila-head"></tr>
              <tr className="tr-encabezado">
                <th className="th">Nombre</th>
                <th className="th">Apellido</th>
                <th className="th">Teléfono</th>
                <th className="th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.filter(usuario => usuario.rol === "sastre").map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellido}</td>
                  <td>{usuario.telefono}</td>
                  <td>
                    <div className="acciones">
                      <button className="btn-editar">Editar</button>
                      <button className="btn-eliminar">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {mostrarRegistro && (
        <RegistroUsuario
          onClose={() => setMostrarRegistro(false)}
          onSubmit={handleRegistrarUsuario}
        />
      )}
    </>
  );
}
