import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AppointmentForm from '../components/AppointmentForm';
import '../css/Appointments.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAppointmentCreated = () => {
    fetchAppointments(); // Recargar la lista de citas
    setShowForm(false);
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="appointments-container">
      <header className="appointments-header">
        <nav className="appointments-nav">
          <div className="nav-brand">
            <div className="nav-logo">🦷</div>
            <h1 className="nav-title">Clínica Dental</h1>
          </div>
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/appointments" className="nav-link active">Citas</Link>
            <Link to="/patients" className="nav-link">Pacientes</Link>
            <button className="logout-button" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </header>
      
      <main className="appointments-content">
        <h2 className="appointments-title">Gestión de Citas</h2>
        <p className="appointments-subtitle">Administra las citas de tus pacientes</p>
          <div className="appointments-actions">
          <button 
            className="add-appointment-btn"
            onClick={() => setShowForm(true)}
          >
            ➕ Nueva Cita
          </button>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar citas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}          />
        </div>
        
        {/* Formulario de nueva cita */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <AppointmentForm 
                onAppointmentCreated={handleAppointmentCreated}
                onClose={() => setShowForm(false)}
              />
            </div>
          </div>
        )}
        
        {filteredAppointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3 className="empty-title">No hay citas programadas</h3>
            <p className="empty-description">
              Comienza agregando una nueva cita para tus pacientes.
            </p>
          </div>
        ) : (
          <div className="appointments-grid">
            {filteredAppointments.map(appointment => (
              <div key={appointment._id} className="appointment-card">
                <div className="appointment-header">
                  <div className="appointment-time">
                    {formatTime(appointment.date)}
                  </div>
                  <div className={`appointment-status status-${appointment.status || 'pending'}`}>
                    {appointment.status === 'confirmed' ? 'Confirmada' : 
                     appointment.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                  </div>
                </div>
                
                <div className="appointment-patient">
                  {appointment.patient?.name || 'Paciente no especificado'}
                </div>
                
                <div className="appointment-details">
                  <p><strong>Fecha:</strong> {formatDate(appointment.date)}</p>
                  <p><strong>Tratamiento:</strong> {appointment.treatment || 'Consulta general'}</p>
                  <p><strong>Notas:</strong> {appointment.notes || 'Sin notas adicionales'}</p>
                </div>
                
                <div className="appointment-actions">
                  <button className="action-btn edit-btn">
                    Editar
                  </button>
                  <button className="action-btn delete-btn">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Appointments;