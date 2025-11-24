import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import FileUpload from '../components/FileUpload';
import './HomePage.css';

function HomePage({
  roadmap,
  progress,
  onFileUpload,
  onExport,
  onUpdateProgress,
  onResetRoadmap
}) {
  if (!roadmap) {
    return (
      <div className="home-page">
        <Header roadmap={null} progress={{}} />
        <FileUpload onFileUpload={onFileUpload} />
      </div>
    );
  }

  const totalTopics = roadmap.topics.length;
  const completedTopics = roadmap.topics.filter(
    (t) => progress[t.id]?.status === 'completed'
  ).length;
  const inProgressTopics = roadmap.topics.filter(
    (t) => progress[t.id]?.status === 'in-progress'
  ).length;

  const progressPercentage = Math.round((completedTopics / totalTopics) * 100);

  const getStatusColor = (status) => {
    const colors = {
      'not-started': '#F44336',
      'in-progress': '#FFC107',
      completed: '#4CAF50',
    };
    return colors[status] || '#999';
  };

  return (
    <div className="home-page">
      <Header
        roadmap={roadmap}
        progress={progress}
        onExport={onExport}
        progressPercentage={progressPercentage}
      />

      <button className="reset-btn" onClick={onResetRoadmap}>
        Выйти / Загрузить новый роудмап
      </button>

      <div className="page-container">
        <div className="roadmap-info">
          <h1>{roadmap.title}</h1>
          <p>{roadmap.description}</p>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Всего тем</span>
              <span className="stat-value">{totalTopics}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Выполнено</span>
              <span className="stat-value completed">{completedTopics}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">В работе</span>
              <span className="stat-value inprogress">{inProgressTopics}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Осталось</span>
              <span className="stat-value notstarte">
                {totalTopics - completedTopics}
              </span>
            </div>
          </div>
        </div>

        <div className="topics-grid">
          {roadmap.topics.map((topic) => {
            const topicProgress = progress[topic.id] || {
              status: 'not-started',
              note: '',
              deadline: null,
            };
            const statusColor = getStatusColor(topicProgress.status);

            return (
              <Link to={`/topic/${topic.id}`} key={topic.id} className="topic-card-link">
                <div
                  className="topic-card"
                  style={{ borderLeftColor: statusColor }}
                >
                  <div className="card-header">
                    <h3>{topic.title}</h3>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: statusColor }}
                    >
                      {topicProgress.status === 'not-started' && '⭕'}
                      {topicProgress.status === 'in-progress' && '⏳'}
                      {topicProgress.status === 'completed' && '✅'}
                    </span>
                  </div>

                  <p className="card-description">{topic.description}</p>

                  {topicProgress.note && (
                    <div className="card-note-preview">
                      <strong>Заметка:</strong> {topicProgress.note.substring(0, 50)}
                      {topicProgress.note.length > 50 ? '...' : ''}
                    </div>
                  )}

                  {topicProgress.deadline && (
                    <div className="card-deadline">
                      📅 {new Date(topicProgress.deadline).toLocaleDateString('ru-RU')}
                    </div>
                  )}

                  <div className="card-status-label">
                    {topicProgress.status === 'not-started' && 'Не начато'}
                    {topicProgress.status === 'in-progress' && 'В работе'}
                    {topicProgress.status === 'completed' && 'Выполнено'}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HomePage;

