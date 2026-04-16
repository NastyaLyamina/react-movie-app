import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMoviesByGenre } from '../../api/MovieService';
import type { Movie } from '../../types/Movie';
import MovieImage from '../../components/MovieImage/MovieImage';
import './GenreDetailsPage.scss';

const GenreDetailsPage = () => {
  const { genreName } = useParams<{ genreName: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMovies = async (pageToLoad: number) => {
    if (!genreName || isLoading) return;

    setIsLoading(true);
    try {
      const data = await fetchMoviesByGenre(genreName, pageToLoad);

      const limitedData = data.slice(0, 10);

      if (limitedData.length < 10) {
        setHasMoreMovies(false);
      }

      setMovies(prev => (pageToLoad === 1 ? limitedData : [...prev, ...limitedData]));
      setCurrentPage(pageToLoad + 1);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMovies([]);
    setHasMoreMovies(true);
    loadMovies(1);
  }, [genreName]);

  const handleShowMore = () => {
    loadMovies(currentPage);
  };

  return (
    <div className="genre-details-container">
      <div className="back-link-wrapper">
        <Link className="back-link" to="/genres" >
          <img className="back-link-icon" src="/chevron-icon.svg" alt="Иконка" />
        </Link>
        <h1 className="back-link-title">
          {genreName ? genreName.charAt(0).toUpperCase() + genreName.slice(1) : ''}
        </h1>
      </div>

      <div className="movies-grid">
        {movies.map(movie => (
          <Link className="movie-card" to={`/movie/${movie.id}`} key={movie.id} >
            <MovieImage
              src={movie.posterUrl}
              alt={movie.title}
            />
          </Link>
        ))}
      </div>

      {hasMoreMovies && (
        <div className="pagination-wrapper">
          <button
            className="show-more-btn"
            onClick={handleShowMore}
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : 'Показать еще'}
          </button>
        </div>
      )}
    </div>
  );
};

export default GenreDetailsPage;