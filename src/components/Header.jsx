import React from 'react';
import './Header.css';

function Header({ roadmap, progress, onExport, progressPercentage }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <h1>📚 Трекер Дорожных Карт</h1>
          {roadmap && <p className="subtitle">{roadmap.title}</p>}
        </div>

        {roadmap && progressPercentage !== undefined && (
          <div className="progress-bar-section">
            <div className="progress-bar-label">
              <span>Прогресс выполнения</span>
              <span className="progress-percent">{progressPercentage}%</span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${progressPercentage}%`,
                  backgroundColor:
                    progressPercentage === 100
                      ? '#4CAF50'
                      : progressPercentage >= 50
                      ? '#FFC107'
                      : '#F44336',
                }}
              />
            </div>
          </div>
        )}

        {roadmap && onExport && (
          <button className="export-btn" onClick={onExport}>
            💾 Сохранить прогресс
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
