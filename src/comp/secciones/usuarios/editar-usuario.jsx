import { useState, useEffect, useRef } from "react";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import "./registroUsuario.css";
import axios from "axios";

export function EditarUsuario({ onClose, idUser, actualizarTabla }) {
  const nombreRef = useRef(null);
  const apellidoRef = useRef(null);
  const usernameRef = useRef(null);
  const correoRef = useRef(null);
  const telefonoRef = useRef(null);
  const rolRef = useRef(null);
  const cargoRef = useRef(null);
  const estadoRef = useRef(null);

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
      estadoRef.current.checked = !response.data.estado;
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

    // Validaciones
    if (username.length < 5) {
      alert("El nombre de usuario debe tener al menos 5 caracteres.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("El correo electrónico no es válido.");
      return;
    }

    if (!/^\d{10}$/.test(telefono)) {
      alert("El teléfono debe tener exactamente 10 dígitos.");
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
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log("Usuario actualizado");
      actualizarTabla();
      onClose();
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:8080/users/${idUser}/Estado?enabled=${!estadoRef
          .current.checked}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <span className="tit-creandoP tit-form">Editar usuario</span>
          <SepXNegro />
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
              <input
                type="email"
                ref={correoRef}
                className="form-input form-input-noCapitalize"
              />
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

            <div className="form-group-check">
              <label className="form-label" htmlFor="estadoUsuarioCheck">
                Suspendido?
              </label>
              <input
                id="estadoUsuarioCheck"
                ref={estadoRef}
                className="checkboxUsuario"
                type="checkbox"
              />
            </div>
          </div>
          <div className="cont-btn-usuario">
            <button
              type="button"
              className="btn-crear-usuario"
              onClick={actualizarUsuario}
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
