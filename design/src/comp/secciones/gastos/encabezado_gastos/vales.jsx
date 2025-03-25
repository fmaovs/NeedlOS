import React, { useState } from 'react';
import './vales.css';
import excel from '../../../../../public/media/img/excel.png'
import lupa from '../../../../../public/media/img/buscar.png'

export const Vales = () => {
  const [formData, setFormData] = useState({
    nombreEmpleado: '',
    valor: ''
  });

  const mockData = [
    { novedad: 'ValeEduardo', fecha: '26 / 05 / 2024', valor: '$ 10.000', usuario: 'Sara Ordoñes' },
    { novedad: 'ValeEduardo', fecha: '26 / 05 / 2024', valor: '$ 10.000', usuario: 'Sara Ordoñes' },
    { novedad: 'ValeEduardo', fecha: '26 / 05 / 2024', valor: '$ 10.000', usuario: 'Sara Ordoñes' },
    { novedad: 'ValeEduardo', fecha: '26 / 05 / 2024', valor: '$ 10.000', usuario: 'Sara Ordoñes' },
    { novedad: 'ValeEduardo', fecha: '26 / 05 / 2024', valor: '$ 10.000', usuario: 'Sara Ordoñes' },
    { novedad: 'ValeEduardo', fecha: '26 / 05 / 2024', valor: '$ 45.000', usuario: 'Sara Ordoñes' },
    { novedad: 'ValeEduardo', fecha: '26 / 05 / 2024', valor: '$ 10.000', usuario: 'Sara Ordoñes' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="container-vales">
      <div className="vales-section">
        <div className="form-section">
          <form onSubmit={handleSubmit} className="vales-form">
            <div className="form-group">
              <label className="form-label">Nombre Emleado:</label>
              <input
                type="text"
                name="nombreEmpleado"
                value={formData.nombreEmpleado}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Valor:</label>
              <input
                type="text"
                name="valor"
                value={formData.valor}
                onChange={handleInputChange}
                className="form-valor"
              />
            </div>
          </form>
        </div>

        {/* Buttons Section */}
        <div className="buttons-section">
          <button className="action-button excel-button">
            <span className="button-icon">📊</span>
            Descargar en excell
          </button>
          <button className="action-button search-button">
            <span className="button-icon">🔍</span>
            Consultar
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <table className="expenses-table">
          <thead>
            <tr className="table-header-row">
              <th>Novedad</th>  
              <th>Fecha</th>
              <th>Valor</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                <td>{row.novedad}</td>
                <td>{row.fecha}</td>
                <td>{row.valor}</td>
                <td>{row.usuario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Vales;