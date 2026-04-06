// frontend/src/pages/EvidenceLibraryPage.jsx

import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { getNarratives, getPrograms } from '../services/api';
import Sidebar from '../components/Sidebar';

export default function EvidenceLibraryPage() {
  const [selectedProgram, setSelected] = useState('');
  const [expandedId, setExpanded] = useState(null);
  const { data: programs } = useFetch(getPrograms);
  const { data: narratives, loading } = useFetch(
    () => getNarratives(selectedProgram), [selectedProgram]
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '32px', background: '#F7F5FB' }}>

        <h1 style={{ color: '#4B2E83', marginBottom: '8px' }}>Evidence Library</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          All analysed narrative chunks --- traceable to source documents and matched KPIs.
        </p>

        <select
          style={{
            padding: '8px 12px', borderRadius: '6px',
            border: '1px solid #ccc', marginBottom: '24px', fontSize: '14px'
          }}
          value={selectedProgram}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value=''>All Programmes</option>
          {programs?.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {loading && <p style={{ color: '#888' }}>Loading narratives...</p>}

        {!loading && narratives?.length === 0 && (
          <p style={{ color: '#888', fontStyle: 'italic' }}>
            No narratives yet. Upload a report to populate the library.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {narratives?.map((n) => (
            <div
              key={n.id}
              style={{
                background: '#fff', borderRadius: '10px', padding: '20px',
                boxShadow: '0 2px 8px rgba(75,46,131,0.08)', cursor: 'pointer'
              }}
              onClick={() => setExpanded(expandedId === n.id ? null : n.id)}
            >
              {/* Preview row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#1A1A2E', fontSize: '14px', margin: '0 0 8px', lineHeight: 1.5 }}>
                    {expandedId === n.id ? n.text : n.text_preview}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {n.kpis.map((k) => (
                      <span key={k.code} style={{
                        background: '#4B2E83', color: '#fff',
                        fontSize: '11px', padding: '2px 10px', borderRadius: '20px'
                      }}>
                        {k.code} --- {Math.round(k.confidence * 100)}%
                      </span>
                    ))}
                  </div>
                </div>
                <span style={{ color: '#C9A84C', fontSize: '18px', marginLeft: '16px' }}>
                  {expandedId === n.id ? '▲' : '▼'}
                </span>
              </div>

              {/* Metadata */}
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
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