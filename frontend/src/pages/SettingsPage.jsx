// frontend/src/pages/SettingsPage.jsx

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/api';
import Sidebar from '../components/Sidebar';

export default function SettingsPage() {
  const { user } = useAuth();
  const [pwForm, setPwForm] = useState({
    old_password: '', new_password: '', confirm_password: ''
  });
  const [pwMsg, setPwMsg] = useState('');
  const [pwError, setPwError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwError('Passwords do not match.'); return;
    }
    setLoading(true);
    setPwError('');
    setPwMsg('');

    try {
      await changePassword(pwForm);
      setPwMsg('Password updated successfully.');
      setPwForm({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setPwError(err.response?.data?.error || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px', background: '#F7F5FB', maxWidth: '600px' }}>

        <h1 style={{ color: '#4B2E83', marginBottom: '32px' }}>Settings</h1>

        {/* Profile section */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Your Profile</h2>
          {[
            ['Name', `${user?.first_name} ${user?.last_name}`],
            ['Email', user?.email],
            ['Role', user?.role],
            ['Username', user?.username]
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', gap: '12px', marginBottom: '12px', fontSize: '14px' }}>
              <span style={{ color: '#888', minWidth: '80px' }}>{l}</span>
              <span style={{ color: '#1A1A2E', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Change password */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Change Password</h2>

          {pwError && (
            <div style={styles.error}>{pwError}</div>
          )}
          {pwMsg && (
            <div style={styles.success}>{pwMsg}</div>
          )}

          <form onSubmit={handlePasswordChange}>
            {[
              ['Current Password', 'old_password'],
              ['New Password', 'new_password'],
              ['Confirm New Password', 'confirm_password']
            ].map(([lbl, fld]) => (
              <div key={fld}>
                <label style={styles.label}>{lbl}</label>
                <input
                  type='password'
                  required
                  value={pwForm[fld]}
                  onChange={(e) => setPwForm({ ...pwForm, [fld]: e.target.value })}
                  style={styles.input}
                />
              </div>
            ))}

            <button type='submit' disabled={loading} style={styles.btn}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    padding: '28px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(75,46,131,0.08)',
    marginBottom: '24px',
  },
  cardTitle: {
    color: '#4B2E83',
    fontSize: '18px',
    marginBottom: '16px',
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
    marginBottom: '14px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  btn: {
    background: '#4B2E83',
    color: '#fff',
    border: 'none',
    padding: '11px 28px',
    borderRadius: '6px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  error: {
    color: '#C0392B',
    background: '#fdf0f0',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '12px',
    fontSize: '13px',
  },
  success: {
    color: '#1E6B45',
    background: '#EDF7F1',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '12px',
    fontSize: '13px',
  },
};