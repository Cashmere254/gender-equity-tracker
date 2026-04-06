// frontend/src/pages/Dashboard.jsx

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getPrograms, getKPISummary } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import KPICard from '../components/KPICard';

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedProgram, setSelected] = useState('');
  const [kpiData, setKpiData] = useState([]);
  const [kpiLoading, setKpiLoading] = useState(false);

  const { data: programs, loading: progLoading, error: progError } = useFetch(getPrograms);

  // Set first program as default when programs load
  useEffect(() => {
    if (programs?.length > 0 && !selectedProgram) setSelected(programs[0].id);
  }, [programs, selectedProgram]);

  // Fetch KPI data when selected program changes
  useEffect(() => {
    if (!selectedProgram) return;
    setKpiLoading(true);
    getKPISummary(selectedProgram)
      .then((res) => setKpiData(res.data))
      .catch(() => setKpiData([]))
      .finally(() => setKpiLoading(false));
  }, [selectedProgram]);

  if (progLoading) return (
    <div style={{ padding: '60px', textAlign: 'center', color: '#4B2E83' }}>
      Loading dashboard...
    </div>
  );

  if (progError) return (
    <div style={{ padding: '40px', color: '#C0392B' }}>
      Error loading programmes. Please refresh.
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', background: '#F7F5FB', overflowY: 'auto' }}>

        {/* ─── Top bar ──────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <h1 style={{ color: '#4B2E83', margin: 0, fontSize: '24px' }}>
            M&E Officer Dashboard
          </h1>
          <span style={{
            background: '#C9A84C', color: '#fff',
            padding: '4px 12px', borderRadius: '20px',
            fontSize: '12px', fontWeight: 700
          }}>
            {user?.role}
          </span>
        </div>

        {/* ─── Programme selector ───────────────────────────────────────── */}
        <select
          style={{
            padding: '8px 12px', borderRadius: '6px',
            border: '1px solid #ccc', marginBottom: '24px', fontSize: '14px'
          }}
          value={selectedProgram}
          onChange={(e) => setSelected(e.target.value)}
        >
          {programs?.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {/* ─── KPI Cards ────────────────────────────────────────────────── */}
        {kpiLoading && (
          <p style={{ color: '#888' }}>Updating KPI data...</p>
        )}

        {!kpiLoading && kpiData.length === 0 && (
          <p style={{ color: '#888', fontStyle: 'italic' }}>
            No KPI data yet. Upload a programme report to see results.
          </p>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {kpiData.map((kpi) => (
            <KPICard key={kpi.indicator__code} kpi={kpi} />
          ))}
        </div>

        {/* ─── Evidence bar chart ───────────────────────────────────────── */}
        {kpiData.length > 0 && (
          <>
            <h2 style={{ color: '#4B2E83', fontSize: '18px', marginBottom: '12px' }}>
              Evidence Count by KPI
            </h2>
            <ResponsiveContainer width='100%' height={220}>
              <BarChart data={kpiData}>
                <XAxis dataKey='indicator__code' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='evidence_count' fill='#4B2E83' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

      </main>
    </div>
  );
}