import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/Forms.css';

const PatientForm = ({ onPatientCreated, onClose }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: null,
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    allergies: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
      birthDate: date
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    if (!formData.email.trim()) {
      setError('El correo electrónico es obligatorio');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('El teléfono es obligatorio');
      return false;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingrese un correo electrónico válido');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const patientData = {
        ...formData,
        birthDate: formData.birthDate ? formData.birthDate.toISOString() : null
      };

      await axios.post('/api/patients', patientData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        birthDate: null,
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        medicalHistory: '',
        allergies: '',
        notes: ''
      });

      // Notificar al componente padre
      if (onPatientCreated) {
        onPatientCreated();
      }

      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        setSuccess(false);
        if (onClose) onClose();
      }, 2000);

    } catch (error) {
      console.error('Error creating patient:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('email')) {
        setError('Ya existe un paciente con este correo electrónico');
      } else {
        setError(error.response?.data?.message || 'Error al crear el paciente');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">Nuevo Paciente</h2>
        {onClose && (
          <button className="close-btn" onClick={onClose}>×</button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">¡Paciente creado exitosamente!</div>}

      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-section">
          <h3 className="section-title">Información Personal</h3>
          
          <div className="form-group">
            <label className="form-label">Nombre Completo *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Ingrese el nombre completo"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Correo Electrónico *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="+1234567890"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fecha de Nacimiento</label>
              <DatePicker
                selected={formData.birthDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                className="form-input"
                placeholderText="Seleccione fecha"
                showYearDropdown
                yearDropdownItemNumber={100}
                scrollableYearDropdown
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-input"
                placeholder="Dirección completa"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Contacto de Emergencia</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contacto de Emergencia</label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                className="form-input"
                placeholder="Nombre del contacto"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono de Emergencia</label>
              <input
                type="tel"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                className="form-input"
                placeholder="+1234567890"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Información Médica</h3>
          
          <div className="form-group">
            <label className="form-label">Historia Médica</label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              className="form-textarea"
              rows="3"
              placeholder="Describa cualquier condición médica relevante..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Alergias</label>
            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="form-textarea"
              rows="2"
              placeholder="Medicamentos, alimentos u otras alergias..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notas Adicionales</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-textarea"
              rows="3"
              placeholder="Cualquier información adicional..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Paciente'}
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

export default PatientForm;
