import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieById } from '../../api/MovieService';
import { getRatingColor } from '../../utils/helpers';
import MovieTrailerModal from '../../components/MovieTrailerModal/MovieTrailerModal';
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton';
import MovieImage from '../../components/MovieImage/MovieImage';
import type { Movie } from '../../types/Movie';
import './MoviePage.scss';

interface MoviePageProps {
  userName?: string;
  onOpenAuth: () => void;
}

const MoviePage = ({ userName, onOpenAuth }: MoviePageProps) => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const loadMovieData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const movieData = await fetchMovieById(id);
      setMovie(movieData);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMovieData();
  }, [id, userName]);

  if (isLoading) return <div className="loader">Загрузка фильма...</div>;
  if (!movie) return <div className="loader">Фильм не найден</div>;

  return (
    <div className="movie-page-container">
      <section className="movie-hero-section">
        <div className="movie-content-left">
          <div className="movie-info">
            <div className="movie-meta">
              <span className="rating-badge"
                style={{ backgroundColor: getRatingColor(movie.tmdbRating) }}>
                <img className="hero-star-icon" src="/star-icon.svg" alt="Иконка" />
                {movie.tmdbRating.toFixed(1)}
              </span>
              <span>{movie.releaseYear}</span>
              <span>{movie.genres.join(', ')}</span>
              <span>{movie.runtime} мин</span>
            </div>
            <h1 className="movie-title">{movie.title}</h1>
            <p className="movie-description">{movie.plot}</p>
          </div>

          <div className="movie-actions">
            <button className="btn-trailer" onClick={() => setIsTrailerOpen(true)}>
              Трейлер
            </button>

            <FavoriteButton
              movieId={movie.id}
              isAuthorized={!!userName}
              onOpenAuth={onOpenAuth}
              variant="default"
            />
          </div>
        </div>

        <div className="movie-content-right">
          <MovieImage
            src={movie.backdropUrl}
            alt={movie.title}
            className="main-movie-poster"
          />
        </div>
      </section>

      <section className="movie-details-extra">
        <h2 className="extra-title">О фильме</h2>
        <div className="extra-list">
          <div className="extra-row">
            <span className="extra-label">Язык оригинала</span>
            <span className="extra-value">{movie.language
              ? movie.language.charAt(0).toUpperCase() + movie.language.slice(1).toLowerCase()
              : 'Не указан'}</span>
          </div>
          <div className="extra-row">
            <span className="extra-label">Бюджет</span>
            <span className="extra-value">{movie.budget ? `${Number(movie.budget).toLocaleString()} $` : 'Неизвестен'}</span>
          </div>
          <div className="extra-row">
            <span className="extra-label">Выручка</span>
            <span className="extra-value">{movie.revenue ? `${Number(movie.revenue).toLocaleString()} $` : 'Неизвестна'}</span>
          </div>
          <div className="extra-row">
            <span className="extra-label">Режиссёр</span>
            <span className="extra-value">{movie.director || 'Не указан'}</span>
          </div>
          <div className="extra-row">
            <span className="extra-label">Продакшен</span>
            <span className="extra-value">{movie.production || 'Не указан'}</span>
          </div>
          <div className="extra-row">
            <span className="extra-label">Награды</span>
            <span className="extra-value">{movie.awardsSummary || 'Нет наград'}</span>
          </div>
        </div>
      </section>

      {isTrailerOpen && movie && (
        <MovieTrailerModal
          movie={movie}
          onClose={() => setIsTrailerOpen(false)}
        />
      )}
    </div>
  );
};

export default MoviePage;