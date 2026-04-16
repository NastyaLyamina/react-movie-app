import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRandomMovie, fetchTopMovies } from '../../api/MovieService';
import { getRatingColor } from '../../utils/helpers';
import type { Movie } from '../../types/Movie';
import MovieTrailerModal from '../../components/MovieTrailerModal/MovieTrailerModal';
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton';
import MovieImage from '../../components/MovieImage/MovieImage';
import './MainPage.scss';

interface MainPageProps {
  userName?: string;
  onOpenAuth: () => void;
}

const MainPage = ({ userName, onOpenAuth }: MainPageProps) => {
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const refreshHeroMovie = async () => {
    try {
      const movie = await fetchRandomMovie();
      setRandomMovie(movie);
    } catch (error) {
      console.error("Ошибка при обновлении фильма:", error);
    }
  };

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [randomRes, topRes] = await Promise.all([
        fetchRandomMovie(),
        fetchTopMovies()
      ]);
      setRandomMovie(randomRes);
      setTopMovies(topRes.slice(0, 10));
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  if (isLoading) return <div className="loader">Загрузка Маруси...</div>;

  return (
    <div className="main-page">
      {randomMovie && (
        <section className="hero-section">
          {randomMovie && (
            <div className="hero-card">
              <div className="hero-content">
                <div className="hero-content-info">
                  <div className="hero-info-line">
                    <span
                      className="rating-badge"
                      style={{ backgroundColor: getRatingColor(randomMovie.tmdbRating) }}
                    >
                      <img className="hero-star-icon" src="/star-icon.svg" alt="Иконка" />
                      {randomMovie.tmdbRating.toFixed(1)}
                    </span>
                    <span>{randomMovie.releaseYear}</span>
                    <span>{randomMovie.genres[0]}</span>
                    <span>{randomMovie.runtime} мин</span>
                  </div>
                  <h1 className="hero-title">{randomMovie.title}</h1>
                  <p className="hero-description">{randomMovie.plot}</p>
                </div>
                <div className="hero-actions">
                  <button className="btn-trailer" onClick={() => setIsTrailerOpen(true)}>
                    Трейлер
                  </button>
                  <Link className="btn-about" to={`/movie/${randomMovie.id}`} >
                    О фильме
                  </Link>
                  <FavoriteButton
                    movieId={randomMovie.id}
                    isAuthorized={!!userName}
                    onOpenAuth={onOpenAuth}
                    variant="icon-only"
                  />
                  <button className="btn-update" onClick={refreshHeroMovie}>
                    <img className="update-icon" src="/update-icon.svg" alt="Иконка" />
                  </button>
                </div>
              </div>

              <div className="hero-content-right">
                <MovieImage
                  src={randomMovie.backdropUrl}
                  alt={randomMovie.title}
                  className="hero-movie-poster"
                />
              </div>
            </div>
          )}

          {isTrailerOpen && randomMovie && (
            <MovieTrailerModal
              movie={randomMovie}
              onClose={() => setIsTrailerOpen(false)}
            />
          )}
        </section>
      )}

      <section className="top-movies-section">
        <h2 className="section-title">Топ 10 фильмов</h2>
        <div className="top-movies-grid">
          {topMovies.map((movie, index) => (
            <div className="top-movie-card-wrapper" key={movie.id} >
              <span className="top-movie-number">{index + 1}</span>
              <Link className="top-movie-card" to={`/movie/${movie.id}`} >
                <MovieImage
                  src={movie.posterUrl}
                  alt={movie.title}
                />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainPage;