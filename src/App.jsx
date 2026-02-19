import React, { useState, useEffect } from 'react';
import Home from './pages/Home.jsx';
import Chapters from './pages/Chapters.jsx';
import Extras from './pages/Extras.jsx';
import Login from './pages/Login.jsx';
import VideoPlayer from './pages/VideoPlayer.jsx';
import Header from './components/Header.jsx';
import { db } from './config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [playingVideoUrl, setPlayingVideoUrl] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEventConfig() {
      // 1. Identifica o slug da URL (ex: /janaina-e-carlos)
      const path = window.location.pathname;
      const slug = path.split('/')[1] || '';

      console.log('Detectado slug:', slug);

      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        // 2. Busca no Cloud Firestore
        // O slug deve ser EXATAMENTE o ID do documento no Firestore
        const docRef = doc(db, "eventos", slug.toLowerCase());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const eventData = docSnap.data();
          console.log('Evento encontrado no Firestore:', eventData.titulo);

          setConfig(eventData);

          // 3. Verifica se já existe uma senha salva para ESTE evento
          const storedAuth = localStorage.getItem(`dvd_auth_${eventData.titulo}`);
          if (storedAuth === eventData.senha) {
            setIsAuthenticated(true);
          }
        } else {
          console.log('Nenhum evento no Firestore com ID:', slug.toLowerCase());
        }
      } catch (error) {
        console.error("Erro ao buscar evento no Firestore:", error);
      } finally {
        setLoading(false);
      }
    }

    loadEventConfig();
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
          <p>Tente usar o link exato que foi fornecido.</p>
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
