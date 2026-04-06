// frontend/src/pages/LandingPage.jsx
// Public welcome screen --- no authentication required.
// Visited by: new users, donors, and returning users before login.

import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <Navbar />

      {/* ─── Hero Section ──────────────────────────────────────────────── */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            AI-Powered Gender Equity<br />Impact Tracking
          </h1>
          <p style={styles.heroSub}>
            Transform qualitative programme data into real-time, donor-ready
            insights --- automatically. Built for feminist organisations like Akili Dada.
          </p>
          <div style={styles.ctaRow}>
            <button style={styles.ctaPrimary} onClick={() => navigate('/register')}>
              Get Started --- Sign Up
            </button>
            <button style={styles.ctaSecondary} onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ─── Feature Highlights ────────────────────────────────────────── */}
      <section style={styles.features}>
        {[
          {
            icon: '📤',
            title: 'Upload Reports',
            desc: 'PDF, DOCX, TXT and CSV supported. Drag-and-drop upload.'
          },
          {
            icon: '🤖',
            title: 'AI Analysis',
            desc: 'Custom NLP extracts themes, scores sentiment, and maps KPIs automatically.'
          },
          {
            icon: '📊',
            title: 'Donor Reports',
            desc: 'Drag-and-drop report builder with PDF and DOCX export.'
          },
        ].map(f => (
          <div key={f.title} style={styles.featureCard}>
            <div style={styles.featureIcon}>{f.icon}</div>
            <h3 style={styles.featureTitle}>{f.title}</h3>
            <p style={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────── */}
      <footer style={styles.footer}>
        <p>AI-Driven Gender Equity Impact Tracker &nbsp;·&nbsp; BAR 4102B / CSC 4158B</p>
        <p>Caroline Nduku Mbinda &nbsp;·&nbsp; BOBITNRB232523</p>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    background: '#F7F5FB',
  },
  hero: {
    background: 'linear-gradient(135deg, #4B2E83 0%, #3A1F6E 100%)',
    padding: '80px 40px',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  heroTitle: {
    color: '#fff',
    fontSize: '42px',
    fontWeight: 700,
    lineHeight: 1.2,
    margin: '0 0 20px',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '18px',
    margin: '0 0 36px',
    lineHeight: 1.6,
  },
  ctaRow: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaPrimary: {
    background: '#C9A84C',
    color: '#fff',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  ctaSecondary: {
    background: 'transparent',
    color: '#C9A84C',
    border: '2px solid #C9A84C',
    padding: '12px 30px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
    padding: '60px 40px',
    maxWidth: '960px',
    margin: '0 auto',
  },
  featureCard: {
    background: '#fff',
    padding: '32px 24px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(75,46,131,0.08)',
    textAlign: 'center',
  },
  featureIcon: {
    fontSize: '40px',
    marginBottom: '16px',
  },
  featureTitle: {
    color: '#4B2E83',
    fontWeight: 700,
    fontSize: '18px',
    margin: '0 0 10px',
  },
  featureDesc: {
    color: '#666',
    fontSize: '14px',
    lineHeight: 1.5,
  },
  footer: {
    textAlign: 'center',
    padding: '32px',
    color: '#999',
    fontSize: '13px',
  },
};