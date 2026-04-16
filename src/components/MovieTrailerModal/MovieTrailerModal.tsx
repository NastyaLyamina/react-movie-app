import type { Movie } from '../../types/Movie';
import Modal from '../Modal/Modal';
import './MovieTrailerModal.scss';

interface MovieTrailerModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieTrailerModal = ({ movie, onClose }: MovieTrailerModalProps) => {
  const getYoutubeEmbedUrl = () => {
    const videoId = movie.trailerYoutubeId || movie.trailerUrl?.split('v=')[1]?.split('&')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : movie.trailerUrl;
  };

  return (
    <Modal onClose={onClose} variant="video">
      <div className="movie-trailer-content">
        <iframe
          className="trailer-video-frame"
          src={getYoutubeEmbedUrl()}
          title={`Трейлер фильма ${movie.title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </Modal>
  );
};

export default MovieTrailerModal;