import React, { useEffect, useState } from "react";
import Encabezado from "../../encabezado-seccion/encabezado.jsx";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import Filtrador from "../../filtrador-seccion/filtrador-seccion.jsx";
import OpcionesFilter from "../../opciones-filter/opciones-filter.jsx";
import "./usuarios.css";
import { EditarUsuario } from "./editar-usuario.jsx";
import { RegistroUsuario } from "./registro-usuario.jsx";
import axios from "axios";

const Editar = "../../../../public/media/img/editar.png";
const Mas = "../../../../public/media/img/crear.png";

export default function Usuarios() {
  const [admins, setAdmins] = useState([]);
  const [sastres, setSastres] = useState([]);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const [actualizarTabla, setActualizarTabla] = useState(false);
  useEffect(() => {
    cargarUsuarios();
  }, [actualizarTabla]);

  // Obtener lista de usuarios
  const cargarUsuarios = async () => {
    try {
      const [adminsRes, sastresRes] = await Promise.all([
        axios.get("http://localhost:8080/users/cargo/{cargo}?cargo=ADMIN", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }),
        axios.get("http://localhost:8080/users/cargo/{cargo}?cargo=SASTRE", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }),
      ]);

      setAdmins(adminsRes.data);
      setSastres(sastresRes.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setError("No se pudieron cargar los usuarios");
    }
  };

  const [idUser, setIdUser] = useState(null);
  function openEditarUsuario(id) {
    setMostrarEditar(!mostrarEditar);
    setIdUser(id);
  }

  const renderTablaUsuarios = (usuarios) => (
    <table className="tabla">
      <thead className="th-tabla">
        <tr className="separacion-fila-head"></tr>
        <tr className="tr-encabezado">
          <th className="th">Nombre</th>
          <th className="th">Apellido</th>
          <th className="th">Teléfono</th>
          <th className="th">Editar</th>
        </tr>
        <tr className="separacion-fila-head"></tr>
      </thead>
      <tbody>
        {usuarios.map((usuario) => (
          <React.Fragment key={usuario.id}>
            <tr>
              <td className="td">{usuario.name}</td>
              <td className="td">{usuario.lastname}</td>
              <td className="td">{usuario.phone}</td>
              <td className="td" onClick={() => openEditarUsuario(usuario.id)}>
                <button className="btn-editar-usuario">
                  <img src={Editar} alt="Editar" className="icono-editar" />
                </button>
              </td>
            </tr>
            <tr className="separacion-fila"></tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <Encabezado
        titEncabezado="Usuarios"
        opc1={"Rol"}
        opc2={"Nombre"}
        opc3={"Apellido"}
        opc4={"Telefono"}
        onClick={() => setMostrarRegistro(true)}
        imgBoton={Mas}
      />
      <SepXNegro />
      <div className="cont-filterAndBoton">
        <Filtrador>
          <OpcionesFilter
            txtFilter={"Administradores"}
            clase={"azul filter-usuarios"}
            tabIndex={"-1"}
          />
          <OpcionesFilter
            txtFilter={"Sastres"}
            clase={"verde filter-usuarios"}
            tabIndex={"-1"}
          />
        </Filtrador>
      </div>

      <div className="tablas">
        <div className="tabla-container">{renderTablaUsuarios(admins)}</div>

        <div className="tabla-container">{renderTablaUsuarios(sastres)}</div>
      </div>

      {mostrarRegistro && (
        <RegistroUsuario
          actualizaTabla={() => setActualizarTabla(!actualizarTabla)}
          onClose={() => setMostrarRegistro(false)}
        />
      )}
      {mostrarEditar && (
        <EditarUsuario
          actualizarTabla={() => setActualizarTabla(!actualizarTabla)}
          onClose={() => {
            setMostrarEditar(false);
          }}
          idUser={idUser}
        />
      )}
    </>
  );
}
