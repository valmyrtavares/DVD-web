import React, { useState, useEffect } from 'react';
import Home from './pages/Home.jsx';
import Chapters from './pages/Chapters.jsx';
import Extras from './pages/Extras.jsx';
import Login from './pages/Login.jsx';
import VideoPlayer from './pages/VideoPlayer.jsx';
import Header from './components/Header.jsx';
import eventsMock from './config/eventsMock';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [playingVideoUrl, setPlayingVideoUrl] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Identifica o slug da URL (ex: /janaina-e-carlos)
    const path = window.location.pathname;
    const slug = path.split('/')[1] || ''; // Garante que não é undefined

    console.log('Detectado slug:', slug);

    // 2. Busca no Mock
    const eventData = eventsMock[slug.toLowerCase()] || eventsMock[slug];

    if (eventData) {
      console.log('Evento encontrado:', eventData.titulo);
      setConfig(eventData);

      // 3. Verifica se já existe uma senha salva para ESTE evento
      const storedAuth = localStorage.getItem(`dvd_auth_${eventData.titulo}`);
      if (storedAuth === eventData.senha) {
        setIsAuthenticated(true);
      }
    } else {
      console.log('Nenhum evento correspondente ao slug:', slug);
    }

    setLoading(false);
  }, []);

  const handleLogin = (password) => {
    if (!config) return;
    localStorage.setItem(`dvd_auth_${config.titulo}`, password);
    setIsAuthenticated(true);
  };

  const playVideo = (url) => {
    setPlayingVideoUrl(url);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Carregando DVD Digital...</p>
      </div>
    );
  }

  // Se não encontrou configuração, mostra erro amigável
  if (!config) {
    return (
      <div className="error-container" style={{ padding: '50px', textAlign: 'center', color: 'white' }}>
        <h1>Página não encontrada</h1>
        <p>O link do evento está incorreto ou não existe.</p>
        <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.1)', padding: '15px' }}>
          <p>Tente usar um destes exemplos para testar:</p>
          <code style={{ display: 'block', margin: '10px 0' }}>/janaina-e-carlos</code>
          <code style={{ display: 'block', margin: '10px 0' }}>/ana-e-rafael</code>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} config={config} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onPlayVideo={() => playVideo(config.filmePrincipal.url)} config={config} />;
      case 'capitulos':
        return <Chapters onPlayChapter={playVideo} config={config} />;
      case 'extras':
        return <Extras onPlayExtra={playVideo} config={config} />;
      default:
        return <Home onPlayVideo={() => playVideo(config.filmePrincipal.url)} config={config} />;
    }
  };

  return (
    <div className="app-container">
      <Header
        active={currentPage}
        config={config}
        onNavigate={(page) => {
          setCurrentPage(page);
          setPlayingVideoUrl(null);
        }}
      />

      {renderPage()}

      {playingVideoUrl && (
        <VideoPlayer
          videoUrl={playingVideoUrl}
          onClose={() => setPlayingVideoUrl(null)}
        />
      )}
    </div>
  );
}

export default App;
