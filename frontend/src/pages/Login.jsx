import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="clinic-logo">🦷</div>
          <h1 className="login-title">Clínica Dental</h1>
          <p className="login-subtitle">Accede a tu cuenta</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="input-icon">📧</span>
            <input 
              className="form-input"
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email" 
              required
            />
          </div>
          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input 
              className="form-input"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Contraseña" 
              required
            />
          </div>
          <button className="login-button" type="submit">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
