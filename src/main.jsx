import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-tailwind/react';

import App from './App.jsx';
import { useUiStore } from './store/uiStore.js';
import './index.css';

// index.html'dagi skript FOUC (chaqnashni) oldini oladi, bu yerda esa
// zustand holatini <html> klassi bilan sinxronlashtiramiz.
useUiStore.getState().applyThemeToDocument();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
