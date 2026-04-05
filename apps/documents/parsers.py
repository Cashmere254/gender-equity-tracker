# apps/documents/parsers.py

import PyPDF2
import docx as python_docx
import csv


def extract_text(file_path: str, mime_type: str) -> str:
    """
    Reads a file and returns its plain text content.
    Supports: PDF, DOCX, TXT, CSV.
    Raises ValueError for unsupported formats.
    """
    if mime_type == 'application/pdf':
        return _read_pdf(file_path)
    elif 'wordprocessingml' in mime_type or file_path.endswith('.docx'):
        return _read_docx(file_path)
    elif mime_type == 'text/plain':
        return _read_txt(file_path)
    elif mime_type == 'text/csv':
        return _read_csv(file_path)
    else:
        raise ValueError(f'Unsupported file type: {mime_type}')


def _read_pdf(path: str) -> str:
    text = []
    with open(path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text.append(extracted)
    return '\n'.join(text)


def _read_docx(path: str) -> str:
    doc = python_docx.Document(path)
    return '\n'.join(p.text for p in doc.paragraphs if p.text.strip())


def _read_txt(path: str) -> str:
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()


def _read_csv(path: str) -> str:
    rows = []
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        reader = csv.reader(f)
        for row in reader:
            rows.append(' '.join(cell for cell in row if cell.strip()))
    return '\n'.join(rows)


def split_into_chunks(text: str, chunk_size: int = 500) -> list:
    """
    Splits a long text into narrative chunks of ~chunk_size characters.
    Splits at sentence boundaries ('. ') to preserve context.
    Each chunk will become one Narrative database record.
    """
    sentences = text.replace('\n', ' ').split('. ')
    chunks, current = [], ''

    for s in sentences:
        if len(current) + len(s) < chunk_size:
            current += s + '. '
        else:
            if current.strip():
                chunks.append(current.strip())
            current = s + '. '

    if current.strip():
        chunks.append(current.strip())

    return chunks