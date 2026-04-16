import { Link } from 'react-router-dom';
import type { Movie } from '../../types/Movie';
import MovieImage from '../MovieImage/MovieImage';
import './FavoriteMovieCard.scss'

interface Props {
  movie: Movie;
  onRemove: () => void;
}

const FavoriteMovieCard = ({ movie, onRemove }: Props) => {
  return (
    <div className="fav-card-wrapper">
      <button className="remove-fav-btn" onClick={onRemove}>
        <img className="close-icon" src="/close-icon.svg" alt="Иконка" />
      </button>
      <Link className="movie-card" to={`/movie/${movie.id}`} >
        <MovieImage
          src={movie.posterUrl}
          alt={movie.title}
        />
      </Link>
    </div>
  );
};

export default FavoriteMovieCard;