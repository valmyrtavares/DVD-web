import React, { useState, useEffect } from 'react';
import Home from './pages/Home.jsx';
import Chapters from './pages/Chapters.jsx';
import Extras from './pages/Extras.jsx';
import Login from './pages/Login.jsx';
import VideoPlayer from './pages/VideoPlayer.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Admin from './pages/Admin.jsx';
import { db } from './config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [playingVideoUrl, setPlayingVideoUrl] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function loadEventConfig() {
      const path = window.location.pathname;
      const slug = path.split('/')[1] || '';

      console.log('Detectado slug:', slug);

      // Se for a rota admin, paramos o carregamento de evento normal
      if (slug.toLowerCase() === 'admin') {
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      // Se não houver slug (URL raiz), podemos mostrar uma landing page ou erro
      if (!slug) {
        console.log('Nenhum slug fornecido na URL raiz.');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "eventos", slug.toLowerCase());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const eventData = docSnap.data();
          console.log('Evento encontrado no Firestore:', eventData.titulo);

          setConfig(eventData);

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
      <div className="loading-screen" style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000' }}>
        <p>Carregando...</p>
      </div>
    );
  }

  // ROTA ADMIN
  if (isAdmin) {
    return <Admin />;
  }

  // URL Raiz ou Evento não encontrado
  if (!config) {
    return (
      <div className="landing-container" style={{ padding: '100px 20px', textAlign: 'center', color: 'white', background: '#000', height: '100vh' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>DVD Digital</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Transformando seus eventos em experiências eternas.</p>
        <div style={{ marginTop: '40px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', display: 'inline-block' }}>
          <p>Para acessar seu conteúdo, utilize o link enviado pelo seu estúdio.</p>
          <a href="/admin" style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '20px', display: 'block', textDecoration: 'none' }}>Gerenciar Eventos</a>
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

      {!playingVideoUrl && <Footer config={config} />}

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
