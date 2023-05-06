import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { NotesContextProvider } from './contexts/NotesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <NotesContextProvider>
    <App />
  </NotesContextProvider>
);
