import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from './api/instance';
import Header from './components/Header/Header';
import MainPage from './pages/MainPage/MainPage';
import Modal from './components/Modal/Modal';
import AuthForm from './components/Auth/AuthForm';
import GenresPage from './pages/GenresPage/GenresPage';
import GenreDetailsPage from './pages/GenreDetailsPage/GenreDetailsPage';
import MoviePage from './pages/MoviePage/MoviePage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userName, setUserName] = useState<string | undefined>(undefined);

  const checkUserSession = async () => {
    try {
      const response = await api.get('/profile');
      setUserName(response.data.name);
    } catch (error) {
      handleUserLogout();
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  const handleUserLogout = () => {
    setUserName(undefined);
  };

  const handleOpenAuth = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (name: string) => {
    setUserName(name);
    setIsAuthModalOpen(false);
  };

  return (
    <Router>
      <div className="app-container">
        <Header
          userName={userName}
          onOpenAuth={handleOpenAuth}
        />

        <main>
          <Routes>
            <Route path="/" element={<MainPage userName={userName} onOpenAuth={handleOpenAuth} />} />
            <Route path="/account" element={<ProfilePage onLogout={handleUserLogout} />} />
            <Route path="/genres" element={<GenresPage />} />
            <Route path="/genres/:genreName" element={<GenreDetailsPage />} />
            <Route path="/movie/:id" element={<MoviePage userName={userName} onOpenAuth={handleOpenAuth} />} />
          </Routes>
        </main>

        <Footer />

        {isAuthModalOpen && (
          <Modal onClose={() => setIsAuthModalOpen(false)}>
            <AuthForm onSuccess={handleAuthSuccess} />
          </Modal>
        )}
      </div>
    </Router>
  );
}

export default App;