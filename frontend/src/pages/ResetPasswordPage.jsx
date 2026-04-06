// frontend/src/pages/ResetPasswordPage.jsx
// Called when user clicks the reset link in their email.
// URL format: /reset-password/:uid/:token

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';
import Navbar from '../components/Navbar';

export default function ResetPasswordPage() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ new_password: '', confirm_password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.new_password !== form.confirm_password) {
      setError('Passwords do not match.'); return;
    }
    if (form.new_password.length < 8) {
      setError('Password must be at least 8 characters.'); return;
    }

    setLoading(true);
    setError('');

    try {
      await resetPassword({ uid, token, ...form });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset link is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.outer}>
        <div style={styles.card}>

          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <h2 style={{ color: '#1E6B45' }}>Password Updated!</h2>
              <p style={{ color: '#555', marginTop: '12px' }}>
                Redirecting to sign in...
              </p>
            </div>
          ) : (
            <>
              <h2 style={styles.title}>Set New Password</h2>

              {error && <div style={styles.error}>{error}</div>}

              <form onSubmit={handleSubmit}>
                {[
                  ['New Password', 'new_password'],
                  ['Confirm Password', 'confirm_password']
                ].map(([lbl, fld]) => (
                  <div key={fld}>
                    <label style={styles.label}>{lbl}</label>
                    <input
                      type='password'
                      required
                      value={form[fld]}
                      onChange={(e) => setForm({ ...form, [fld]: e.target.value })}
                      style={styles.input}
                    />
                  </div>
                ))}

                <button
                  type='submit'
                  disabled={loading}
                  style={styles.btn}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </>
          )}

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
    padding: '80px 20px',
  },
  card: {
    background: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(75,46,131,0.12)',
    maxWidth: '400px',
    width: '100%',
  },
  title: {
    color: '#4B2E83',
    fontSize: '22px',
    fontWeight: 700,
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    color: '#555',
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px',
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
};