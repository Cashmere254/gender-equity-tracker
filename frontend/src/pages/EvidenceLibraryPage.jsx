// frontend/src/pages/EvidenceLibraryPage.jsx

import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { getNarratives, getPrograms } from '../services/api';
import Sidebar from '../components/Sidebar';

export default function EvidenceLibraryPage() {
  const [selectedProgram, setSelected] = useState('');
  const [expandedId, setExpanded]      = useState(null);
  const { data: programs }             = useFetch(getPrograms);
  const { data: narratives, loading }  = useFetch(
    () => getNarratives(selectedProgram), [selectedProgram]
  );

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">

        <h1 className="page-title">Evidence Library</h1>
        <p className="page-subtitle">
          All analysed narrative chunks --- traceable to source documents and matched KPIs.
        </p>

        <select
          className="form-input"
          style={{ width: '280px', marginBottom: '24px' }}
          value={selectedProgram}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">All Programmes</option>
          {programs?.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {loading && (
          <p style={{ color: 'var(--color-text-muted)' }}>Loading narratives...</p>
        )}
        {!loading && narratives?.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
            No narratives yet. Upload a report to populate the library.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {narratives?.map((n) => (
            <div
              key={n.id}
              className="card"
              style={{ cursor: 'pointer', transition: 'var(--transition)' }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(75,46,131,0.18)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-card)'}
              onClick={() => setExpanded(expandedId === n.id ? null : n.id)}
            >
              {/* Preview row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--color-text)', fontSize: '14px', margin: '0 0 8px', lineHeight: 1.5 }}>
                    {expandedId === n.id ? n.text : n.text_preview}
                  </p>

                  {/* KPI badges */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {n.kpis.map((k) => (
                      <span key={k.code} className="badge badge-purple">
                        {k.code} — {Math.round(k.confidence * 100)}%
                      </span>
                    ))}
                  </div>
                </div>

                <span style={{ color: 'var(--color-accent)', fontSize: '18px', marginLeft: '16px' }}>
                  {expandedId === n.id ? '▲' : '▼'}
                </span>
              </div>

              {/* Metadata */}
              <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Source: {n.document_name} &nbsp;·&nbsp;
                Programme: {n.program} &nbsp;·&nbsp;
                {n.created_at.slice(0, 10)}
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}