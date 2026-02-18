import React, { useState } from 'react';
import Home from './pages/Home.jsx';
import Chapters from './pages/Chapters.jsx';
import Extras from './pages/Extras.jsx';
import Header from './components/Header.jsx';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

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
