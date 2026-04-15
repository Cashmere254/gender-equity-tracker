// frontend/src/components/Sidebar.jsx

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { icon: '🏠', label: 'Dashboard',        path: '/dashboard',      roles: ['Admin', 'ME Officer', 'Program Manager', 'Donor'] },
  { icon: '📤', label: 'Upload Report',    path: '/upload',         roles: ['Admin', 'ME Officer'] },
  { icon: '📈', label: 'Analytics',        path: '/analytics',      roles: ['Admin', 'ME Officer', 'Program Manager'] },
  { icon: '📝', label: 'Report Builder',   path: '/report-builder', roles: ['Admin', 'ME Officer'] },
  { icon: '📚', label: 'Evidence Library', path: '/evidence',       roles: ['Admin', 'ME Officer', 'Program Manager', 'Donor'] },
  { icon: '⚙',  label: 'Settings',         path: '/settings',       roles: ['Admin', 'ME Officer', 'Program Manager', 'Donor'] },
];

export default function Sidebar() {
  const { user, logoutUser } = useAuth();
  const navigate             = useNavigate();
  const location             = useLocation();

  const visible  = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));
  const isActive = (path) => location.pathname === path;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>📊 GEI Tracker</div>

      <nav>
        {visible.map((item) => (
          <div
            key={item.path}
            style={{
              ...styles.navItem,
              borderLeft: isActive(item.path)
                ? '3px solid var(--color-accent)'
                : '3px solid transparent',
              background: isActive(item.path)
                ? 'rgba(201,168,76,0.15)'
                : 'transparent',
              color: isActive(item.path) ? '#fff' : 'rgba(255,255,255,0.8)',
            }}
            onClick={() => navigate(item.path)}
          >
            {item.icon} {item.label}
          </div>
        ))}
      </nav>

      <div style={styles.userInfo}>
        <span style={styles.userName}>{user?.first_name} {user?.last_name}</span>
        <span style={styles.userRole}>{user?.role}</span>
      </div>

      <button
        style={styles.logout}
        onClick={logoutUser}
      >
        🚪 Sign Out
      </button>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '220px',
    background: 'var(--color-primary-dark)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    color: 'var(--color-accent)',
    fontWeight: 700,
    fontSize: '18px',
    padding: '28px 20px 24px',
    borderBottom: '1px solid var(--color-primary-light)',
  },
  navItem: {
    padding: '13px 20px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'var(--transition)',
  },
  userInfo: {
    marginTop: 'auto',
    padding: '16px 20px',
    borderTop: '1px solid var(--color-primary-light)',
  },
  userName: {
    display: 'block',
    color: '#fff',
    fontWeight: 600,
    fontSize: '14px',
  },
  userRole: {
    display: 'block',
    color: 'var(--color-accent)',
    fontSize: '12px',
    marginTop: '2px',
  },
  logout: {
    color: 'var(--color-accent)',
    background: 'none',
    border: 'none',
    padding: '16px 20px',
    cursor: 'pointer',
    fontSize: '14px',
    textAlign: 'left',
    transition: 'var(--transition)',
  },
};