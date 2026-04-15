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
  'Survey CSV',
];

export default function UploadPage() {
  const [file, setFile]           = useState(null);
  const [programId, setProgramId] = useState('');
  const [sourceType, setSourceType] = useState(SOURCE_TYPES[0]);
  const [status, setStatus]       = useState(null);
  const [message, setMessage]     = useState('');
  const [uploading, setUploading] = useState(false);
  const { data: programs }        = useFetch(getPrograms);

  const handleSubmit = async () => {
    if (!file)      { setStatus('error'); setMessage('Please select a file.'); return; }
    if (!programId) { setStatus('error'); setMessage('Please select a programme.'); return; }

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
      setStatus('error');
      setMessage(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content" style={{ maxWidth: '760px' }}>

        <h1 className="page-title">Upload Qualitative Evidence</h1>
        <p className="page-subtitle">
          Upload programme reports for AI analysis. Accepts PDF, DOCX, TXT, CSV.
        </p>

        {/* FileUploader */}
        <FileUploader onFileSelect={setFile} />

        {/* Metadata form */}
        <div className="card" style={{ margin: '24px 0' }}>
          <label style={labelStyle}>Programme *</label>
          <select
            className="form-input"
            style={{ marginBottom: '16px' }}
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
          >
            <option value="">Select a programme...</option>
            {programs?.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <label style={labelStyle}>Source Type</label>
          <select
            className="form-input"
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value)}
          >
            {SOURCE_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Status banner */}
        {status && (
          <div className={status === 'success' ? 'alert-success' : 'alert-error'}
            style={{ marginBottom: '16px' }}>
            {message}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={uploading}
            style={{ padding: '12px 28px', fontSize: '15px' }}
          >
            {uploading ? 'Analyzing...' : 'Submit for Analysis'}
          </button>
          <button
            className="btn-secondary"
            onClick={() => { setFile(null); setStatus(null); setMessage(''); }}
            style={{ padding: '12px 24px' }}
          >
            Clear
          </button>
        </div>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginTop: '12px', fontStyle: 'italic' }}>
          After submission, AI will extract themes, entities, and sentiment with confidence scores.
        </p>
      </main>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontWeight: 600,
  color: '#555',
  fontSize: '13px',
  marginBottom: '6px',
};