// frontend/src/pages/LoginPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, getMe } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login(form);
      //Save token FIRST before calling getMe()
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
    <div style={styles.page}>
      <Navbar />
      <div style={styles.outer}>
        <div style={styles.card}>

          <h1 style={styles.title}>AI-Driven Gender Equity Impact Tracker</h1>
          <h2 style={styles.sub}>Welcome back</h2>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type='text'
              required
              autoComplete='username'
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type='password'
              required
              autoComplete='current-password'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button style={styles.btn} type='submit' disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={styles.links}>
            <Link to='/forgot-password' style={styles.link}>
              Forgot your password?
            </Link>
            <Link to='/register' style={styles.link}>
              Don't have an account? Sign Up
            </Link>
          </div>

          <p style={styles.hint}>Use your organisational email.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F3EFF8',
    fontFamily: 'Arial, sans-serif',
  },
  outer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
  },
  card: {
    background: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(75,46,131,0.12)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    color: '#4B2E83',
    fontSize: '17px',
    fontWeight: 700,
    textAlign: 'center',
    margin: '0 0 6px',
  },
  sub: {
    color: '#333',
    fontSize: '22px',
    fontWeight: 700,
    textAlign: 'center',
    margin: '0 0 24px',
  },
  label: {
    display: 'block',
    color: '#555',
    fontSize: '13px',
    fontWeight: 600,
    margin: '0 0 6px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%',
    padding: '12px',
    background: '#4B2E83',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  error: {
    color: '#C0392B',
    background: '#fdf0f0',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '13px',
  },
  links: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '16px',
    textAlign: 'center',
  },
  link: {
    color: '#4B2E83',
    fontSize: '13px',
    textDecoration: 'none',
  },
  hint: {
    color: '#aaa',
    fontSize: '11px',
    textAlign: 'center',
    marginTop: '16px',
  },
};