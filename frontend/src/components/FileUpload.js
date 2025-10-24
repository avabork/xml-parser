// src/components/FileUpload.js
import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css'; // We'll create this new CSS file

const FileUpload = ({ onUploadSuccess, api_url }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError(null);
      setSuccess(null);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post(`${api_url}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('File uploaded successfully!');
      onUploadSuccess(); // Trigger a refetch in the parent
      setFile(null); // Clear the file input
      setFileName('No file chosen');
      e.target.reset(); // Reset the form
    } catch (err) {
      const msg = err.response?.data?.message || 'File upload failed. Check file format (XML only).';
      setError(msg);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-section card">
      <h3>Upload New XML Report</h3>
      <form onSubmit={onSubmit}>
        <div className="file-upload-wrapper">
          <label htmlFor="file-upload" className="file-upload-button">
            Choose File
          </label>
          <span className="file-name">{fileName}</span>
          <input
            id="file-upload"
            type="file"
            accept=".xml,text/xml"
            onChange={onFileChange}
          />
        </div>
        <button type="submit" className="upload-button" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload & Process'}
        </button>
      </form>
      {error && <p className="message error">{error}</p>}
      {success && <p className="message success">{success}</p>}
    </div>
  );
};

export default FileUpload;