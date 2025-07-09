import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import PatientForm from '../components/PatientForm';
import '../css/Patients.css';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { token, logout } = useAuth();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (token) {
      fetchPatients();
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePatientCreated = () => {
    fetchPatients(); // Recargar la lista de pacientes
    setShowForm(false);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  };

  return (
    <div className="patients-container">
      <header className="patients-header">
        <nav className="patients-nav">
          <div className="nav-brand">
            <div className="nav-logo">🦷</div>
            <h1 className="nav-title">Clínica Dental</h1>
          </div>
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/appointments" className="nav-link">Citas</Link>
            <Link to="/patients" className="nav-link active">Pacientes</Link>
            <button className="logout-button" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </header>
      
      <main className="patients-content">
        <h2 className="patients-title">Gestión de Pacientes</h2>
        <p className="patients-subtitle">Administra la información de tus pacientes</p>
          <div className="patients-actions">
          <button 
            className="add-patient-btn"
            onClick={() => setShowForm(true)}
          >
            ➕ Nuevo Paciente
          </button>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}          />
        </div>
        
        {/* Formulario de nuevo paciente */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <PatientForm 
                onPatientCreated={handlePatientCreated}
                onClose={() => setShowForm(false)}
              />
            </div>
          </div>
        )}
        
        {filteredPatients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3 className="empty-title">No hay pacientes registrados</h3>
            <p className="empty-description">
              Comienza agregando un nuevo paciente a tu clínica.
            </p>
          </div>
        ) : (
          <div className="patients-grid">
            {filteredPatients.map(patient => (
              <div key={patient._id} className="patient-card">
                <div className="patient-header">
                  <div className="patient-avatar">
                    {getInitials(patient.name)}
                  </div>
                  <div className="patient-basic-info">
                    <div className="patient-name">{patient.name}</div>
                    <div className="patient-id">ID: {patient._id.slice(-6)}</div>
                  </div>
                </div>
                
                <div className="patient-contact">
                  <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <span>{patient.email}</span>
                  </div>
                  {patient.phone && (
                    <div className="contact-item">
                      <span className="contact-icon">📞</span>
                      <span>{patient.phone}</span>
                    </div>
                  )}
                  {patient.address && (
                    <div className="contact-item">
                      <span className="contact-icon">📍</span>
                      <span>{patient.address}</span>
                    </div>
                  )}
                </div>
                
                <div className="patient-stats">
                  <div className="stat-item">
                    <div className="stat-number">{patient.appointmentCount || 0}</div>
                    <div className="stat-label">Citas</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{patient.treatmentCount || 0}</div>
                    <div className="stat-label">Tratamientos</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{patient.lastVisit ? '✓' : '✗'}</div>
                    <div className="stat-label">Última Visita</div>
                  </div>
                </div>
                  <div className="patient-actions">
                  <Link 
                    to={`/patients/${patient._id}/records`}
                    className="action-btn view-btn"
                  >
                    📋 Ficha
                  </Link>
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

export default Patients;
