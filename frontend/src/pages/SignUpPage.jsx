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
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setError('');
    const { confirm_password, ...payload } = form;
    try {
      await register(payload);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const data = err.response?.data;
      if (data?.email)    setError('Email: ' + data.email[0]);
      else if (data?.username) setError('Username: ' + data.username[0]);
      else setError('Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  // ── Password border colour helper ──────────────────────────────
  const pwBorderColor = form.password.length === 0
    ? 'var(--color-border)'
    : form.password.length >= 8
      ? 'var(--color-success)'
      : 'var(--color-danger)';

  if (success) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-grey)', fontFamily: 'var(--font-base)' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div className="card" style={{ maxWidth: '420px', width: '100%', textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '50px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ color: 'var(--color-success)' }}>Account Created!</h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '12px' }}>Redirecting to sign in...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-grey)', fontFamily: 'var(--font-base)' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>

          <h2 style={{ color: 'var(--color-primary)', fontSize: '22px', fontWeight: 700, textAlign: 'center', margin: '0 0 20px' }}>
            Create Your Account
          </h2>

          {error && <div className="alert-error" style={{ marginBottom: '12px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Standard text/email fields */}
            {[
              ['First Name',  'first_name', 'text'],
              ['Last Name',   'last_name',  'text'],
              ['Email',       'email',      'email'],
              ['Username',    'username',   'text'],
            ].map(([label, field, type]) => (
              <div key={field}>
                <label style={labelStyle}>{label}</label>
                <input
                  className="form-input"
                  style={{ marginBottom: '12px' }}
                  type={type}
                  required
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              </div>
            ))}

            {/* Password — with strength indicator */}
            <label style={labelStyle}>Password</label>
            <input
              className="form-input"
              style={{ marginBottom: '4px', borderColor: pwBorderColor }}
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {form.password.length > 0 && form.password.length < 8 && (
              <p style={{ color: 'var(--color-danger)', fontSize: '12px', marginBottom: '8px' }}>
                Password must be at least 8 characters
              </p>
            )}
            {form.password.length >= 8 && (
              <p style={{ color: 'var(--color-success)', fontSize: '12px', marginBottom: '8px' }}>
                ✓ Strong enough
              </p>
            )}

            {/* Confirm Password */}
            <label style={labelStyle}>Confirm Password</label>
            <input
              className="form-input"
              style={{ marginBottom: '12px' }}
              type="password"
              required
              value={form.confirm_password}
              onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
            />

            {/* Role */}
            <label style={labelStyle}>Role</label>
            <select
              className="form-input"
              style={{ marginBottom: '16px' }}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option>ME Officer</option>
              <option>Program Manager</option>
              <option>Donor</option>
            </select>

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', fontSize: '15px', padding: '12px', marginTop: '4px' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)' }}>Sign In</Link>
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