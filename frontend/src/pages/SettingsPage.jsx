// frontend/src/pages/SettingsPage.jsx

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/api';
import Sidebar from '../components/Sidebar';

export default function SettingsPage() {
  const { user }                  = useAuth();
  const [pwForm, setPwForm]       = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [pwMsg, setPwMsg]         = useState('');
  const [pwError, setPwError]     = useState('');
  const [loading, setLoading]     = useState(false);

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
    <div className="page-layout">
      <Sidebar />
      <main className="main-content" style={{ maxWidth: '600px' }}>

        <h1 className="page-title">Settings</h1>

        {/* Profile section */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--color-primary)', fontSize: '18px', marginBottom: '16px' }}>
            Your Profile
          </h2>
          {[
            ['Name',     `${user?.first_name} ${user?.last_name}`],
            ['Email',    user?.email],
            ['Role',     user?.role],
            ['Username', user?.username],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', gap: '12px', marginBottom: '12px', fontSize: '14px' }}>
              <span style={{ color: 'var(--color-text-muted)', minWidth: '80px' }}>{l}</span>
              <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Change password */}
        <div className="card">
          <h2 style={{ color: 'var(--color-primary)', fontSize: '18px', marginBottom: '16px' }}>
            Change Password
          </h2>

          {pwError && <div className="alert-error" style={{ marginBottom: '12px' }}>{pwError}</div>}
          {pwMsg   && <div className="alert-success" style={{ marginBottom: '12px' }}>{pwMsg}</div>}

          <form onSubmit={handlePasswordChange}>
            {[
              ['Current Password',     'old_password'],
              ['New Password',         'new_password'],
              ['Confirm New Password', 'confirm_password'],
            ].map(([lbl, fld]) => (
              <div key={fld}>
                <label style={labelStyle}>{lbl}</label>
                <input
                  className="form-input"
                  style={{ marginBottom: '14px' }}
                  type="password"
                  required
                  value={pwForm[fld]}
                  onChange={(e) => setPwForm({ ...pwForm, [fld]: e.target.value })}
                />
              </div>
            ))}
            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
              style={{ padding: '11px 28px' }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

      </main>
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