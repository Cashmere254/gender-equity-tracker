// frontend/src/components/FileUploader.jsx
// Reusable drag-and-drop file upload zone.
// Props:
//   onFileSelect(file) --- callback invoked when a file is chosen
//   accept             --- MIME types string (default '.pdf,.docx,.txt,.csv')
//   maxSizeMB          --- maximum file size in MB (default 50)

import { useState, useRef } from 'react';

export default function FileUploader({
  onFileSelect,
  accept = '.pdf,.docx,.txt,.csv',
  maxSizeMB = 50
}) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setFileError(`File too large. Maximum size is ${maxSizeMB} MB.`);
      return;
    }

    setFileError('');
    setFileName(file.name);
    onFileSelect(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div
      style={{ ...styles.zone, ...(dragging ? styles.dragging : {}) }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current.click()}
    >
      <div style={styles.icon}>📤</div>
      <p style={styles.label}>
        DROP FILE HERE or <span style={styles.browse}>Browse</span>
      </p>
      <p style={styles.hint}>Accepts: PDF, DOCX, TXT, CSV --- Max {maxSizeMB} MB</p>

      {fileName && <p style={styles.fileName}>✅ {fileName}</p>}
      {fileError && <p style={styles.error}>{fileError}</p>}

      <input
        ref={inputRef}
        type='file'
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}

const styles = {
  zone: {
    border: '2px dashed #4B2E83',
    borderRadius: '12px',
    padding: '40px 20px',
    textAlign: 'center',
    background: '#F3EFF8',
    cursor: 'pointer',
    transition: 'background 0.2s, border-color 0.2s',
  },
  dragging: {
    background: '#EDE8F7',
    borderColor: '#C9A84C',
  },
  icon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  label: {
    color: '#4B2E83',
    fontWeight: 600,
    fontSize: '15px',
  },
  browse: {
    textDecoration: 'underline',
    color: '#C9A84C',
  },
  hint: {
    color: '#999',
    fontSize: '12px',
    marginTop: '6px',
  },
  fileName: {
    color: '#1E6B45',
    fontWeight: 600,
    marginTop: '10px',
    fontSize: '14px',
  },
  error: {
    color: '#C0392B',
    fontSize: '13px',
    marginTop: '8px',
  },
};