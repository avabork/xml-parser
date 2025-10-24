import React from 'react';
import ReportDisplay from '../components/ReportDisplay';
import FileUpload from '../components/FileUpload';
import './HistoryPage.css';

const HistoryPage = ({ allReports, onDelete, onUploadSuccess, api_url, loading }) => {
  return (
    <div className="history-page-container">
      <div className="history-header">
        <h2>Report History & Upload</h2>
        <p>View all previously uploaded reports or upload a new one.</p>
      </div>

      <FileUpload onUploadSuccess={onUploadSuccess} api_url={api_url} />

      <div className="report-list">
        <h3>All Reports ({allReports.length})</h3>
        
        {loading && <p className="loading card">Loading reports...</p>}

        {!loading && allReports.length === 0 && (
          <p className="empty-state card">No reports found.</p>
        )}
        
        {!loading && allReports.map((report) => (
          <ReportDisplay 
            key={report._id} 
            report={report} 
            onDelete={onDelete} 
          />
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
