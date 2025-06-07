import { useState, useEffect } from "react";
import "./registroUsuario.css";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import axios from "axios";

import Mostrar from "../../../../public/media/img/ver.png";
import Ocultar from "../../../../public/media/img/esconder.png";

export function RegistroUsuario({ onClose, actualizaTabla }) {
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
    if (!formData.name.trim()) newErrors.name = "*";
    if (!formData.lastname.trim()) newErrors.lastname = "*";
    if (!formData.username.trim()) newErrors.username = "*";
    if (!formData.password.trim()) newErrors.password = "*";
    if (!formData.email.trim()) newErrors.email = "*";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Correo no válido";
    if (!formData.phone.trim()) newErrors.phone = "*";
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "10 dígitos";
    if (!formData.user_role) newErrors.user_role = "Selecciona rol";
    if (!formData.cargo) newErrors.cargo = "Selecciona cargo";

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
      const response = await axios.post(
        "http://localhost:8080/register",
        formData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      actualizaTabla();
      onClose();
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 500) {
        alert("Este usuario ya existe");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="tit-creandoP">Registrar Usuario</span>
        <SepXNegro />
        <form className="formulario">
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? "form-input-error" : ""}`}
              placeholder="Admin"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="lastname">
              Apellido
            </label>
            <input
              id="lastname"
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className={`form-input ${
                errors.lastname ? "form-input-error" : ""
              }`}
              placeholder="Principal"
            />
            {errors.lastname && (
              <span className="form-error">{errors.lastname}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`form-input ${
                errors.username ? "form-input-error" : ""
              }`}
              placeholder="Admin"
            />
            {errors.username && (
              <span className="form-error">{errors.username}</span>
            )}
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <label className="form-label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input form-input-noCapitalize ${
                errors.password ? "form-input-error" : ""
              }`}
              placeholder="∗ ∗ ∗ ∗ ∗ ∗ ∗ ∗ ∗ ∗"
            />

            {errors.password && (
              <span className="form-error">{errors.password}</span>
            )}
            <button
              type="button"
              className="btn-ver-contrasena"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img
                src={showPassword ? Ocultar : Mostrar}
                alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="icono-ver"
              />
            </button>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input form-input-noCapitalize ${
                errors.email ? "form-input-error" : ""
              }`}
              placeholder="ejemplo@gmail.com"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Teléfono
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`form-input ${errors.phone ? "form-input-error" : ""}`}
              placeholder="1234567890"
            />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cargo">
              Cargo
            </label>
            <select
              id="cargo"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              className={`form-input ${errors.cargo ? "form-input-error" : ""}`}
            >
              <option value="">Seleccione un cargo</option>
              <option value="ADMIN">Administrador</option>
              <option value="SASTRE">Sastre</option>
            </select>
            {errors.cargo && <span className="form-error">{errors.cargo}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="user_role">
              Rol
            </label>
            <select
              id="user_role"
              name="user_role"
              value={formData.user_role}
              onChange={handleChange}
              className={`form-input ${
                errors.user_role ? "form-input-error" : ""
              }`}
            >
              <option value="">Seleccione un rol</option>
              <option value="ADMIN">Administrador</option>
              <option value="USER">Usuario</option>
            </select>
            {errors.user_role && (
              <span className="form-error">{errors.user_role}</span>
            )}
          </div>
        </form>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn-crear-usuario"
        >
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
    </div>
  );
}
