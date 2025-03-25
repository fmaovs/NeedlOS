import React, { useState, useEffect } from "react";
import "./editarUsuario.css";
import SepXNegro from "../../separadores/sep-x-negro/sep-x-negro.jsx";
import { tokenPass } from "../../formularios/iniciar-sesion/iniciar-sesion.jsx";
import axios from "axios";

export function EditarUsuario({ userData, onClose, onUpdate }) {
  const [formData, setFormData] = useState(userData || {});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData(userData);
    }
  }, [userData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.lastname?.trim()) newErrors.lastname = "El apellido es requerido";
    if (!formData.username?.trim()) newErrors.username = "El nombre de usuario es requerido";
    if (!formData.email?.trim()) newErrors.email = "El email es requerido";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "El correo no es válido";
    if (!String(formData.phone).trim()) newErrors.phone = "El teléfono es requerido";
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
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    if (!validateForm()) {
      console.log("Errores en el formulario:", errors);
      return;
    }

    if (!userData?.id) {
      alert("Error: No se encontró el ID del usuario.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `http://localhost:8080/users/update/${userData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${tokenPass}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        onUpdate(response.data);
        onClose();
      } else {
        throw new Error("Error al actualizar usuario");
      }
    } catch (error) {
      console.error("Error de actualización:", error);
      setErrors({ submit: "Error al actualizar usuario: " + (error.response?.data?.message || error.message) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="r-usuario">
          <span className="titulo">Editar Usuario</span>
        </div>
        <SepXNegro />
        <form onSubmit={handleSubmit} className="formulario">
          {errors.submit && <p className="form-error">{errors.submit}</p>}
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name || ""} 
              onChange={handleChange} 
              className={`form-input ${errors.name ? 'form-input-error' : ''}`} 
              placeholder="Ingrese nombre" 
              required
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Apellido</label>
            <input 
              type="text" 
              name="lastname" 
              value={formData.lastname || ""} 
              onChange={handleChange} 
              className={`form-input ${errors.lastname ? 'form-input-error' : ''}`} 
              placeholder="Ingrese apellido" 
              required
            />
            {errors.lastname && <p className="form-error">{errors.lastname}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email || ""} 
              onChange={handleChange} 
              className={`form-input ${errors.email ? 'form-input-error' : ''}`} 
              placeholder="Ingrese email" 
              required
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone || ""} 
              onChange={handleChange} 
              className={`form-input ${errors.phone ? 'form-input-error' : ''}`} 
              placeholder="Ingrese teléfono" 
              required
            />
            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Rol</label>
            <select 
              name="user_role" 
              value={formData.user_role || ""} 
              onChange={handleChange} 
              className={`form-input-rol ${errors.user_role ? 'form-input-error' : ''}`}
              required
            >
              <option value="">Seleccione un rol</option>
              <option value="ADMIN">Administrador</option>
              <option value="USER">Usuario</option>
            </select>
            {errors.user_role && <p className="form-error">{errors.user_role}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Cargo</label>
            <select 
              name="cargo" 
              value={formData.cargo || ""} 
              onChange={handleChange} 
              className={`form-cargo ${errors.cargo ? 'form-input-error' : ''}`}
              required
            >
              <option value="">Seleccione un cargo</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SASTRE">SASTRE</option>
            </select>
            {errors.cargo && <p className="form-error">{errors.cargo}</p>}
          </div>
          <div className="form-buttons">
            <button 
            type="button" 
            onClick={onClose} className="btn-secondary">Cancelar</button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="btn-primary"
            >
             {isSubmitting ? (
                <div className="items">
                    <div className="loading-spinner"></div>
                    <span className="ml-2">Actualizar...</span>
                </div>
             ) : (
                'Actualizar Usuario'
             )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}