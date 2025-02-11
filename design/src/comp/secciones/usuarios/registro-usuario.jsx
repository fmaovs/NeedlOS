import React, { useState } from "react";
import "./registroUsuario.css";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import axios from "axios";

export function RegistroUsuario({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    nombreUsuario: "",
    password: "",
    email: "",
    telefono: "",
    rol: "rol",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/register",
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        const newUser = response.data;
        console.log("Usuario registrado:", newUser);
        onSubmit(newUser);
        onClose();
      } else {
        throw new Error("Error al registrar usuario");
      }
    } catch (error) {
      console.error("Error de registro:", error); 
      alert("Error al registrar usuario: " + error.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="r-usuario">
          <span className="titulo">Registrar Usuario</span>
        </div>
        <SepXNegro />
        <form onSubmit={handleSubmit} className="formulario">
          <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
          <input type="text" name="apellido" placeholder="Apellido" onChange={handleChange} required />
          <input type="text" name="nombreUsuario" placeholder="Nombre de Usuario" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Correo" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
          <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} required />
          <select name="rol" onChange={handleChange} required>
            <option value="rol">Seleccione un rol</option>
            <option value="admin">Administrador</option>
            <option value="sastre">Sastre</option>
          </select>
          <button type="submit">Registrar Usuario</button>
        </form>
      </div>
    </div>
  );
}
