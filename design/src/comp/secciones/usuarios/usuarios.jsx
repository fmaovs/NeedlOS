import React, { useEffect, useState } from "react";
import Encabezado from "../../encabezado-seccion/encabezado.jsx";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import ConUsuari from "./con-usuario.jsx";
import "./usuarios.css";
import { EditarUsuario } from "./editar-usuario.jsx";
import { RegistroUsuario } from "./registro-usuario.jsx";
import { tokenPass } from "../../formularios/iniciar-sesion/iniciar-sesion.jsx";
import axios from "axios";

const ima = {
  admi: "../../../../public/media/img/administrador.png",
  metro: "../../../../public/media/img/metro.png",
  editar: "../../../../public/media/img/editar.png",
};

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
            Authorization: `Bearer ${tokenPass}`,
          },
        }),
        axios.get("http://localhost:8080/users/cargo/{cargo}?cargo=SASTRE", {
          headers: {
            Authorization: `Bearer ${tokenPass}`,
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
  const registrarUsuarios = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/register",
        {
          ...formData,
          user_role: formData.user_role.toUpperCase(),
          cargo: formData.cargo.toUpperCase(),
        },
        {
          headers: {
            Authorization: `Bearer ${tokenPass}`,
          },
        }
      );

      if (response.status === 201) {
        await cargarUsuarios();
        setMostrarRegistro(false);
      }
    } catch (error) {
      console.error("Error al registrar usuario", error);
      throw error;
    }
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
            Authorization: `Bearer ${tokenPass}`,
          },
        }
      );

      if (response.status === 200) {
        await cargarUsuarios(); // Recargar la lista de usuarios
        onClose(); // Cerrar modal
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
          <th className="th">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario) => (
          <tr key={usuario.id}>
            <td className="td-user">{usuario.name}</td>
            <td className="td-user">{usuario.lastname}</td>
            <td className="td-user">{usuario.phone}</td>
            <td>
              <div className="acciones">
                <button
                  className="btn-editar"
                  onClick={() => openEditarUsuario(usuario.id)}
                >
                  <img src={ima.editar} alt="Editar" className="icono-editar" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <Encabezado
        titEncabezado="Usuarios"
        conBtCrear="Crear Usuario"
        onClick={() => setMostrarRegistro(true)}
        imgBoton={"../../../../public/media/img/crear.png"}
      />
      <SepXNegro />

      <div className="usuarios">
        <ConUsuari
          txt1="Administrador"
          img1={ima.admi}
          txt2="Sastre"
          img2={ima.metro}
        />
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
