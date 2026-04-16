import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/instance';
import { fetchFavoriteMovies, removeMovieFromFavorites } from '../../api/MovieService';
import type { Movie } from '../../types/Movie';
import FavoriteMovieCard from '../../components/FavoriteMovieCard/FavoriteMovieCard';
import './ProfilePage.scss';

type ProfileTab = 'favorites' | 'settings';

interface UserProfile {
  email: string;
  name: string;
  surname: string;
}

const ProfilePage = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('favorites');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [profileRes, favsData] = await Promise.all([
        api.get<UserProfile>('/profile'),
        fetchFavoriteMovies()
      ]);
      setUser(profileRes.data);
      setFavorites(favsData);
    } catch (error) {
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleRemoveFavorite = async (movieId: number) => {
    try {
      await removeMovieFromFavorites(movieId);
      setFavorites(prev => prev.filter(m => m.id !== movieId));
    } catch (err) {
      console.error("Ошибка удаления:", err);
    }
  };

  const getInitials = (name?: string, surname?: string) => {
    const first = name?.charAt(0).toUpperCase() || '';
    const last = surname?.charAt(0).toUpperCase() || '';
    return first + last || '?';
  };

  if (isLoading) return <div className="loader">Загрузка...</div>;

  return (
    <div className="profile-container">
      <h1 className="profile-main-title">Мой аккаунт</h1>

      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <img className="tab-btn-icon" src="/favorite-icon-1.svg" alt="Иконка" />
          <span className="tab-btn-label">Избранные фильмы</span>
          <span className="tab-btn-label-mob">Избранное</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <img className="tab-btn-icon" src="/user-header.svg" alt="Иконка" />
          <span className="tab-btn-label">Настройка аккаунта</span>
          <span className="tab-btn-label-mob">Настройки</span>
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'favorites' && (
          <div className="favorites-grid">
            {favorites.map(movie => (
              <FavoriteMovieCard
                key={movie.id}
                movie={movie}
                onRemove={() => handleRemoveFavorite(movie.id)}
              />
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-user">
            <div className="settings-row">
              <div className="settings-avatar">
                {getInitials(user?.name, user?.surname)}
              </div>
              <div className="settings-info">
                <span className="settings-label">Имя Фамилия</span>
                <p className="settings-value">{user?.name} {user?.surname}</p>
              </div>
            </div>

            <div className="settings-row">
              <div className="settings-avatar">
                <svg className="settings-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 3C21.5523 3 22 3.44772 22 4V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V19H20V7.3L12 14.5L2 5.5V4C2 3.44772 2.44772 3 3 3H21ZM8 15V17H0V15H8ZM5 10V12H0V10H5ZM19.5659 5H4.43414L12 11.8093L19.5659 5Z" fill="currentColor" />
                </svg>
              </div>
              <div className="settings-info">
                <span className="settings-label">Электронная почта</span>
                <p className="settings-value">{user?.email}</p>
              </div>
            </div>

            <button className="logout-btn" onClick={onLogout}>Выйти из аккаунта</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;