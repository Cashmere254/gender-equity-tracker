// frontend/src/pages/LandingPage.jsx
// Public welcome screen --- no authentication required.
// Visited by: new users, donors, and returning users before login.

import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-base)' }}>
      <Navbar />

      {/* ── Hero Section ───────────────────────────────────────────── */}
      <section style={{
        background: 'var(--color-primary-dark)',
        padding: '80px 40px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h1 style={{
            color: '#fff',
            fontSize: '42px',
            fontWeight: 700,
            lineHeight: 1.2,
            margin: '0 0 20px',
          }}>
            AI-Powered Gender Equity<br />Impact Tracking
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: '18px',
            margin: '0 0 36px',
            lineHeight: 1.6,
          }}>
            Transform qualitative programme data into real-time, donor-ready
            insights — automatically. Built for feminist organizations like Akili Dada.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              style={{ fontSize: '16px', padding: '14px 32px' }}
              onClick={() => navigate('/register')}
            >
              Get Started — Sign Up
            </button>
            <button
              className="btn-secondary"
              style={{ fontSize: '16px', padding: '12px 30px', borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── Feature Highlights ─────────────────────────────────────── */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        padding: '60px 40px',
        maxWidth: '960px',
        margin: '0 auto',
      }}>
        {[
          { icon: '📤', title: 'Upload Reports',  desc: 'PDF, DOCX, TXT and CSV supported. Drag-and-drop upload.' },
          { icon: '🤖', title: 'AI Analysis',     desc: 'Custom NLP extracts themes, scores sentiment, and maps KPIs automatically.' },
          { icon: '📊', title: 'Donor Reports',   desc: 'Drag-and-drop report builder with PDF and DOCX export.' },
        ].map(f => (
          <div key={f.title} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>{f.icon}</div>
            <h3 style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '18px', margin: '0 0 10px' }}>
              {f.title}
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: 1.5 }}>
              {f.desc}
            </p>
          </div>
        ))}
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
        <p>AI-Driven Gender Equity Impact Tracker &nbsp;·&nbsp; BAR 4102B / CSC 4158B</p>
        <p>Caroline Nduku Mbinda &nbsp;·&nbsp; BOBITNRB232523</p>
      </footer>
    </div>
  );
}