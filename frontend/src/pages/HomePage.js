import React from 'react';
import FileUpload from '../components/FileUpload';
import ReportDisplay from '../components/ReportDisplay';

// This page shows upload + most recent report
const HomePage = ({ latestReport, onUploadSuccess, api_url, onDelete, loading }) => {
  return (
    <div className="homepage-container">
      
      {/* Upload Section */}
      <h2 className="homepage-header">Upload New XML File</h2>
      <FileUpload onUploadSuccess={onUploadSuccess} api_url={api_url} />

      {/* Latest Report Section */}
      <h2 className="homepage-header">Most Recent Report</h2>

      {loading && <p className="loading card">Loading...</p>}

      {!loading && !latestReport && (
        <p className="empty-state">No reports found. Upload one to begin.</p>
      )}

      {latestReport && (
        <ReportDisplay 
          report={latestReport} 
          onDelete={onDelete} 
        />
      )}
    </div>
  );
};

export default HomePage;
