// frontend/src/components/Sidebar.jsx

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// NAV_ITEMS defines which roles can see each navigation item.
// This must match the allowedRoles in App.jsx PrivateRoute definitions.
const NAV_ITEMS = [
  {
    icon: '🏠', label: 'Dashboard', path: '/dashboard',
    roles: ['Admin', 'ME Officer', 'Program Manager', 'Donor']
  },
  {
    icon: '📤', label: 'Upload Report', path: '/upload',
    roles: ['Admin', 'ME Officer']
  },
  {
    icon: '📈', label: 'Analytics', path: '/analytics',
    roles: ['Admin', 'ME Officer', 'Program Manager']
  },
  {
    icon: '📝', label: 'Report Builder', path: '/report-builder',
    roles: ['Admin', 'ME Officer']
  },
  {
    icon: '📚', label: 'Evidence Library', path: '/evidence',
    roles: ['Admin', 'ME Officer', 'Program Manager', 'Donor']
  },
  {
    icon: '⚙', label: 'Settings', path: '/settings',
    roles: ['Admin', 'ME Officer', 'Program Manager', 'Donor']
  },
];

export default function Sidebar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Filter nav items to only those the current user's role can see
  const visible = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>📊 GEI Tracker</div>

      <nav>
        {visible.map((item) => (
          <div
            key={item.path}
            style={{
              ...styles.navItem,
              ...(location.pathname === item.path ? styles.activeItem : {})
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

      <button style={styles.logout} onClick={logoutUser}>
        🚪 Sign Out
      </button>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '220px',
    background: '#4B2E83',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    color: '#C9A84C',
    fontWeight: 700,
    fontSize: '18px',
    padding: '28px 20px 24px',
    borderBottom: '1px solid #6B4FA8',
  },
  navItem: {
    color: 'rgba(255,255,255,0.8)',
    padding: '13px 20px',
    cursor: 'pointer',
    fontSize: '14px',
    borderLeft: '3px solid transparent',
    transition: 'background 0.2s',
  },
  activeItem: {
    background: 'rgba(201,168,76,0.15)',
    borderLeftColor: '#C9A84C',
    color: '#fff',
  },
  userInfo: {
    marginTop: 'auto',
    padding: '16px 20px',
    borderTop: '1px solid #6B4FA8',
  },
  userName: {
    display: 'block',
    color: '#fff',
    fontWeight: 600,
    fontSize: '14px',
  },
  userRole: {
    display: 'block',
    color: '#C9A84C',
    fontSize: '12px',
    marginTop: '2px',
  },
  logout: {
    color: '#C9A84C',
    background: 'none',
    border: 'none',
    padding: '16px 20px',
    cursor: 'pointer',
    fontSize: '14px',
    textAlign: 'left',
  },
};