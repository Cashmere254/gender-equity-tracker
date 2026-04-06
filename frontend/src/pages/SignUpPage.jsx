// frontend/src/pages/SignUpPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import Navbar from '../components/Navbar';

export default function SignUpPage() {
  const [form, setForm] = useState({
    email: '', username: '', first_name: '', last_name: '',
    password: '', confirm_password: '', role: 'ME Officer'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.'); return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.'); return;
    }

    setLoading(true);
    setError('');

    const { confirm_password, ...payload } = form;

    try {
      await register(payload);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const data = err.response?.data;
      if (data?.email) setError('Email: ' + data.email[0]);
      else if (data?.username) setError('Username: ' + data.username[0]);
      else setError('Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.outer}>
        <div style={styles.card}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '50px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ color: '#1E6B45' }}>Account Created!</h2>
            <p style={{ color: '#555', marginTop: '12px' }}>
              Redirecting to sign in...
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.outer}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create Your Account</h2>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {[
              ['First Name', 'first_name', 'text'],
              ['Last Name', 'last_name', 'text'],
              ['Email', 'email', 'email'],
              ['Username', 'username', 'text'],
              ['Password', 'password', 'password'],
              ['Confirm Password', 'confirm_password', 'password'],
            ].map(([label, field, type]) => (
              <div key={field}>
                <label style={styles.label}>{label}</label>
                <input
                  style={styles.input}
                  type={type}
                  required
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              </div>
            ))}

            <label style={styles.label}>Role</label>
            <select
              style={styles.input}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option>ME Officer</option>
              <option>Program Manager</option>
              <option>Donor</option>
            </select>

            <button style={styles.btn} type='submit' disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={styles.loginLink}>
            Already have an account?{' '}
            <Link to='/login' style={{ color: '#4B2E83' }}>Sign In</Link>
          </p>
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
    padding: '40px 20px',
  },
  card: {
    background: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(75,46,131,0.12)',
    width: '100%',
    maxWidth: '420px',
  },
  title: {
    color: '#4B2E83',
    fontSize: '22px',
    fontWeight: 700,
    textAlign: 'center',
    margin: '0 0 20px',
  },
  label: {
    display: 'block',
    color: '#555',
    fontSize: '13px',
    fontWeight: 600,
    margin: '8px 0 4px',
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    marginBottom: '4px',
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
    marginTop: '12px',
  },
  error: {
    color: '#C0392B',
    background: '#fdf0f0',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '12px',
    fontSize: '13px',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '13px',
    color: '#666',
  },
};