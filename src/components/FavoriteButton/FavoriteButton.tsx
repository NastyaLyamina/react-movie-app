import { useState, useEffect, useCallback } from 'react';
import {
  fetchFavoriteMovies,
  addMovieToFavorites,
  removeMovieFromFavorites
} from '../../api/MovieService';
import './FavoriteButton.scss';

interface FavoriteButtonProps {
  movieId: number;
  isAuthorized: boolean;
  onOpenAuth: () => void;
  variant?: 'default' | 'icon-only';
}

const FavoriteButton = ({ movieId, isAuthorized, onOpenAuth }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkFavoriteStatus = useCallback(async () => {
    if (!isAuthorized) return;
    try {
      const favorites = await fetchFavoriteMovies();
      setIsFavorite(favorites.some(movie => movie.id === movieId));
    } catch (error) {
      console.error("Ошибка при проверке избранного:", error);
    }
  }, [movieId, isAuthorized]);

  useEffect(() => {
    checkFavoriteStatus();
  }, [checkFavoriteStatus]);

  const toggleFavorite = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (!isAuthorized) return onOpenAuth();
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isFavorite) {
        await removeMovieFromFavorites(movieId);
      } else {
        await addMovieToFavorites(movieId);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Ошибка при обновлении избранного:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`btn-favorite ${isFavorite ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
      onClick={toggleFavorite}
      type="button"
      disabled={isLoading}
      aria-label="Избранное"
    >
      <div className="icon-wrapper">
        <img className="icon-outline" src="/favorite-icon-1.svg" alt="Иконка" />
        <img className="icon-filled" src="/favorite-icon-2.svg" alt="Иконка" />
      </div>
    </button>
  );
};

export default FavoriteButton;