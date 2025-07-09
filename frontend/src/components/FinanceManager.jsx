import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import '../css/Finance.css';

const FinanceManager = () => {
  const { token } = useAuth();
  const [finances, setFinances] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    patient: 'all',
    startDate: '',
    endDate: ''
  });

  // Estado del formulario
  const [formData, setFormData] = useState({
    patient: '',
    concept: '',
    amount: '',
    status: 'pending',
    dueDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchFinances();
    fetchPatients();
  }, []);
 
  const fetchFinances = async () => {
    try {
      const response = await axios.get('/api/finances', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFinances(response.data);
    } catch (error) {
      console.error('Error fetching finances:', error);
      setError('Error al cargar las finanzas');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/api/patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredFinances = finances.filter(finance => {
    if (filters.status !== 'all' && finance.status !== filters.status) {
      return false;
    }
    if (filters.patient !== 'all' && finance.patient?._id !== filters.patient) {
      return false;
    }
    if (filters.startDate && new Date(finance.createdAt) < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && new Date(finance.createdAt) > new Date(filters.endDate)) {
      return false;
    }
    return true;
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.patient || !formData.concept || !formData.amount) {
      setError('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      const financeData = {
        ...formData,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };

      await axios.post('/api/finances', financeData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Resetear formulario
      setFormData({
        patient: '',
        concept: '',
        amount: '',
        status: 'pending',
        dueDate: '',
        notes: ''
      });

      setShowForm(false);
      fetchFinances(); // Recargar la lista

    } catch (error) {
      console.error('Error creating finance:', error);
      setError(error.response?.data?.message || 'Error al crear el movimiento financiero');
    }
  };

  const updateFinanceStatus = async (financeId, newStatus) => {
    try {
      await axios.patch(`/api/finances/${financeId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFinances(); // Recargar la lista
    } catch (error) {
      console.error('Error updating finance status:', error);
      setError('Error al actualizar el estado');
    }
  };

  const getTotalAmount = () => {
    return filteredFinances.reduce((total, finance) => total + finance.amount, 0);
  };

  const getPendingAmount = () => {
    return filteredFinances
      .filter(finance => finance.status === 'pending')
      .reduce((total, finance) => total + finance.amount, 0);
  };

  const getPaidAmount = () => {
    return filteredFinances
      .filter(finance => finance.status === 'paid')
      .reduce((total, finance) => total + finance.amount, 0);
  };

  if (loading) {
    return <div className="loading-spinner">Cargando finanzas...</div>;
  }

  return (
    <div className="finance-manager">
      <div className="finance-header">
        <h2 className="finance-title">Gestión Financiera</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          ➕ Nuevo Movimiento
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Resumen financiero */}
      <div className="finance-summary">
        <div className="summary-card">
          <h3>Total</h3>
          <p className="amount">${getTotalAmount().toFixed(2)}</p>
        </div>
        <div className="summary-card pending">
          <h3>Pendiente</h3>
          <p className="amount">${getPendingAmount().toFixed(2)}</p>
        </div>
        <div className="summary-card paid">
          <h3>Pagado</h3>
          <p className="amount">${getPaidAmount().toFixed(2)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="finance-filters">
        <div className="filter-group">
          <label>Estado:</label>
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="all">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="paid">Pagado</option>
            <option value="overdue">Vencido</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Paciente:</label>
          <select name="patient" value={filters.patient} onChange={handleFilterChange}>
            <option value="all">Todos</option>
            {patients.map(patient => (
              <option key={patient._id} value={patient._id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Desde:</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>Hasta:</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Formulario de nuevo movimiento */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Nuevo Movimiento Financiero</h3>
              <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="finance-form">
              <div className="form-group">
                <label>Paciente *</label>
                <select
                  name="patient"
                  value={formData.patient}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Seleccione un paciente</option>
                  {patients.map(patient => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Concepto *</label>
                <input
                  type="text"
                  name="concept"
                  value={formData.concept}
                  onChange={handleFormChange}
                  placeholder="Limpieza dental, consulta, etc."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Monto *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    value={formData.amount}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Estado</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagado</option>
                    <option value="overdue">Vencido</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Fecha de Vencimiento</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label>Notas</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  rows="3"
                  placeholder="Notas adicionales..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Crear Movimiento
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de movimientos */}
      <div className="finance-list">
        {filteredFinances.length === 0 ? (
          <div className="empty-state">
            <p>No hay movimientos financieros que mostrar</p>
          </div>
        ) : (
          <div className="finance-table">
            <div className="table-header">
              <div>Fecha</div>
              <div>Paciente</div>
              <div>Concepto</div>
              <div>Monto</div>
              <div>Estado</div>
              <div>Acciones</div>
            </div>
            
            {filteredFinances.map(finance => (
              <div key={finance._id} className="table-row">
                <div>
                  {format(new Date(finance.createdAt), 'dd/MM/yyyy', { locale: es })}
                </div>
                <div>{finance.patient?.name}</div>
                <div>{finance.concept}</div>
                <div className="amount">${finance.amount.toFixed(2)}</div>
                <div>
                  <span className={`status-badge ${finance.status}`}>
                    {finance.status === 'pending' ? 'Pendiente' : 
                     finance.status === 'paid' ? 'Pagado' : 'Vencido'}
                  </span>
                </div>
                <div className="actions">
                  {finance.status === 'pending' && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => updateFinanceStatus(finance._id, 'paid')}
                    >
                      Marcar Pagado
                    </button>
                  )}
                  {finance.status === 'paid' && (
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => updateFinanceStatus(finance._id, 'pending')}
                    >
                      Marcar Pendiente
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceManager;
