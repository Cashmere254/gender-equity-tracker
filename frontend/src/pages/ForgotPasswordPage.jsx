// frontend/src/pages/ForgotPasswordPage.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';
import Navbar from '../components/Navbar';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSent(true);
    } catch {
      // Always show success --- never confirm whether email exists (security)
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.outer}>
        <div style={styles.card}>

          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
              <h2 style={{ color: '#4B2E83', marginBottom: '12px' }}>
                Check Your Inbox
              </h2>
              <p style={{ color: '#555', marginBottom: '20px' }}>
                If that email is registered, a reset link has been sent.
              </p>
              <Link to='/login' style={styles.link}>
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h2 style={styles.title}>Reset Your Password</h2>
              <p style={styles.subtitle}>
                Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit}>
                <label style={styles.label}>Email Address</label>
                <input
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />
                <button
                  type='submit'
                  disabled={loading}
                  style={styles.btn}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Link to='/login' style={styles.link}>
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
    marginBottom: '8px',
  },
  subtitle: {
    color: '#666',
    fontSize: '14px',
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
  link: {
    color: '#4B2E83',
    fontSize: '13px',
    textDecoration: 'none',
  },
};