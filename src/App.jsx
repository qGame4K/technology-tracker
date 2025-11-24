import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import './App.css';

function App() {
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState({});
  const [error, setError] = useState(null);


  useEffect(() => {
    const savedRoadmap = localStorage.getItem('roadmap');
    if (savedRoadmap) {
      try {
        setRoadmap(JSON.parse(savedRoadmap));
      } catch (err) {
        localStorage.removeItem('roadmap');
      }
    }
    const savedProgress = localStorage.getItem('roadmapProgress');
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (err) {}
    }
  }, []);

  useEffect(() => {
    if (roadmap) {
      localStorage.setItem('roadmap', JSON.stringify(roadmap));
    }
  }, [roadmap]);


  useEffect(() => {
    if (Object.keys(progress).length > 0) {
      localStorage.setItem('roadmapProgress', JSON.stringify(progress));
    }
  }, [progress]);


  const handleFileUpload = async (file) => {
    try {
      setError(null);
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.title || !Array.isArray(data.topics)) {
        throw new Error('Неверный формат файла. Требуются поля: title, topics[]');
      }
      setRoadmap(data);
      const newProgress = {};
      data.topics.forEach((topic) => {
        if (!progress[topic.id]) {
          newProgress[topic.id] = {
            status: 'not-started',
            note: '',
            deadline: null,
          };
        }
      });
      setProgress((prev) => ({ ...prev, ...newProgress }));
    } catch (err) {
      setError(`Ошибка при загрузке файла: ${err.message}`);
    }
  };

 
  const resetRoadmap = () => {
    localStorage.removeItem('roadmap');
    localStorage.removeItem('roadmapProgress');
    setRoadmap(null);
    setProgress({});
  };

  // Экспорт прогресса
  const exportProgress = () => {
    if (!roadmap) {
      setError('Нет загруженной дорожной карты для экспорта');
      return;
    }
    const exportData = {
      ...roadmap,
      exportDate: new Date().toISOString(),
      userProgress: progress,
    };
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roadmap-progress-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };


  const updateProgress = (topicId, updates) => {
    setProgress((prev) => ({
      ...prev,
      [topicId]: {
        ...prev[topicId],
        ...updates,
      },
    }));
  };

  return (
    <Router>
      <div className="app">
        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                roadmap={roadmap}
                progress={progress}
                onFileUpload={handleFileUpload}
                onExport={exportProgress}
                onUpdateProgress={updateProgress}
                onResetRoadmap={resetRoadmap}
              />
            }
          />
          <Route
            path="/topic/:topicId"
            element={
              <DetailPage
                roadmap={roadmap}
                progress={progress}
                onUpdateProgress={updateProgress}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

