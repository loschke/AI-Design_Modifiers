import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Check for dark mode preference
const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
const storedPreference = localStorage.getItem('darkMode');
const shouldEnableDarkMode = storedPreference 
  ? storedPreference === 'true'
  : darkModePreference;

// Apply dark mode if needed
if (shouldEnableDarkMode) {
  document.documentElement.classList.add('dark');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
