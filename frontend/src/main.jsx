import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { LanguageProvider } from './i18n/useTranslation';
import { FarmerTokenProvider } from './auth/FarmerTokenContext';
import { AdminAuthProvider } from './auth/AdminAuthContext';

// Register Service Worker for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration failed silently
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <FarmerTokenProvider>
          <AdminAuthProvider>
            <App />
          </AdminAuthProvider>
        </FarmerTokenProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
