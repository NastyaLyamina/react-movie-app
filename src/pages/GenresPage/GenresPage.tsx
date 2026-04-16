import { useEffect, useState } from 'react';
import { fetchGenres, fetchMoviesByGenre } from '../../api/MovieService';
import { Link } from 'react-router-dom';
import './GenresPage.scss';

interface GenreCard {
  name: string;
  id: string;
  image: string;
}

const GenresPage = () => {
  const [genres, setGenres] = useState<GenreCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadGenresData = async () => {
    setIsLoading(true);
    try {
      const rawGenres = await fetchGenres();

      const formattedGenres = await Promise.all(
        rawGenres.map(async (genreName) => {
          try {
            const movies = await fetchMoviesByGenre(genreName);
            const poster = movies.length > 0 ? movies[0].backdropUrl : '/assets/genres/default.jpg';

            return {
              id: genreName,
              name: genreName.charAt(0).toUpperCase() + genreName.slice(1).replace('-', ' '),
              image: poster
            };
          } catch (e) {
            return {
              id: genreName,
              name: genreName,
              image: '/assets/genres/default.jpg'
            };
          }
        })
      );

      setGenres(formattedGenres);
    } catch (error) {
      console.error("Ошибка при загрузке жанров:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGenresData();
  }, []);

  if (isLoading) return <div className="loader">Загрузка жанров...</div>;

  return (
    <div className="genres-container">
      <h1 className="genres-title">Жанры фильмов</h1>

      <div className="genres-grid">
        {genres.map((genre) => (
          <Link
            to={`/genres/${genre.id}`}
            key={genre.id}
            className="genre-card"
            style={{ backgroundImage: `url(${genre.image})` }}
          >
            <span className="genre-name">{genre.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GenresPage;