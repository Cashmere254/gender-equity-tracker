// frontend/src/pages/LoginPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, getMe } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function LoginPage() {
  const [form, setForm]       = useState({ username: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser }         = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await login(form);
      localStorage.setItem('access_token', res.data.access);
      const user = await getMe();
      loginUser(res.data.access, user.data);
      navigate('/dashboard');
    } catch {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-grey)', fontFamily: 'var(--font-base)' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>

          <h1 style={{ color: 'var(--color-primary)', fontSize: '17px', fontWeight: 700, textAlign: 'center', margin: '0 0 6px' }}>
            AI-Driven Gender Equity Impact Tracker
          </h1>
          <h2 style={{ color: 'var(--color-text)', fontSize: '22px', fontWeight: 700, textAlign: 'center', margin: '0 0 24px' }}>
            Welcome back
          </h2>

          {error && <div className="alert-error" style={{ marginBottom: '16px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Username</label>
            <input
              className="form-input"
              style={{ marginBottom: '16px' }}
              type="text"
              required
              autoComplete="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <label style={labelStyle}>Password</label>
            <input
              className="form-input"
              style={{ marginBottom: '20px' }}
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', fontSize: '15px', padding: '12px' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', textAlign: 'center' }}>
            <Link to="/forgot-password" style={{ color: 'var(--color-primary)', fontSize: '13px', textDecoration: 'none' }}>
              Forgot your password?
            </Link>
            <Link to="/register" style={{ color: 'var(--color-primary)', fontSize: '13px', textDecoration: 'none' }}>
              Don't have an account? Sign Up
            </Link>
          </div>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '11px', textAlign: 'center', marginTop: '16px' }}>
            Use your organisational email.
          </p>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  color: '#555',
  fontSize: '13px',
  fontWeight: 600,
  marginBottom: '6px',
};