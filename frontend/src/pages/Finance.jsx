import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import FinanceManager from '../components/FinanceManager';
import '../css/Finance.css';

const Finance = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="finance-container">
      <header className="finance-header-nav">
        <nav className="finance-nav">
          <div className="nav-brand">
            <div className="nav-logo">🦷</div>
            <h1 className="nav-title">Clínica Dental</h1>
          </div>
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/appointments" className="nav-link">Citas</Link>
            <Link to="/patients" className="nav-link">Pacientes</Link>
            <Link to="/finance" className="nav-link active">Finanzas</Link>
            <button className="logout-button" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </header>

      <main className="finance-main">
        <FinanceManager />
      </main>
    </div>
  );
};

export default Finance;
