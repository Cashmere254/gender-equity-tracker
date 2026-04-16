// frontend/src/pages/ReportBuilder.jsx

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useFetch } from '../hooks/useFetch';
import { getPrograms, saveReport, exportReportDocx } from '../services/api';
import Sidebar from '../components/Sidebar';

const COMPONENT_LIBRARY = [
  { type: 'cover_page',        label: '📄 Cover Page' },
  { type: 'executive_summary', label: '📋 Executive Summary' },
  { type: 'kpi_grid',          label: '📊 KPI Grid' },
  { type: 'sentiment_chart',   label: '📈 Sentiment Chart' },
  { type: 'narrative_block',   label: '📝 Narrative Block' },
  { type: 'evidence_table',    label: '🔍 Evidence Table' },
  { type: 'appendix',          label: '📎 Appendix' },
];

// ─── Rich placeholder content per section type ────────────────────────────────
function getDefaultContent(type) {
  switch (type) {
    case 'cover_page':
      return 'Akili Dada — Gender Equity Impact Report | Q1 2026';
    case 'executive_summary':
      return 'This report presents AI-analysed evidence of gender equity outcomes across the programme period. Evidence is drawn from qualitative participant narratives, processed using the GEI Tracker NLP pipeline.';
    case 'kpi_grid':
      return 'KPI Grid — Select a programme in the Properties panel to load live KPI data. Each card will display evidence count, average confidence score, and sentiment rating.';
    case 'sentiment_chart':
      return 'Sentiment Trend Chart — AI confidence and sentiment trends across all active KPIs.';
    case 'narrative_block':
      return 'Beneficiary narrative block — drag a specific narrative here from the Evidence Library.';
    case 'evidence_table':
      return 'Evidence traceability table — each KPI finding linked to its source narrative and document.';
    case 'appendix':
      return 'Appendix A: Raw NLP extraction data. Appendix B: Source document list.';
    default:
      return '[Section content — click to edit]';
  }
}

export default function ReportBuilder() {
  const [sections, setSections]         = useState([]);
  const [title, setTitle]               = useState('');
  const [programId, setProgramId]       = useState('');
  const [saving, setSaving]             = useState(false);
  const [exporting, setExporting]       = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [message, setMessage]           = useState('');
  const [messageType, setMessageType]   = useState('');
  const [savedReportId, setSavedReportId] = useState(null);
  const { data: programs }              = useFetch(getPrograms);

  // ─── Add a section from the component library ─────────────────────────────
  const addSection = (component) => {
    const newSection = {
      id:      `section-${Date.now()}`,
      type:    component.type,
      heading: component.label.replace(/^[^\s]+\s/, ''), // strip emoji
      content: getDefaultContent(component.type),        // rich placeholder
    };
    setSections([...sections, newSection]);
  };

  // ─── Remove a section ─────────────────────────────────────────────────────
  const removeSection = (id) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  // ─── Update section content inline ────────────────────────────────────────
  const updateContent = (id, content) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, content } : s)));
  };

  // ─── Drag-and-drop reorder ────────────────────────────────────────────────
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = [...sections];
    const [moved]   = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setSections(reordered);
  };

  // ─── Save draft to backend ────────────────────────────────────────────────
  const handleSave = async () => {
    if (!programId)        { setMessage('Please select a programme.');       setMessageType('error'); return; }
    if (!title)            { setMessage('Please enter a report title.');      setMessageType('error'); return; }
    if (sections.length === 0) { setMessage('Add at least one section.');    setMessageType('error'); return; }
    setSaving(true);
    try {
      const res = await saveReport({
        program_id: programId,
        title,
        sections:   sections.map((s) => ({ heading: s.heading, content: s.content })),
        report_id:  savedReportId || undefined,
      });
      setSavedReportId(res.data.report_id);
      setMessage('✅ Report draft saved successfully.');
      setMessageType('success');
    } catch {
      setMessage('Failed to save report. Please try again.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  // ─── Export DOCX ──────────────────────────────────────────────────────────
  const handleExportDocx = async () => {
    if (!savedReportId) {
      setMessage('Please save the report first before exporting.');
      setMessageType('error');
      return;
    }
    setExporting(true);
    try {
      const res  = await exportReportDocx(savedReportId);
      const url  = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href  = url;
      link.setAttribute('download', `${title || 'report'}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage('✅ DOCX exported successfully.');
      setMessageType('success');
    } catch {
      setMessage('Export failed. Please try again.');
      setMessageType('error');
    } finally {
      setExporting(false);
    }
  };

  // ─── Export PDF (browser-side via print dialog) ───────────────────────────
  const handleExportPdf = async () => {
    if (sections.length === 0) {
      setMessage('Add at least one section before exporting PDF.');
      setMessageType('error');
      return;
    }
    setExportingPdf(true);
    try {
      // Open a print-ready window with the canvas content
      const canvas    = document.getElementById('report-canvas');
      const content   = canvas ? canvas.innerHTML : '<p>No content</p>';
      const printWin  = window.open('', '_blank', 'width=900,height=700');
      printWin.document.write(`
        <html>
          <head>
            <title>${title || 'GEI Report'}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; color: #1A1A2E; }
              h2   { color: #4B2E83; border-bottom: 2px solid #C9A84C; padding-bottom: 6px; }
              textarea, input { display: none; }
              .section-content { white-space: pre-wrap; font-size: 14px; line-height: 1.6; }
            </style>
          </head>
          <body>
            <h1 style="color:#4B2E83;">${title || 'Gender Equity Impact Report'}</h1>
            ${sections.map((s, i) => `
              <h2>§${i + 1} — ${s.heading}</h2>
              <p class="section-content">${s.content}</p>
            `).join('')}
            <hr/>
            <p style="color:#999;font-size:11px;">Generated by GEI Tracker · ${new Date().toLocaleDateString()}</p>
          </body>
        </html>
      `);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => { printWin.print(); printWin.close(); }, 500);
      setMessage('✅ PDF export dialog opened.');
      setMessageType('success');
    } catch {
      setMessage('PDF export failed. Please try again.');
      setMessageType('error');
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar />
      <main style={{ flex: 1, background: '#F7F5FB', display: 'flex', flexDirection: 'column' }}>

        {/* ─── Toolbar ──────────────────────────────────────────────────── */}
        <div style={styles.toolbar}>
          <h1 style={styles.toolbarTitle}>Report Builder</h1>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleSave} disabled={saving} style={styles.saveBtn}>
              {saving ? 'Saving...' : '💾 Save Draft'}
            </button>
            <button onClick={handleExportDocx} disabled={exporting} style={styles.exportBtn}>
              {exporting ? 'Exporting...' : '📄 Export DOCX'}
            </button>
            <button onClick={handleExportPdf} disabled={exportingPdf} style={styles.pdfBtn}>
              {exportingPdf ? 'Preparing...' : '🖨 Export PDF'}
            </button>
          </div>
        </div>

        {/* ─── Message banner ───────────────────────────────────────────── */}
        {message && (
          <div style={{
            padding: '10px 32px', fontSize: '13px',
            background: messageType === 'success' ? '#EDF7F1' : '#fdf0f0',
            color:      messageType === 'success' ? '#1E6B45' : '#C0392B',
          }}>
            {message}
          </div>
        )}

        {/* ─── Three-panel layout ───────────────────────────────────────── */}
        <div style={styles.panels}>

          {/* Left panel: Component library */}
          <div style={styles.leftPanel}>
            <h3 style={styles.panelTitle}>Components</h3>
            <p style={styles.panelHint}>Click to add to canvas</p>
            {COMPONENT_LIBRARY.map((c) => (
              <div
                key={c.type}
                style={styles.componentItem}
                onClick={() => addSection(c)}
              >
                {c.label}
              </div>
            ))}
          </div>

          {/* Centre panel: Drag-and-drop canvas */}
          <div style={styles.centrePanel}>
            <h3 style={styles.panelTitle}>Report Canvas</h3>
            {sections.length === 0 && (
              <div style={styles.emptyCanvas}>
                <p>Click a component on the left to add it here.</p>
                <p style={{ fontSize: '12px', color: '#bbb', marginTop: '8px' }}>
                  Drag sections to reorder them.
                </p>
              </div>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="canvas">
                {(provided) => (
                  <div
                    id="report-canvas"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {sections.map((section, index) => (
                      <Draggable key={section.id} draggableId={section.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{ ...styles.sectionCard, ...provided.draggableProps.style }}
                          >
                            <div style={styles.sectionHeader}>
                              <span
                                {...provided.dragHandleProps}
                                style={styles.dragHandle}
                                title="Drag to reorder"
                              >
                                ⠿
                              </span>
                              <span style={styles.sectionNum}>§{index + 1}</span>
                              <span style={styles.sectionTitle}>{section.heading}</span>
                              <button
                                onClick={() => removeSection(section.id)}
                                style={styles.removeBtn}
                                title="Remove section"
                              >
                                ✕
                              </button>
                            </div>
                            <textarea
                              style={styles.textarea}
                              value={section.content}
                              onChange={(e) => updateContent(section.id, e.target.value)}
                              rows={3}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* Right panel: Properties */}
          <div style={styles.rightPanel}>
            <h3 style={styles.panelTitle}>Properties</h3>
            <label style={styles.label}>Report Title</label>
            <input
              style={styles.input}
              type="text"
              placeholder="e.g. Q1 2026 Impact Report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label style={styles.label}>Programme</label>
            <select
              style={styles.input}
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
            >
              <option value="">Select programme...</option>
              {programs?.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <label style={styles.label}>Sections</label>
            <p style={{ color: '#4B2E83', fontWeight: 700, fontSize: '24px', margin: '4px 0' }}>
              {sections.length}
            </p>
            <div style={{ marginTop: '16px', padding: '12px', background: '#F3EFF8', borderRadius: '6px' }}>
              <p style={{ color: '#666', fontSize: '12px', lineHeight: 1.6 }}>
                💡 <strong>Tip:</strong> Save your draft first, then use Export DOCX to download.
                The AI never has the final say — edit any section before publishing.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

const styles = {
  toolbar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 24px', background: '#fff',
    borderBottom: '1px solid #e0d9f0',
  },
  toolbarTitle: {
    color: '#4B2E83', margin: 0, fontSize: '20px', fontWeight: 700,
  },
  saveBtn: {
    background: '#6B4FA8', color: '#fff', border: 'none',
    padding: '9px 20px', borderRadius: '6px', fontWeight: 700,
    cursor: 'pointer', fontSize: '14px',
  },
  exportBtn: {
    background: '#4B2E83', color: '#fff', border: 'none',
    padding: '9px 20px', borderRadius: '6px', fontWeight: 700,
    cursor: 'pointer', fontSize: '14px',
  },
  pdfBtn: {
    background: '#C9A84C', color: '#fff', border: 'none',
    padding: '9px 20px', borderRadius: '6px', fontWeight: 700,
    cursor: 'pointer', fontSize: '14px',
  },
  panels: {
    display: 'flex', flex: 1, gap: '0', overflow: 'hidden',
  },
  leftPanel: {
    width: '200px', background: '#fff', padding: '20px 16px',
    borderRight: '1px solid #e0d9f0', overflowY: 'auto',
  },
  centrePanel: {
    flex: 1, padding: '20px 24px', overflowY: 'auto',
  },
  rightPanel: {
    width: '220px', background: '#fff', padding: '20px 16px',
    borderLeft: '1px solid #e0d9f0', overflowY: 'auto',
  },
  panelTitle: {
    color: '#4B2E83', fontSize: '14px', fontWeight: 700,
    marginBottom: '8px', marginTop: 0,
  },
  panelHint: {
    color: '#999', fontSize: '11px', marginBottom: '12px', marginTop: 0,
  },
  componentItem: {
    background: '#F3EFF8', border: '1px solid #d0c8e8',
    borderRadius: '6px', padding: '9px 12px', marginBottom: '8px',
    fontSize: '13px', cursor: 'pointer', color: '#4B2E83',
    transition: 'background 0.2s',
  },
  emptyCanvas: {
    border: '2px dashed #c0b8d8', borderRadius: '10px',
    padding: '40px', textAlign: 'center',
    color: '#aaa', fontSize: '14px',
  },
  sectionCard: {
    background: '#fff', borderRadius: '8px', marginBottom: '12px',
    boxShadow: '0 2px 8px rgba(75,46,131,0.08)',
    border: '1px solid #e0d9f0',
  },
  sectionHeader: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '10px 14px', borderBottom: '1px solid #f0eaf8',
  },
  dragHandle: {
    cursor: 'grab', color: '#bbb', fontSize: '18px', lineHeight: 1,
  },
  sectionNum: {
    color: '#C9A84C', fontWeight: 700, fontSize: '13px',
  },
  sectionTitle: {
    flex: 1, color: '#4B2E83', fontWeight: 600, fontSize: '13px',
  },
  removeBtn: {
    background: 'none', border: 'none', color: '#C0392B',
    cursor: 'pointer', fontSize: '14px', fontWeight: 700,
  },
  textarea: {
    width: '100%', padding: '12px 14px', border: 'none',
    borderRadius: '0 0 8px 8px', fontSize: '13px',
    color: '#555', resize: 'vertical', boxSizing: 'border-box',
    background: '#FDFBFF', outline: 'none',
  },
  label: {
    display: 'block', color: '#555', fontSize: '12px',
    fontWeight: 600, marginBottom: '4px', marginTop: '12px',
  },
  input: {
    width: '100%', padding: '8px 10px', border: '1px solid #ddd',
    borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box',
  },
};