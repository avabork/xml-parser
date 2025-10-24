import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- IMPORT
import App from './App';
import './index.css'; // You can remove the App.css import from here

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- WRAP APP */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);