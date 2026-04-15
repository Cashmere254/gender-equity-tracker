import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; //must come before App.js to override styles
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
