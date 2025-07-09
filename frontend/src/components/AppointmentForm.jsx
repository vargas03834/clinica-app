import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/Forms.css';

const AppointmentForm = ({ onAppointmentCreated, onClose }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    patient: '',
    date: new Date(),
    time: '',
    dentist: '',
    notes: '',
    treatment: '',
    status: 'pending'
  });
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Cargar pacientes al montar el componente
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/api/patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Error al cargar pacientes');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validación básica
    if (!formData.patient || !formData.date || !formData.time) {
      setError('Por favor complete todos los campos obligatorios');
      setLoading(false);
      return;
    }

    try {
      // Combinar fecha y hora para crear la fecha completa
      const appointmentDateTime = new Date(formData.date);
      const [hours, minutes] = formData.time.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

      const appointmentData = {
        patient: formData.patient,
        date: appointmentDateTime.toISOString(),
        dentist: formData.dentist || 'Dr. Principal',
        notes: formData.notes,
        treatment: formData.treatment,
        status: formData.status
      };

      await axios.post('/api/appointments', appointmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      // Limpiar formulario
      setFormData({
        patient: '',
        date: new Date(),
        time: '',
        dentist: '',
        notes: '',
        treatment: '',
        status: 'pending'
      });

      // Notificar al componente padre
      if (onAppointmentCreated) {
        onAppointmentCreated();
      }

      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        setSuccess(false);
        if (onClose) onClose();
      }, 2000);

    } catch (error) {
      console.error('Error creating appointment:', error);
      setError(error.response?.data?.message || 'Error al crear la cita');
    } finally {
      setLoading(false);
    }
  };

  // Generar opciones de tiempo cada 30 minutos
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">Nueva Cita</h2>
        {onClose && (
          <button className="close-btn" onClick={onClose}>×</button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">¡Cita creada exitosamente!</div>}

      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label className="form-label">Paciente *</label>
          <select
            name="patient"
            value={formData.patient}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccione un paciente</option>
            {patients.map(patient => (
              <option key={patient._id} value={patient._id}>
                {patient.name} - {patient.email}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Fecha *</label>
            <DatePicker
              selected={formData.date}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hora *</label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Seleccione una hora</option>
              {generateTimeOptions().map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Odontólogo</label>
          <input
            type="text"
            name="dentist"
            value={formData.dentist}
            onChange={handleChange}
            className="form-input"
            placeholder="Dr. Principal"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tratamiento</label>
          <input
            type="text"
            name="treatment"
            value={formData.treatment}
            onChange={handleChange}
            className="form-input"
            placeholder="Limpieza dental, revisión, etc."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Estado</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Notas</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-textarea"
            rows="3"
            placeholder="Notas adicionales sobre la cita..."
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Cita'}
          </button>
          {onClose && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
