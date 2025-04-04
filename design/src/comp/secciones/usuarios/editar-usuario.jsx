import React, { useState, useEffect, useRef } from "react";
import "./editarUsuario.css";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import { tokenPass } from "../../formularios/iniciar-sesion/iniciar-sesion.jsx";
import axios from "axios";

export function EditarUsuario({ idUser }) {
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
            Authorization: `Bearer ${tokenPass}`,
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
            Authorization: `Bearer ${tokenPass}`,
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
    <div className="div">
      <h1>Editar usuario</h1>

      <label htmlFor="">Nombre</label>
      <input type="text" ref={nombreRef} />

      <label htmlFor="">Apellido</label>
      <input type="text" ref={apellidoRef} />

      <label htmlFor="">Username</label>
      <input type="text" ref={usernameRef} />

      <label htmlFor="">Correo</label>
      <input type="text" ref={correoRef} />

      <label htmlFor="">Telefono</label>
      <input type="number" ref={telefonoRef} />

      <label htmlFor="">Rol</label>
      <select name="" id="" ref={rolRef}>
        <option value="ADMIN">Administrador</option>
        <option value="USER">Usuario</option>
      </select>

      <label htmlFor="">Cargo</label>
      <select name="" id="" ref={cargoRef}>
        <option value="ADMIN">Admin</option>
        <option value="SASTRE">Satre</option>
      </select>

      <button onClick={() => actualizarUsuario()}>Actualizar</button>
    </div>
  );
}
