// frontend/src/pages/Dashboard.jsx

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getPrograms, getKPISummary } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import KPICard from '../components/KPICard';

export default function Dashboard() {
  const { user }                                                    = useAuth();
  const [selectedProgram, setSelected]                              = useState('');
  const [kpiData, setKpiData]                                       = useState([]);
  const [kpiLoading, setKpiLoading]                                 = useState(false);
  const { data: programs, loading: progLoading, error: progError }  = useFetch(getPrograms);

  useEffect(() => {
    if (programs?.length > 0 && !selectedProgram) setSelected(programs[0].id);
  }, [programs, selectedProgram]);

  useEffect(() => {
    if (!selectedProgram) return;
    setKpiLoading(true);
    getKPISummary(selectedProgram)
      .then((res) => setKpiData(res.data))
      .catch(() => setKpiData([]))
      .finally(() => setKpiLoading(false));
  }, [selectedProgram]);

  if (progLoading) return (
    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-primary)' }}>
      Loading dashboard...
    </div>
  );
  if (progError) return (
    <div style={{ padding: '40px', color: 'var(--color-danger)' }}>
      Error loading programmes. Please refresh.
    </div>
  );

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">

        {/* ─── Top bar ──────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <h1 className="page-title" style={{ margin: 0 }}>M&E Officer Dashboard</h1>
          <span className="badge badge-gold">{user?.role}</span>
        </div>

        {/* ─── Programme selector ───────────────────────────────── */}
        <select
          className="form-input"
          style={{ width: '280px', marginBottom: '24px' }}
          value={selectedProgram}
          onChange={(e) => setSelected(e.target.value)}
        >
          {programs?.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {/* ─── KPI Cards ────────────────────────────────────────── */}
        {kpiLoading && (
          <p style={{ color: 'var(--color-text-muted)' }}>Updating KPI data...</p>
        )}
        {!kpiLoading && kpiData.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
            No KPI data yet. Upload a programme report to see results.
          </p>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}>
          {kpiData.map((kpi) => (
            <KPICard key={kpi.indicator__code} kpi={kpi} />
          ))}
        </div>

        {/* ─── Bar chart ────────────────────────────────────────── */}
        {kpiData.length > 0 && (
          <div className="card">
            <h2 style={{ color: 'var(--color-primary)', fontSize: '16px', marginBottom: '16px' }}>
              Evidence Count by KPI
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={kpiData}>
                <XAxis dataKey="indicator__code" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="evidence_count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

      </main>
    </div>
  );
}