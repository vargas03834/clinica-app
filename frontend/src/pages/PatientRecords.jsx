import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useParams } from 'react-router-dom';
import MedicalRecords from '../components/MedicalRecords';
import axios from 'axios';
import '../css/MedicalRecords.css';

const PatientRecords = () => {
  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  const fetchPatient = async () => {
    try {
      const response = await axios.get(`/api/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatient(response.data);
    } catch (error) {
      console.error('Error fetching patient:', error);
      setError('Error al cargar la información del paciente');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading-spinner">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-error">{error}</div>
        <Link to="/patients" className="btn btn-primary">
          Volver a Pacientes
        </Link>
      </div>
    );
  }

  return (
    <div className="patient-records-container">
      <header className="records-header-nav">
        <nav className="records-nav">
          <div className="nav-brand">
            <div className="nav-logo">🦷</div>
            <h1 className="nav-title">Clínica Dental</h1>
          </div>
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/appointments" className="nav-link">Citas</Link>
            <Link to="/patients" className="nav-link">Pacientes</Link>
            <Link to="/finance" className="nav-link">Finanzas</Link>
            <button className="logout-button" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </header>

      <main className="records-main">
        <div className="breadcrumb">
          <Link to="/patients" className="breadcrumb-link">Pacientes</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">Ficha Clínica</span>
        </div>

        {patient && (
          <MedicalRecords 
            patientId={patient._id} 
            patientName={patient.name} 
          />
        )}
      </main>
    </div>
  );
};

export default PatientRecords;
