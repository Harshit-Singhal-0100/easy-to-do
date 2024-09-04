import React from 'react';
import './FileUpload.css';

const FileUpload = ({ onFilesAdded, existingFiles, onFileRemoved }) => {
  
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    onFilesAdded(newFiles);
  };

  const handleRemoveFile = (fileName) => {
    onFileRemoved(fileName);
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="file-input"
      />
      <div className="file-list">
        {existingFiles.map((file, index) => (
          <div key={index} className="file-item">
            <span>{file.name}</span>
            <button onClick={() => handleRemoveFile(file.name)} className="remove-button">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
