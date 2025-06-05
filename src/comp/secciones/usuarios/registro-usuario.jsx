import React, { useState, useEffect } from "react";
import "./registroUsuario.css";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import axios from "axios";

import Mostrar from "../../../../public/media/img/ver.png";
import Ocultar from "../../../../public/media/img/esconder.png";

export function RegistroUsuario({ onClose, onSubmit, actualizaTabla }) {
  const initialFormState = {
    name: "",
    lastname: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    user_role: "",
    cargo: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    return () => {
      setFormData(initialFormState);
      setErrors({});
      setShowPassword(false);
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.lastname.trim()) newErrors.lastname = "El apellido es requerido";
    if (!formData.username.trim()) newErrors.username = "El nombre del usuario es requerido";
    if (!formData.password.trim()) newErrors.password = "La contraseña es requerida";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "El correo no es válido";
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido";
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "El teléfono debe tener 10 dígitos";
    if (!formData.user_role) newErrors.user_role = "El rol es requerido";
    if (!formData.cargo) newErrors.cargo = "El cargo es requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:8080/register", formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      if (response.status === 201) {
        const newUser = response.data;
        onSubmit(newUser);
        actualizaTabla();
        onClose();
      } else {
        throw new Error("Error al registrar usuario");
      }
    } catch (error) {
      console.error("Error de registro:", error);
      const mensaje = error.response?.data?.message || error.message;

      const newErrors = { ...errors };
      if (mensaje.includes("username")) newErrors.username = "Este usuario ya existe";
      if (mensaje.includes("email")) newErrors.email = "Este correo ya está registrado";

      setErrors(newErrors);
      alert("Error al registrar usuario");
    } finally {
      setIsSubmitting(false);
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
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={`form-input ${errors.name ? "form-input-error" : ""}`} placeholder="Ingrese nombre" />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Apellido</label>
            <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className={`form-input ${errors.lastname ? "form-input-error" : ""}`} placeholder="Ingrese apellido" />
            {errors.lastname && <p className="form-error">{errors.lastname}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Nombre de Usuario</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className={`form-input ${errors.username ? "form-input-error" : ""}`} placeholder="Ingrese nombre de usuario" />
            {errors.username && <p className="form-error">{errors.username}</p>}
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <label className="form-label">Contraseña</label>
            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className={`form-input ${errors.password ? "form-input-error" : ""}`} placeholder="Ingrese contraseña" />
            <button type="button" className="btn-ver-contrasena" onClick={() => setShowPassword(!showPassword)}>
              <img src={showPassword ? Ocultar : Mostrar} alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} className="icono-ver" />
            </button>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={`form-input ${errors.email ? "form-input-error" : ""}`} placeholder="Ingrese email" />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`form-input ${errors.phone ? "form-input-error" : ""}`} placeholder="Ingrese teléfono" />
            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Cargo</label>
            <select name="cargo" value={formData.cargo} onChange={handleChange} className={`form-input ${errors.cargo ? "form-input-error" : ""}`}>
              <option value="">Seleccione un cargo</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SASTRE">SASTRE</option>
            </select>
            {errors.cargo && <p className="form-error">{errors.cargo}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Rol</label>
            <select name="user_role" value={formData.user_role} onChange={handleChange} className={`form-input ${errors.user_role ? "form-input-error" : ""}`}>
              <option value="">Seleccione un rol</option>
              <option value="ADMIN">Administrador</option>
              <option value="USER">Usuario</option>
            </select>
            {errors.user_role && <p className="form-error">{errors.user_role}</p>}
          </div>

          <div className="form-botton">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? (
                <div className="items">
                  <div className="loading-spinner"></div>
                  <span className="ml-2">Registrando...</span>
                </div>
              ) : (
                "Registrar Usuario"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

