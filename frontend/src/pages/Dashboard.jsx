import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Dashboard.css';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <nav className="dashboard-nav">
          <div className="nav-brand">
            <div className="nav-logo">🦷</div>
            <h1 className="nav-title">Clínica Dental</h1>
          </div>          <div className="nav-links">
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
      
      <main className="dashboard-content">
        <div className="dashboard-welcome">
          <h2 className="welcome-title">Panel Principal</h2>
          <p className="welcome-subtitle">Gestiona tu clínica dental de manera eficiente</p>
        </div>
        
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">📅</div>
            <h3 className="card-title">Citas</h3>
            <p className="card-description">
              Gestiona las citas de tus pacientes, programa nuevas consultas y mantén un control de horarios.
            </p>
            <Link to="/appointments" className="card-button">
              Ver Citas
            </Link>
          </div>
          
          <div className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3 className="card-title">Pacientes</h3>
            <p className="card-description">
              Administra la información de tus pacientes, historiales médicos y datos de contacto.
            </p>
            <Link to="/patients" className="card-button">
              Ver Pacientes
            </Link>
          </div>
            <div className="dashboard-card">
            <div className="card-icon">💰</div>
            <h3 className="card-title">Finanzas</h3>
            <p className="card-description">
              Gestiona los pagos, facturas y seguimiento financiero de tu clínica dental.
            </p>
            <Link to="/finance" className="card-button">
              Ver Finanzas
            </Link>
          </div>
          
          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3 className="card-title">Reportes</h3>
            <p className="card-description">
              Genera reportes detallados sobre ingresos, tratamientos y estadísticas de la clínica.
            </p>
            <button className="card-button">
              Ver Reportes
            </button>
          </div>
          
          <div className="dashboard-card">
            <div className="card-icon">⚙️</div>
            <h3 className="card-title">Configuración</h3>
            <p className="card-description">
              Personaliza la configuración de tu clínica, usuarios y preferencias del sistema.
            </p>
            <button className="card-button">
              Configurar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Dashboard;