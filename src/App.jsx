import React, { useState, useEffect } from 'react';
import Home from './pages/Home.jsx';
import Chapters from './pages/Chapters.jsx';
import Extras from './pages/Extras.jsx';
import Login from './pages/Login.jsx';
import Header from './components/Header.jsx';
import eventConfig from './config/eventConfig';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Verifica se já existe uma senha salva e se ela bate com a do config atual
    const storedAuth = localStorage.getItem('dvd_auth_password');
    if (storedAuth === eventConfig.senha) {
      setIsAuthenticated(true);
    } else if (storedAuth) {
      // Se a senha mudou no config, removemos a antiga do localStorage
      localStorage.removeItem('dvd_auth_password');
    }
  }, []);

  const handleLogin = (password) => {
    localStorage.setItem('dvd_auth_password', password);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'capitulos':
        return <Chapters />;
      case 'extras':
        return <Extras />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app-container">
      <Header active={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;
