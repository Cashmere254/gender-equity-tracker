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
  const [selected, setSelected]   = useState('');
  const [kpiData, setKpiData]     = useState([]);
  const { data: programs }        = useFetch(getPrograms);

  useEffect(() => {
    if (programs?.[0]) setSelected(programs[0].id);
  }, [programs]);

  useEffect(() => {
    if (selected) getKPISummary(selected).then((r) => setKpiData(r.data));
  }, [selected]);

  const chartData = kpiData.map((k) => ({
    name:       k.indicator__code,
    confidence: Math.round((k.avg_confidence || 0) * 100),
    sentiment:  Math.round(((k.avg_sentiment || 0) + 1) * 50),
    narratives: k.evidence_count,
  }));

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">

        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">
          AI confidence and sentiment trends across all KPIs
        </p>

        <select
          className="form-input"
          style={{ width: '280px', marginBottom: '28px' }}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {programs?.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {/* Line Chart */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--color-primary)', fontSize: '16px', marginBottom: '16px' }}>
            Confidence & Sentiment by KPI
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} unit="%" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="confidence" stroke="var(--color-primary)"
                strokeWidth={2} dot={{ r: 4 }} name="Confidence %" />
              <Line type="monotone" dataKey="sentiment" stroke="var(--color-accent)"
                strokeWidth={2} dot={{ r: 4 }} name="Sentiment (norm.)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Evidence Summary Table */}
        <div className="card">
          <h2 style={{ color: 'var(--color-primary)', fontSize: '16px', marginBottom: '16px' }}>
            KPI Evidence Summary
          </h2>
          <table className="data-table">
            <thead>
              <tr>
                {['Code', 'Name', 'Category', 'Narratives', 'Avg Conf.', 'Avg Sent.'].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kpiData.map((k) => (
                <tr key={k.indicator__code}>
                  <td>{k.indicator__code}</td>
                  <td>{k.indicator__name}</td>
                  <td>{k.indicator__kpi_category}</td>
                  <td>{k.evidence_count}</td>
                  <td>{Math.round((k.avg_confidence || 0) * 100)}%</td>
                  <td style={{
                    color: k.avg_sentiment >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
                    fontWeight: 700,
                  }}>
                    {(k.avg_sentiment || 0).toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {kpiData.length === 0 && (
            <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', marginTop: '16px' }}>
              No data yet. Upload a report to populate analytics.
            </p>
          )}
        </div>

      </main>
    </div>
  );
}