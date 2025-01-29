import React, { useState } from "react";
import "./registroUsuario.css";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";

export function RegistroUsuario({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    nombreUsuario: "",
    password: "",
    email: "",
    telefono: "",
    rol: "rol", // Campo de rol inicializado
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.apellido.trim()) newErrors.apellido = "El apellido es requerido";
    if (!formData.nombreUsuario.trim()) newErrors.nombreUsuario = "El nombre de usuario es requerido";
    if (!formData.password.trim()) newErrors.password = "La contraseña es requerida";
    if (formData.password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    if (!formData.email.trim()) newErrors.email = "El correo es requerido";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "El correo no es válido";
    if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es requerido";
    if (!/^\d{10}$/.test(formData.telefono)) newErrors.telefono = "El teléfono debe tener 10 dígitos";
    if (formData.rol === "rol") newErrors.rol = "El rol es requerido"; // Validación para el rol

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSubmit({
        nombre: formData.nombre,
        apellido: formData.apellido,
        contacto: formData.telefono,
        tipo: formData.rol,  // Rol añadido al objeto enviado
        email: formData.email,
      });
      onClose();
    } catch (error) {
      console.error("Error de registro:", error);
      alert("Error al registrar usuario. Por favor intente de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="absolute">
          <div className="window-controls">
            <div className="window-control window-close" onClick={onClose} />
            <div className="window-control window-minimize" />
            <div className="window-control window-maximize" />
          </div>
        </div>

        <div className="r-usuario">
          <span className="titulo">Registrar Usuario</span>
        </div>
        <SepXNegro/>
        <form onSubmit={handleSubmit} className="formulario">
          <div className="">
            <div>
              <label className="form-label">Nombre de pila</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`form-input ${errors.nombre ? "" : ""}`}
                placeholder="Ingrese nombre"
              />
              {errors.nombre && <p className="">{errors.nombre}</p>}
            </div>

            <div>
              <label className="form-label">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className={`form-input ${errors.apellido ? "" : ""}`}
                placeholder="Ingrese apellido"
              />
              {errors.apellido && <p className="">{errors.apellido}</p>}
            </div>
          </div>

          <div>
            <label className="form-label">Nombre de usuario</label>
            <input
              type="text"
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
              className={`form-input ${errors.nombreUsuario ? "" : ""}`}
              placeholder="Ingrese nombre de usuario"
            />
            {errors.nombreUsuario && <p className="">{errors.nombreUsuario}</p>}
          </div>

          <div>
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? "" : ""}`}
              placeholder="Ingrese correo electrónico"
            />
            {errors.email && <p className="">{errors.email}</p>}
          </div>

          <div>
            <label className="form-label">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className={`form-input ${errors.telefono ? "" : ""}`}
              placeholder="Ingrese teléfono"
            />
            {errors.telefono && <p className="">{errors.telefono}</p>}
          </div>

          <div>
            <label className="form-label">Rol</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className={`form-input ${errors.rol ? "" : ""}`}
            >
              <option value="rol" disabled>
                Seleccione un rol
              </option>
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
            </select>
            {errors.rol && <p className="">{errors.rol}</p>}
          </div>

          <div>
            <label className="form-label">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? "" : ""}`}
                placeholder="Ingrese contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className=""
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {errors.password && <p className="">{errors.password}</p>}
          </div>

          <div className="boton">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? (
                <div className="">
                  <div className="animate-spin"></div>
                  Registrando...
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
