import React, { useRef } from 'react';
import './FileUpload.css';

function FileUpload({ onFileUpload }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      e.target.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/json') {
      onFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="file-upload">
      <div
        className="upload-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="upload-content">
          <p className="upload-icon">📂</p>
          <h2>Загрузи дорожную карту</h2>
          <p className="upload-description">
            Перетащи JSON файл или нажми для выбора
          </p>
          <button
            className="upload-button"
            onClick={() => fileInputRef.current?.click()}
          >
            Выбрать файл
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      <div className="file-format-info">
        <h3>Формат JSON файла:</h3>
        <pre className="code-block">{`{
  "title": "Название карты",
  "description": "Описание карты",
  "topics": [
    {
      "id": "topic-1",
      "title": "Тема 1",
      "description": "Описание темы",
      "resources": ["https://link.com"]
    }
  ]
}`}</pre>
      </div>
    </div>
  );
}

export default FileUpload;
