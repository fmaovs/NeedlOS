import React, { useState, useEffect } from 'react';
import "./GastosDiarios.css";
import axios from 'axios';
import { tokenPass } from '../../../formularios/iniciar-sesion/iniciar-sesion';

const CODIGOS_GASTOS = {
  '001': 'Onces',
  '002': 'Bolsas',
  '003': 'Jabón',
  '004': 'Papel',
  '005': 'Vale'
};

export const GastosDiarios = () => {
  const [formData, setFormData] = useState({
    concepto: '',
    monto: ''
  });
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarGastos();
  }, []);

  const cargarGastos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/gastos/all',
        {
        headers: {
          Authorization:`Bearer ${tokenPass}`,

        },
        });
      setGastos(response.data);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Error al cargar los gastos');
      } else {
        setError('Error desconocido al cargar los gastos');
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'valor' ? (value ? parseFloat(value) : '') : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.concepto || !formData.monto || formData.monto <= 0) {
      setError('Por favor, completa todos los campos correctamente.');
      return;
    }

    try {
      setLoading(true);
      await axios.post('http://localhost:8080/gastos/crear',{
        ...formData,
        },
        {
        headers:{
          Authorization:`Bearer ${tokenPass}`,
          "Content-Type": "application/json",
        }
      });
      setFormData({ concepto: '', monto: '' });
      await cargarGastos();
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(error)) {
        setError(err.response?.data?.message || 'Error al crear el gasto');
      } else {
        setError('Error desconocido al crear el gasto');
      }
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gastos-diarios-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="gastos-section">
        {/* Formulario */}
        <div className="form-section">
          <form className="gastos-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Concepto</label>
              <input 
                type="text"
                name="concepto"
                className="form-input"
                value={formData.concepto}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="Ingrese código (ej: 001) o nombre"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Valor</label>
              <input 
                type="number"
                name="valor"
                className="form-input"
                value={formData.monto}
                onChange={handleInputChange}
                disabled={loading}
                min="0"
              />
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Agregando...' : 'Agregar Gasto'}
            </button>
          </form>
        </div>

        {/* Tabla de códigos de gastos */}
        <div className="codes-table-section">
          <table className="codes-table">
            <thead>
              <tr>
                <th colSpan={2} className="table-header">Código gastos</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(CODIGOS_GASTOS).map(([codigo, nombre]) => (
                <tr key={codigo}>
                  <td>{nombre}</td>
                  <td>{codigo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de gastos */}
      <div className="expenses-table-container">
        <table className="expenses-table">
          <thead>
            <tr className="table-header-row">
              <th>Gasto</th>
              <th>Valor</th>
              <th>Realizo</th>
            </tr>
          </thead>
          <tbody>
            {gastos.map((gasto, index) => (
              <tr key={gasto.id || index}>
                <td>{gasto.concepto}</td>
                <td>{gasto.mon.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                <td>{gasto.realizo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GastosDiarios;