import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import './App.css'; 

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5001') + '/api/reports';

function App() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(API_URL);
      setReports(res.data);
    } catch (err) {
      setError('Failed to fetch reports.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDeleteReport = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchReports();
      } catch (err) {
        console.error('Error deleting report:', err);
        setError('Failed to delete report. Please try again.');
      }
    }
  };

  const handleUploadSuccess = () => {
    fetchReports();
  };

  const latestReport = reports.length > 0 ? reports[0] : null;

  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        {error && <p className="message error">{error}</p>}
        
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                latestReport={latestReport} 
                onUploadSuccess={handleUploadSuccess} 
                api_url={API_URL} 
                onDelete={handleDeleteReport} 
                loading={loading}
              />
            } 
          />
          <Route 
            path="/history" 
            element={
              <HistoryPage 
                allReports={reports} 
                onDelete={handleDeleteReport} 
                onUploadSuccess={handleUploadSuccess}
                api_url={API_URL}
                loading={loading}
              />
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
