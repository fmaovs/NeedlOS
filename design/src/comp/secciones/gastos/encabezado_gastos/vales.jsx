import React, { useState, useEffect } from 'react';
import './vales.css';
import axios from 'axios';
import { tokenPass } from '../../../formularios/iniciar-sesion/iniciar-sesion';
import { endOfWeek, startOfWeek } from 'date-fns';
 
import ConsultarIcono from '../../../../../public/media/img/buscar.png';

export default function Vales() {
  /** Traer empleados */
  const [empleados, setEmpleados] = useState([]);

  const traerEmpleados = async () => {
    try {
      const response = await axios.get('http://localhost:8080/users/all', {
        headers: {
          Authorization: `Bearer ${tokenPass}`,
        },
      });
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al traer empleados', error);
    }
  };

  useEffect(() => {
    traerEmpleados();
  }, []);

  /** Asignar rango de fecha */
  const [fechaDesde, setFechaDesde] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [fechaHasta, setFechaHasta] = useState(
    endOfWeek(new Date(), { weekStartsOn: 1 })
  );
  /** Crear gastos */
  const [nuevoGasto, setNuevoGasto] = useState({
    empleadoId: '',
    monto: '',
    fecha: '',
  });

  const crearGasto = async () => {
    if (!tokenPass) {
      console.error('No hay token de autenticación');
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:8080/gastos/crear',
        nuevoGasto,
        {
          headers: {
            Authorization: `Bearer ${tokenPass}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Gasto creado:', response.data);
      obtenerGastos(); // Actualiza la lista después de crear
    } catch (error) {
      console.error('Error al crear vale', error.response?.data || error.message);
    }
  };

  return (
    <div className="container-vales">
      {/* Sección superior */}
      <div className="vales-section">
        {/* Formulario */}
        <div className="form-section">
          <form className="vales-form">
            <div className="form-group">
              <label className="form-label">Nombre Empleado:</label>
              <input
                type="text"
                name="empleadoId"
                value={nuevoGasto.empleadoId}
                onChange={(e) => setNuevoGasto({ ...nuevoGasto, empleadoId: e.target.value })}
                className="form-input"
                placeholder="Ingrese Nombre Empleado"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Valor:</label>
              <input
                type="text"
                name="monto"
                value={nuevoGasto.monto}
                onChange={(e) => setNuevoGasto({ ...nuevoGasto, monto: e.target.value })}
                className="form-valor"
                placeholder="Ingrese un valor"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha Inicial:</label>
              <input
                type="date"
                value={fechaDesde.toISOString().split('T')[0]}
                onChange={(e) => setFechaDesde(new Date(e.target.value))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha Final:</label>
              <input
                type="date"
                value={fechaHasta.toISOString().split('T')[0]}
                onChange={(e) => setFechaHasta(new Date(e.target.value))}
                className="form-input"
              />
            </div>
          </form>
        </div>

        {/* Botones */}
        <div className="buttons-section">
          <button className="action-button search-button" onClick={obtenerGastos}>
            <img src={ConsultarIcono} alt="Buscar" className="button-icon" /> Consultar
          </button>
          <button className="action-button excel-button" onClick={crearGasto}>
            Crear Vale
          </button>
        </div>
      </div>

      {/* Tabla */}
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
            {gastos.map((gasto, index) => (
              <tr key={gasto.id || index} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                <td>{gasto.novedad}</td>
                <td>{new Date(gasto.fecha).toLocaleDateString()}</td>
                <td>${gasto.monto}</td>
                <td>{gasto.usuario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
