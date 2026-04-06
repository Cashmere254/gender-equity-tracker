// frontend/src/components/Navbar.jsx
// Shown on public pages (LandingPage, LoginPage, SignUpPage, ForgotPasswordPage).
// Authenticated pages use the Sidebar instead.

import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav style={styles.nav}>
      <div style={styles.logo} onClick={() => navigate('/')}>
        📊 GEI Tracker
      </div>
      <div style={styles.links}>
        <button style={styles.linkBtn} onClick={() => navigate('/login')}>
          Sign In
        </button>
        <button style={styles.ctaBtn} onClick={() => navigate('/register')}>
          Get Started
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    background: '#4B2E83',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    color: '#C9A84C',
    fontWeight: 700,
    fontSize: '20px',
    cursor: 'pointer',
  },
  links: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  linkBtn: {
    background: 'none',
    border: '1px solid #C9A84C',
    color: '#C9A84C',
    padding: '8px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
  },
  ctaBtn: {
    background: '#C9A84C',
    border: 'none',
    color: '#fff',
    padding: '8px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 700,
  },
};