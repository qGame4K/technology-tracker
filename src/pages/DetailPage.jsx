import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './DetailPage.css';

function DetailPage({ roadmap, progress, onUpdateProgress }) {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState('');

  if (!roadmap) {
    return (
      <div className="detail-page">
        <div className="no-roadmap">
          <p>Нет загруженной дорожной карты. Загрузите JSON файл на главной странице.</p>
          <button onClick={() => navigate('/')}>Вернуться на главную</button>
        </div>
      </div>
    );
  }

  const topic = roadmap.topics.find((t) => t.id === topicId);
  if (!topic) {
    return (
      <div className="detail-page">
        <div className="topic-not-found">
          <p>Тема не найдена</p>
          <button onClick={() => navigate('/')}>Вернуться на главную</button>
        </div>
      </div>
    );
  }

  const topicProgress = progress[topicId] || {
    status: 'not-started',
    note: '',
    deadline: null,
  };

  const handleStatusChange = (newStatus) => {
    onUpdateProgress(topicId, { status: newStatus });
  };

  const handleSaveNote = () => {
    onUpdateProgress(topicId, { note: noteText });
    setIsEditingNote(false);
  };

  const handleDeleteNote = () => {
    onUpdateProgress(topicId, { note: '' });
    setNoteText('');
    setIsEditingNote(false);
  };

  const handleEditClick = () => {
    setNoteText(topicProgress.note);
    setIsEditingNote(true);
  };

  const getStatusLabel = (status) => {
    const labels = {
      'not-started': 'Не начато',
      'in-progress': 'В работе',
      completed: 'Выполнено',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'not-started': '#F44336',
      'in-progress': '#FFC107',
      completed: '#4CAF50',
    };
    return colors[status] || '#999';
  };

  return (
    <div className="detail-page">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Вернуться на главную
      </button>

      <div className="detail-container">
        <header className="detail-header">
          <h1>{topic.title}</h1>
          <p className="description">{topic.description}</p>
        </header>

        <section className="status-section">
          <h2>Статус</h2>
          <div className="status-controls">
            {['not-started', 'in-progress', 'completed'].map((status) => (
              <button
                key={status}
                className={`status-button ${topicProgress.status === status ? 'active' : ''}`}
                style={{
                  borderColor: getStatusColor(status),
                  color: topicProgress.status === status ? 'white' : getStatusColor(status),
                  backgroundColor:
                    topicProgress.status === status ? getStatusColor(status) : 'transparent',
                }}
                onClick={() => handleStatusChange(status)}
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
        </section>

        <section className="deadline-section">
          <h2>Дедлайн</h2>
          <input
            type="date"
            value={topicProgress.deadline || ''}
            onChange={(e) => onUpdateProgress(topicId, { deadline: e.target.value })}
            className="deadline-input"
          />
          {topicProgress.deadline && (
            <p className="deadline-info">
              До: {new Date(topicProgress.deadline).toLocaleDateString('ru-RU')}
            </p>
          )}
        </section>

        {topic.resources && topic.resources.length > 0 && (
          <section className="resources-section">
            <h2>Полезные ресурсы</h2>
            <ul className="resources-list">
              {topic.resources.map((resource, idx) => (
                <li key={idx}>
                  <a href={resource} target="_blank" rel="noopener noreferrer">
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="notes-section">
          <h2>Заметка</h2>
          {!isEditingNote ? (
            <div className="note-display">
              {topicProgress.note ? (
                <div className="note-content">
                  <p>{topicProgress.note}</p>
                  <div className="note-actions">
                    <button className="edit-btn" onClick={handleEditClick}>
                      Редактировать
                    </button>
                    <button className="delete-btn" onClick={handleDeleteNote}>
                      Удалить
                    </button>
                  </div>
                </div>
              ) : (
                <p className="no-note">Нет заметок. Нажми "Добавить заметку"</p>
              )}
              {!topicProgress.note && (
                <button className="add-note-btn" onClick={handleEditClick}>
                  Добавить заметку
                </button>
              )}
            </div>
          ) : (
            <div className="note-editor">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Введи свою заметку..."
                className="note-textarea"
              />
              <div className="note-editor-actions">
                <button className="save-btn" onClick={handleSaveNote}>
                  Сохранить
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setIsEditingNote(false)}
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default DetailPage;
