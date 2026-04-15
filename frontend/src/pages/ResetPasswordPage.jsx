// frontend/src/pages/ResetPasswordPage.jsx

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';
import Navbar from '../components/Navbar';

export default function ResetPasswordPage() {
  const { uid, token }        = useParams();
  const navigate              = useNavigate();
  const [form, setForm]       = useState({ new_password: '', confirm_password: '' });
  const [error, setError]     = useState('');
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
    <div style={{ minHeight: '100vh', background: 'var(--color-grey)', fontFamily: 'var(--font-base)' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '40px' }}>

          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <h2 style={{ color: 'var(--color-success)' }}>Password Updated!</h2>
              <div className="alert-success" style={{ marginTop: '16px' }}>
                Redirecting to sign in...
              </div>
            </div>
          ) : (
            <>
              <h2 style={{ color: 'var(--color-primary)', fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>
                Set New Password
              </h2>

              {error && <div className="alert-error" style={{ marginBottom: '16px' }}>{error}</div>}

              <form onSubmit={handleSubmit}>
                {[
                  ['New Password',     'new_password'],
                  ['Confirm Password', 'confirm_password'],
                ].map(([lbl, fld]) => (
                  <div key={fld}>
                    <label style={labelStyle}>{lbl}</label>
                    <input
                      className="form-input"
                      style={{ marginBottom: '16px' }}
                      type="password"
                      required
                      value={form[fld]}
                      onChange={(e) => setForm({ ...form, [fld]: e.target.value })}
                    />
                  </div>
                ))}
                <button
                  className="btn-primary"
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', fontSize: '15px', padding: '12px' }}
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

const labelStyle = {
  display: 'block',
  color: '#555',
  fontSize: '13px',
  fontWeight: 600,
  marginBottom: '6px',
};