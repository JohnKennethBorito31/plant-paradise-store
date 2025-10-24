import React from 'react';
import ReactDOM from 'react-dom/client';
import MainApp from './App.jsx';
import './style.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);