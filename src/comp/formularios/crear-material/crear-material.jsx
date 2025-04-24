import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CrearMaterial() {
  const [material, setMaterial] = useState({
    idMaterial: "",
    nombre: "",
    descripcion: "",
    stock_actual: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterial((prevMaterial) => ({
      ...prevMaterial,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/inventario/nuevo",
        material,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Material creado exitosamente
      console.log("Material creado:", response.data);

      // Opcional: Redirigir a lista de materiales o mostrar mensaje de éxito
      navigate("/inventario/nuevo");
    } catch (error) {
      setError("Error al crear el material");
      console.error("Error:", error);
    }
  };

  return (
    <div className="crear-material-container">
      <form onSubmit={handleSubmit}>
        <div>
          <span>ID Material</span>
          <input
            type="number"
            name="idMaterial"
            value={material.idMaterial}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <span>Nombre</span>
          <input
            type="text"
            name="nombre"
            value={material.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <span>Descripción</span>
          <input
            type="text"
            name="descripcion"
            value={material.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <span>Cantidad</span>
          <input
            type="number"
            name="stock_actual"
            value={material.stock_actual}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
        )}

        <button type="submit">Crear Material</button>
      </form>
    </div>
  );
}
