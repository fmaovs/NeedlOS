import React, { useState } from 'react';
import "./GastosDiarios.css";

export const GastosDiarios = () => {
  const [formData, setFormData] = useState({
    tercero: '',
    concepto: '',
    valor: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="gastos-diarios-container">
      <div className="gastos-section">
        {/* Form Section */}
        <div className="form-section">
          <form className="gastos-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Tercero</label>
              <input 
                type="text"
                name="tercero"
                className="form-input"
                value={formData.tercero}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Concepto</label>
              <input 
                type="text"
                name="concepto"
                className="form-input"
                value={formData.concepto}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Valor</label>
              <input 
                type="number"
                name="valor"
                className="form-valor"
                value={formData.valor}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="submit-button">
              Agregar Gasto
            </button>
          </form>
        </div>

        {/* Codes Table Section */}
        <div className="codes-table-section">
          <table className="codes-table">
            <thead>
              <tr>
                <th colSpan={2} className="table-header">Código gastos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Onces</td>
                <td>001</td>
              </tr>
              <tr>
                <td>Bolsas</td>
                <td>002</td>
              </tr>
              <tr>
                <td>Jabón</td>
                <td>003</td>
              </tr>
              <tr>
                <td>Papel</td>
                <td>004</td>
              </tr>
              <tr>
                <td>Vale</td>
                <td>005</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Expenses Table Section */}
      <div className="expenses-table-container">
        <table className="expenses-table">
          <thead>
            <tr className="table-header-row">
              <th>Gasto</th>
              <th>Valor</th>
              <th>Tercero</th>
              <th>Realizo</th>
            </tr>
          </thead>
          <tbody>
            {/* Table content will be populated dynamically */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GastosDiarios;