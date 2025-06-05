import React, { useState, useEffect, useRef } from "react";
import "./editarUsuario.css";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import axios from "axios";

export function EditarUsuario({ onClose, idUser, onUserUpdated }) {
  const nombreRef = useRef(null);
  const apellidoRef = useRef(null);
  const usernameRef = useRef(null);
  const correoRef = useRef(null);
  const telefonoRef = useRef(null);
  const rolRef = useRef(null);
  const cargoRef = useRef(null);

  const [estadoActivo, setEstadoActivo] = useState(true);
  const [telefonoOriginal, setTelefonoOriginal] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    mostrarDatos();
  }, []);

  async function mostrarDatos() {
    try {
      const response = await axios.get(
        `http://localhost:8080/users/${idUser}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      nombreRef.current.value = response.data.name;
      apellidoRef.current.value = response.data.lastname;
      usernameRef.current.value = response.data.username;
      correoRef.current.value = response.data.email;
      telefonoRef.current.value = response.data.phone;
      rolRef.current.value = response.data.rol;
      cargoRef.current.value = response.data.cargo;
      setEstadoActivo(response.data.active);
      setTelefonoOriginal(response.data.phone);
    } catch (error) {
      console.error(error);
    }
  }

  async function actualizarUsuario() {
    const nombre = nombreRef.current.value.trim();
    const apellido = apellidoRef.current.value.trim();
    const username = usernameRef.current.value.trim();
    const email = correoRef.current.value.trim();
    const telefono = telefonoRef.current.value.trim();
    const rol = rolRef.current.value;
    const cargo = cargoRef.current.value;

    if (!nombre || !apellido || !username || !email || !telefono || !rol || !cargo) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }

    if (telefono === telefonoOriginal) {
      setMensaje("Para guardar los cambios, debes modificar el teléfono.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/users/update/{id}?id=${idUser}`,
        {
          name: nombre,
          lastname: apellido,
          email: email,
          phone: telefono,
          username: username,
          user_role: rol,
          cargo: cargo,
          active: estadoActivo,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setMensaje("Usuario actualizado correctamente.");
        if (typeof onUserUpdated === "function") {
          onUserUpdated(); // ✅ Notificar al padre
        }

        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      setMensaje("Error al actualizar el usuario.");
    }
  }

  async function handleEstadoChange(e) {
    const nuevoEstado = e.target.checked;
    setEstadoActivo(nuevoEstado);
    try {
      await axios.patch(
        `http://localhost:8080/users/${idUser}/Estado?enabled=${nuevoEstado}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log("Estado actualizado con éxito");
    } catch (error) {
      console.error("Error al cambiar el estado", error);
      setEstadoActivo(!nuevoEstado);
    }
  }

  return (
    <>
      {mensaje && (
        <div className="editar-notificacion">
          {mensaje}
        </div>
      )}
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="r-usuario">
            <h1 className="titulo">Editar usuario</h1>
          </div>

          <div className="formulario">
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input type="text" ref={nombreRef} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Apellido</label>
              <input type="text" ref={apellidoRef} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <input type="text" ref={usernameRef} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Correo</label>
              <input type="email" ref={correoRef} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input type="number" ref={telefonoRef} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Rol</label>
              <select ref={rolRef} className="form-input">
                <option value="ADMIN">Administrador</option>
                <option value="USER">Usuario</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Cargo</label>
              <select ref={cargoRef} className="form-input">
                <option value="ADMIN">Admin</option>
                <option value="SASTRE">Sastre</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Estado del usuario</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={estadoActivo}
                  onChange={handleEstadoChange}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="form-buttons">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancelar
              </button>
              <button type="button" className="btn-primary" onClick={actualizarUsuario}>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
