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

export default function Usuarios() {
  const [admins, setAdmins] = useState([]);
  const [sastres, setSastres] = useState([]);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Obtener lista de usuarios
  const cargarUsuarios = async () => {
    try {
      setCargando(true);
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
      setError(null);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setError("No se pudieron cargar los usuarios");
    } finally {
      setCargando(false);
    }
  };

  // Registrar usuarios
const registrarUsuarios = (newUser) => {
  // Agregar el nuevo usuario directamente al estado correspondiente
  if (newUser.cargo === "ADMIN") {
    setAdmins(prev => [...prev, newUser]);
  } else if (newUser.cargo === "SASTRE") {
    setSastres(prev => [...prev, newUser]);
  }
  setMostrarRegistro(false); // Cerrar modal
};
  //Editar usuario
  const actualizarUsuario = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `http://localhost:8080/users/update/${userData.id}`,
        {
          ...formData,
          user_role: formData.user_role.toUpperCase(),
          cargo: formData.cargo.toUpperCase(),
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        await cargarUsuarios(); 
        onClose(); 
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      alert(
        "Error al actualizar usuario: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsSubmitting(false);
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
                  <img src={Editar} alt="Editar" className="icono-editar" />
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
        imgBoton={"../../../../public/media/img/crear.png"}
      />
      <SepXNegro />
      <div className="cont-filterAndBoton">
        <Filtrador>
          <OpcionesFilter
            txtFilter={"Administradores"}
            clase={"azul filter-usuarios"}
          />
          <OpcionesFilter
            txtFilter={"Sastres"}
            clase={"verde filter-usuarios"}
          />
        </Filtrador>
      </div>

      <div className="tablas">
        <div className="tabla-container">{renderTablaUsuarios(admins)}</div>

        <div className="tabla-container">{renderTablaUsuarios(sastres)}</div>
      </div>

      {mostrarRegistro && (
        <RegistroUsuario
          onClose={() => setMostrarRegistro(false)}
          onSubmit={registrarUsuarios}
        />
      )}
      {mostrarEditar && (
        <EditarUsuario
          usuario={actualizarUsuario}
          onClose={() => {
            setMostrarEditar(false);
            setUsuarioEditando(null);
          }}
          idUser={idUser}
        />
      )}
    </>
  );
}
