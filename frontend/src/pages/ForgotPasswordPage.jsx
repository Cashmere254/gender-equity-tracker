// frontend/src/pages/ForgotPasswordPage.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';
import Navbar from '../components/Navbar';

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSent(true);
    } catch {
      setSent(true); // Always show success for security
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-grey)', fontFamily: 'var(--font-base)' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '40px' }}>

          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
              <h2 style={{ color: 'var(--color-primary)', marginBottom: '12px' }}>
                Check Your Inbox
              </h2>
              <div className="alert-success" style={{ marginBottom: '20px' }}>
                If that email is registered, a reset link has been sent.
              </div>
              <Link to="/login" style={{ color: 'var(--color-primary)', fontSize: '14px' }}>
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h2 style={{ color: 'var(--color-primary)', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
                Reset Your Password
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit}>
                <label style={labelStyle}>Email Address</label>
                <input
                  className="form-input"
                  style={{ marginBottom: '16px' }}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="btn-primary"
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', fontSize: '15px', padding: '12px' }}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Link to="/login" style={{ color: 'var(--color-primary)', fontSize: '13px' }}>
                  Back to Sign In
                </Link>
              </div>
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