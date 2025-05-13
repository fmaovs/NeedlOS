import React, { useState, useEffect, useRef } from "react";
import "./editarUsuario.css";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import axios from "axios";

export function EditarUsuario({ onClose, idUser }) {
  /*Campos del formulario*/
  const nombreRef = useRef(null);
  const apellidoRef = useRef(null);
  const usernameRef = useRef(null);
  const correoRef = useRef(null);
  const telefonoRef = useRef(null);
  const rolRef = useRef(null);
  const cargoRef = useRef(null);

  useEffect(() => {
    mostrarDatos();
  }, []);

  /*Insertar datos del usuario*/
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
    } catch (error) {
      console.error(error);
    }
  }

  /*Solicitud para actualizar usuario*/
  async function actualizarUsuario() {
    try {
      const response = await axios.put(
        `http://localhost:8080/users/update/{id}?id=${idUser}`,
        {
          name: nombreRef.current.value,
          lastname: apellidoRef.current.value,
          email: correoRef.current.value,
          phone: telefonoRef.current.value,
          username: usernameRef.current.value,
          user_role: rolRef.current.value,
          cargo: cargoRef.current.value,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log("Usuario has been updated");
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="r-usuario">
          <h1 className="titulo">Editar usuario</h1>
        </div>
        <div className="formulario">
          <div className="from-group">
            <label className="form-label">Nombre</label>
            <input type="text" ref={nombreRef} className="form-input" />
          </div>

          <div className="from-group">
            <label className="form-label">Apellido</label>
            <input type="text" ref={apellidoRef} className="form-input" />
          </div>

          <div className="from-group">
            <label className="form-label">Username</label>
            <input type="text" ref={usernameRef} className="form-input" />
          </div>

          <div className="from-group">
            <label className="form-label">Correo</label>
            <input type="text" ref={correoRef} className="form-input" />
          </div>

          <div className="from-group">
            <label className="form-label">Teléfono</label>
            <input type="number" ref={telefonoRef} className="form-input" />
          </div>

          <div className="from-group">
            <label className="form-label">Rol</label>
            <select ref={rolRef} className="form-input-rol">
              <option value="ADMIN">Administrador</option>
              <option value="USER">Usuario</option>
            </select>
          </div>

          <div className="from-group">
            <label className="form-label">Cargo</label>
            <select ref={cargoRef} className="form-cargo">
              <option value="ADMIN">Admin</option>
              <option value="SASTRE">Sastre</option>
            </select>
          </div>
          <div className="from-botton">
          <button
              type = "button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button className="btn-primary" onClick={actualizarUsuario}>
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
