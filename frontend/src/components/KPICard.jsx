// frontend/src/components/KPICard.jsx

import { memo } from 'react';

// memo: only re-renders if the kpi prop actually changes (performance)
const KPICard = memo(function KPICard({ kpi }) {
  const confidencePct = Math.round((kpi.avg_confidence || 0) * 100);
  const sentimentPositive = (kpi.avg_sentiment || 0) >= 0;

  return (
    <div style={styles.card}>

      {/* Category badge */}
      <span style={styles.badge}>{kpi.indicator__kpi_category}</span>

      {/* KPI Name */}
      <h3 style={styles.name}>{kpi.indicator__name}</h3>

      {/* Evidence count */}
      <p style={styles.count}>
        {kpi.evidence_count} narrative{kpi.evidence_count !== 1 ? 's' : ''} analysed
      </p>

      {/* Confidence bar */}
      <div style={styles.confRow}>
        <span style={styles.confLabel}>AI Confidence</span>
        <span style={styles.confValue}>{confidencePct}%</span>
      </div>
      <div style={styles.bar}>
        <div style={{ ...styles.barFill, width: `${confidencePct}%` }} />
      </div>

      {/* Sentiment pill */}
      <span style={{
        ...styles.pill,
        background: sentimentPositive ? '#1E6B45' : '#C0392B'
      }}>
        {sentimentPositive ? '▲ Positive' : '▼ Negative'}{' '}
        ({(kpi.avg_sentiment || 0).toFixed(2)})
      </span>

    </div>
  );
});

export default KPICard;

const styles = {
  card: {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 12px rgba(75,46,131,0.10)',
    borderTop: '4px solid #4B2E83',
  },
  badge: {
    display: 'inline-block',
    background: '#C9A84C',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 700,
    padding: '2px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  name: {
    color: '#1A1A2E',
    fontWeight: 700,
    margin: '10px 0 4px',
    fontSize: '15px',
  },
  count: {
    color: '#666',
    fontSize: '13px',
    margin: '0 0 12px',
  },
  confRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#666',
  },
  confLabel: {},
  confValue: {
    color: '#4B2E83',
    fontWeight: 700,
  },
  bar: {
    height: '6px',
    background: '#E0D9F0',
    borderRadius: '3px',
    overflow: 'hidden',
    margin: '4px 0 10px',
  },
  barFill: {
    height: '100%',
    background: '#4B2E83',
    borderRadius: '3px',
    transition: 'width 0.5s ease',
  },
  pill: {
    display: 'inline-block',
    color: '#fff',
    fontSize: '11px',
    padding: '3px 10px',
    borderRadius: '4px',
    fontWeight: 600,
  },
};