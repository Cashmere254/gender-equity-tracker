// frontend/src/pages/UploadPage.jsx

import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { getPrograms, uploadDocument } from '../services/api';
import Sidebar from '../components/Sidebar';
import FileUploader from '../components/FileUploader';

const SOURCE_TYPES = [
  'Focus Group Transcript',
  'Field Notes',
  'Beneficiary Narrative',
  'Programme Report',
  'Survey CSV'
];

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [programId, setProgramId] = useState('');
  const [sourceType, setSourceType] = useState(SOURCE_TYPES[0]);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const { data: programs } = useFetch(getPrograms);

  const handleSubmit = async () => {
    if (!file) {
      setStatus('error');
      setMessage('Please select a file.');
      return;
    }
    if (!programId) {
      setStatus('error');
      setMessage('Please select a programme.');
      return;
    }

    setUploading(true);
    setStatus(null);

    const fd = new FormData();
    fd.append('file', file);
    fd.append('program_id', programId);
    fd.append('source_type', sourceType);

    try {
      const res = await uploadDocument(fd);
      setStatus('success');
      setMessage(`✅ Uploaded! ${res.data.chunks} narrative chunks sent to AI analysis.`);
      setFile(null);
    } catch (err) {
      const msg = err.response?.data?.error || 'Upload failed. Please try again.';
      setStatus('error');
      setMessage(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar />
      <main style={{
        flex: 1, padding: '40px',
        background: '#F7F5FB', maxWidth: '760px'
      }}>
        <h1 style={{ color: '#4B2E83', marginBottom: '8px' }}>
          Upload Qualitative Evidence
        </h1>
        <p style={{ color: '#666', marginBottom: '28px' }}>
          Upload programme reports for AI analysis. Accepts PDF, DOCX, TXT, CSV.
        </p>

        {/* FileUploader component */}
        <FileUploader onFileSelect={setFile} />

        {/* Metadata form */}
        <div style={{
          background: '#fff', padding: '24px', borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', margin: '24px 0'
        }}>
          <label style={styles.label}>Programme *</label>
          <select
            style={styles.select}
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
          >
            <option value=''>Select a programme...</option>
            {programs?.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <label style={styles.label}>Source Type</label>
          <select
            style={styles.select}
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value)}
          >
            {SOURCE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Status banner */}
        {status && (
          <div style={{
            padding: '12px', borderRadius: '6px', marginBottom: '16px',
            background: status === 'success' ? '#EDF7F1' : '#fdf0f0',
            color: status === 'success' ? '#1E6B45' : '#C0392B'
          }}>
            {message}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            style={styles.submitBtn}
          >
            {uploading ? 'Analyzing...' : 'Submit for Analysis'}
          </button>
          <button
            onClick={() => { setFile(null); setStatus(null); setMessage(''); }}
            style={styles.clearBtn}
          >
            Clear
          </button>
        </div>

        <p style={{ color: '#999', fontSize: '12px', marginTop: '12px', fontStyle: 'italic' }}>
          After submission, AI will extract themes, entities, and sentiment with confidence scores.
        </p>
      </main>
    </div>
  );
}

const styles = {
  label: {
    display: 'block',
    fontWeight: 600,
    color: '#555',
    fontSize: '13px',
    margin: '0 0 6px',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  submitBtn: {
    background: '#4B2E83',
    color: '#fff',
    border: 'none',
    padding: '12px 28px',
    borderRadius: '6px',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '15px',
  },
  clearBtn: {
    background: '#C0392B',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};