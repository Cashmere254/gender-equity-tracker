// frontend/src/services/api.js

import axios from 'axios';

// ─── Base URL --- switches between dev and production automatically ───────────
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api',
});

// ─── Request interceptor: attach JWT token ────────────────────────────────────
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response interceptor: handle token expiry ───────────────────────────────
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth endpoints ───────────────────────────────────────────────────────────
export const login = (data) => API.post('/auth/login/', data);
export const register = (data) => API.post('/auth/register/', data);
export const getMe = () => API.get('/auth/me/');
export const changePassword = (data) => API.post('/auth/change-password/', data);
export const forgotPassword = (data) => API.post('/auth/password-reset-request/', data);
export const resetPassword = (data) => API.post('/auth/password-reset-confirm/', data);

// ─── Program endpoints ────────────────────────────────────────────────────────
export const getPrograms = () => API.get('/programs/programs/');
export const createProgram = (d) => API.post('/programs/programs/', d);
export const getGrants = (id) => API.get(`/programs/grants/?program_id=${id}`);
export const getIndicators = () => API.get('/programs/indicators/');

// ─── Document / upload endpoints ─────────────────────────────────────────────
export const uploadDocument = (fd) =>
  API.post('/documents/upload/', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

export const getNarratives = (programId) =>
  API.get(`/documents/narratives/${programId ? '?program_id=' + programId : ''}`);

// ─── Dashboard endpoints ──────────────────────────────────────────────────────
export const getKPISummary = (programId) =>
  API.get(`/dashboard/kpi-summary/${programId ? '?program_id=' + programId : ''}`);

// ─── Report endpoints ─────────────────────────────────────────────────────────
export const listReports = () => API.get('/reports/');
export const saveReport = (data) => API.post('/reports/save/', data);
export const exportReportDocx = (reportId) =>
  API.get(`/reports/${reportId}/export-docx/`, { responseType: 'blob' });

export default API;