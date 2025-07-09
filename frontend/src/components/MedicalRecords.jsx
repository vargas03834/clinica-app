import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import '../css/MedicalRecords.css';

const MedicalRecords = ({ patientId, patientName }) => {
  const { token } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    diagnosis: '',
    treatment: '',
    dentist: '',
    notes: '',
    prescriptions: '',
    nextAppointment: ''
  });

  useEffect(() => {
    if (patientId) {
      fetchRecords();
    }
  }, [patientId]);

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`/api/records?patient=${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
      setError('Error al cargar los registros médicos');
    } finally {
      setLoading(false);
    }
  };

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

    if (!formData.diagnosis || !formData.treatment) {
      setError('El diagnóstico y tratamiento son obligatorios');
      return;
    }

    try {
      const recordData = {
        ...formData,
        patient: patientId,
        nextAppointment: formData.nextAppointment ? new Date(formData.nextAppointment).toISOString() : null
      };

      if (editingRecord) {
        // Actualizar registro existente
        await axios.put(`/api/records/${editingRecord._id}`, recordData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Crear nuevo registro
        await axios.post('/api/records', recordData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // Resetear formulario
      setFormData({
        diagnosis: '',
        treatment: '',
        dentist: '',
        notes: '',
        prescriptions: '',
        nextAppointment: ''
      });

      setShowForm(false);
      setEditingRecord(null);
      fetchRecords(); // Recargar la lista

    } catch (error) {
      console.error('Error saving record:', error);
      setError(error.response?.data?.message || 'Error al guardar el registro');
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      dentist: record.dentist || '',
      notes: record.notes || '',
      prescriptions: record.prescriptions || '',
      nextAppointment: record.nextAppointment ? 
        new Date(record.nextAppointment).toISOString().split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (recordId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este registro?')) {
      try {
        await axios.delete(`/api/records/${recordId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchRecords(); // Recargar la lista
      } catch (error) {
        console.error('Error deleting record:', error);
        setError('Error al eliminar el registro');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      diagnosis: '',
      treatment: '',
      dentist: '',
      notes: '',
      prescriptions: '',
      nextAppointment: ''
    });
    setEditingRecord(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading-spinner">Cargando registros médicos...</div>;
  }

  return (
    <div className="medical-records">
      <div className="records-header">
        <h2 className="records-title">
          Ficha Clínica - {patientName}
        </h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          ➕ Nuevo Registro
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Formulario de nuevo/editar registro */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content modal-large">
            <div className="modal-header">
              <h3>{editingRecord ? 'Editar Registro' : 'Nuevo Registro Médico'}</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="record-form">
              <div className="form-section">
                <h4>Información del Tratamiento</h4>
                
                <div className="form-group">
                  <label>Diagnóstico *</label>
                  <textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleFormChange}
                    rows="3"
                    placeholder="Describa el diagnóstico..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tratamiento *</label>
                  <textarea
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleFormChange}
                    rows="3"
                    placeholder="Describa el tratamiento realizado..."
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Odontólogo</label>
                    <input
                      type="text"
                      name="dentist"
                      value={formData.dentist}
                      onChange={handleFormChange}
                      placeholder="Dr. Principal"
                    />
                  </div>

                  <div className="form-group">
                    <label>Próxima Cita</label>
                    <input
                      type="date"
                      name="nextAppointment"
                      value={formData.nextAppointment}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Información Adicional</h4>
                
                <div className="form-group">
                  <label>Prescripciones</label>
                  <textarea
                    name="prescriptions"
                    value={formData.prescriptions}
                    onChange={handleFormChange}
                    rows="3"
                    placeholder="Medicamentos recetados, dosis, instrucciones..."
                  />
                </div>

                <div className="form-group">
                  <label>Notas Adicionales</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows="4"
                    placeholder="Observaciones, recomendaciones, seguimiento..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingRecord ? 'Actualizar Registro' : 'Crear Registro'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de registros */}
      <div className="records-list">
        {records.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No hay registros médicos</h3>
            <p>Comience agregando un nuevo registro médico para este paciente.</p>
          </div>
        ) : (
          <div className="records-timeline">
            {records.map(record => (
              <div key={record._id} className="record-card">
                <div className="record-header">
                  <div className="record-date">
                    {format(new Date(record.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </div>
                  <div className="record-actions">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(record)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(record._id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>

                <div className="record-content">
                  <div className="record-section">
                    <h4>Diagnóstico</h4>
                    <p>{record.diagnosis}</p>
                  </div>

                  <div className="record-section">
                    <h4>Tratamiento</h4>
                    <p>{record.treatment}</p>
                  </div>

                  {record.dentist && (
                    <div className="record-section">
                      <h4>Odontólogo</h4>
                      <p>{record.dentist}</p>
                    </div>
                  )}

                  {record.prescriptions && (
                    <div className="record-section">
                      <h4>Prescripciones</h4>
                      <p>{record.prescriptions}</p>
                    </div>
                  )}

                  {record.notes && (
                    <div className="record-section">
                      <h4>Notas</h4>
                      <p>{record.notes}</p>
                    </div>
                  )}

                  {record.nextAppointment && (
                    <div className="record-section">
                      <h4>Próxima Cita</h4>
                      <p>{format(new Date(record.nextAppointment), 'dd/MM/yyyy', { locale: es })}</p>
                    </div>
                  )}
                </div>

                <div className="record-footer">
                  <small>
                    Creado: {format(new Date(record.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                    {record.updatedAt && record.updatedAt !== record.createdAt && (
                      <span> • Actualizado: {format(new Date(record.updatedAt), 'dd/MM/yyyy HH:mm', { locale: es })}</span>
                    )}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
