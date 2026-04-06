// frontend/src/pages/AnalyticsPage.jsx

import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';
import { getPrograms, getKPISummary } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import Sidebar from '../components/Sidebar';

export default function AnalyticsPage() {
  const [selected, setSelected] = useState('');
  const [kpiData, setKpiData] = useState([]);
  const { data: programs } = useFetch(getPrograms);

  useEffect(() => {
    if (programs?.[0]) setSelected(programs[0].id);
  }, [programs]);

  useEffect(() => {
    if (selected) getKPISummary(selected).then((r) => setKpiData(r.data));
  }, [selected]);

  const chartData = kpiData.map((k) => ({
    name: k.indicator__code,
    confidence: Math.round((k.avg_confidence || 0) * 100),
    sentiment: Math.round(((k.avg_sentiment || 0) + 1) * 50),
    narratives: k.evidence_count,
  }));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', background: '#F7F5FB' }}>

        <h1 style={{ color: '#4B2E83', marginBottom: '8px' }}>Analytics</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          AI confidence and sentiment trends across all KPIs
        </p>

        <select
          style={{
            padding: '8px 12px', borderRadius: '6px',
            border: '1px solid #ccc', marginBottom: '28px', fontSize: '14px'
          }}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {programs?.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {/* Line Chart */}
        <div style={{
          background: '#fff', padding: '24px', borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(75,46,131,0.08)', marginBottom: '24px'
        }}>
          <h2 style={{ color: '#4B2E83', fontSize: '16px', marginBottom: '16px' }}>
            Confidence & Sentiment by KPI
          </h2>
          <ResponsiveContainer width='100%' height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#e0d9f0' />
              <XAxis dataKey='name' />
              <YAxis domain={[0, 100]} unit='%' />
              <Tooltip />
              <Legend />
              <Line
                type='monotone' dataKey='confidence'
                stroke='#4B2E83' strokeWidth={2}
                dot={{ r: 4 }} name='Confidence %'
              />
              <Line
                type='monotone' dataKey='sentiment'
                stroke='#C9A84C' strokeWidth={2}
                dot={{ r: 4 }} name='Sentiment (norm.)'
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Evidence Summary Table */}
        <div style={{
          background: '#fff', padding: '24px', borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(75,46,131,0.08)'
        }}>
          <h2 style={{ color: '#4B2E83', fontSize: '16px', marginBottom: '16px' }}>
            KPI Evidence Summary
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#4B2E83' }}>
                {['Code', 'Name', 'Category', 'Narratives', 'Avg Conf.', 'Avg Sent.'].map((h) => (
                  <th key={h} style={{
                    color: '#fff', padding: '10px 12px',
                    textAlign: 'left', fontSize: '13px'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kpiData.map((k, i) => (
                <tr key={k.indicator__code} style={{ background: i % 2 === 0 ? '#fff' : '#F7F5FB' }}>
                  <td style={styles.td}>{k.indicator__code}</td>
                  <td style={styles.td}>{k.indicator__name}</td>
                  <td style={styles.td}>{k.indicator__kpi_category}</td>
                  <td style={styles.td}>{k.evidence_count}</td>
                  <td style={styles.td}>{Math.round((k.avg_confidence || 0) * 100)}%</td>
                  <td style={{
                    ...styles.td,
                    color: k.avg_sentiment >= 0 ? '#1E6B45' : '#C0392B',
                    fontWeight: 700
                  }}>
                    {(k.avg_sentiment || 0).toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {kpiData.length === 0 && (
            <p style={{ color: '#888', fontStyle: 'italic', marginTop: '16px' }}>
              No data yet. Upload a report to populate analytics.
            </p>
          )}
        </div>

      </main>
    </div>
  );
}

const styles = {
  td: {
    padding: '9px 12px',
    borderBottom: '1px solid #e0d9f0',
  },
};