import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { searchMoviesByTitle } from '../../api/MovieService';
import { getRatingColor } from '../../utils/helpers';
import type { Movie } from '../../types/Movie';
import MovieImage from '../MovieImage/MovieImage';
import './Header.scss';

interface HeaderProps {
  onOpenAuth: () => void;
  userName?: string;
}

const Header = ({ onOpenAuth, userName }: HeaderProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isMobileSearchVisible) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileSearchVisible]);

  const handleOutsideClick = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setIsSearchOpen(false);
      setIsMobileSearchVisible(false);
    }
  };

  const performSearch = async (searchQuery: string) => {
    try {
      const data = await searchMoviesByTitle(searchQuery);
      setResults(data.slice(0, 5));
      setIsSearchOpen(true);
    } catch (error) {
      console.error('Ошибка при поиске:', error);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsSearchOpen(false);
      return;
    }

    const searchTimer = setTimeout(() => performSearch(query), 400);
    return () => clearTimeout(searchTimer);
  }, [query]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleInputFocus = () => {
    if (query.length >= 2) {
      setIsSearchOpen(true);
    }
  };

  const handleResultClick = () => {
    setIsSearchOpen(false);
    setQuery('');
    setIsMobileSearchVisible(false);
  };

  const handleClearSearch = () => {
    if (query.length > 0) {
      setQuery('');
      setResults([]);
      setIsSearchOpen(false);
      inputRef.current?.focus();
    } else {
      setIsMobileSearchVisible(false);
    }
  };

  const formatName = (name: string) =>
    name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

  return (
    <header className="header">
      <div className={`header-left ${isMobileSearchVisible ? 'mobile-hidden' : ''}`}>
        <Link className="logo" to="/" >
          <img className="marusia-icon" src="/marusia-icon.svg" alt="Маруся" />
        </Link>
      </div>

      <nav className="nav-menu">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <span className="nav-text">Главная</span>
        </NavLink>
        <NavLink to="/genres" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <span className="nav-text">Жанры</span>
          <img className="nav-icon" src="/genres-header.svg" alt="Жанры" />
        </NavLink>

        <div className="search-container" ref={searchRef}>
          {isMobileSearchVisible && (
            <div
              className="search-overlay-mobile"
              onClick={() => setIsMobileSearchVisible(false)}
            />
          )}

          {!isMobileSearchVisible && (
            <button className="mobile-search-toggle" onClick={() => setIsMobileSearchVisible(true)}>
              <img src="/search-header.svg" alt="Поиск" />
            </button>
          )}

          <div className={`search-field ${isMobileSearchVisible ? 'active' : ''}`}>
            <img className="search-icon" src="/search-icon.svg" alt="Иконка" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Поиск"
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />

            {query && (
              <button
                className="search-clear-btn"
                onClick={handleClearSearch}
                type="button"
                aria-label="Очистить поиск"
              >
                <img src="/close-icon-search.svg" alt="Иконка" />
              </button>
            )}
          </div>

          {isSearchOpen && results.length > 0 && (
            <ul className="search-dropdown">
              {results.map((movie) => (
                <li key={movie.id} className="search-item-wrapper" onClick={handleResultClick}>
                  <Link to={`/movie/${movie.id}`} className="search-item">
                    <MovieImage
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="search-item-poster"
                    />
                    <div className="search-item-content">
                      <div className="search-item-meta">
                        <span
                          className="search-item-rating"
                          style={{ backgroundColor: getRatingColor(movie.tmdbRating) }}
                        >
                          <img className="star-icon" src="/star-icon.svg" alt="" />
                          {movie.tmdbRating.toFixed(1)}
                        </span>
                        <span>{movie.releaseYear}</span>
                        <span>{movie.genres[0]}</span>
                        <span>{movie.runtime} мин</span>
                      </div>
                      <h3 className="search-item-title">{movie.title}</h3>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      <div className="header-right">
        {userName ? (
          <Link to="/account" className="user-name">
            <span className="nav-text">{formatName(userName)}</span>
            <img className="nav-icon" src="/user-header.svg" alt="Аккаунт" />
          </Link>
        ) : (
          <button className="login-btn" onClick={onOpenAuth}>
            <span className="nav-text">Войти</span>
            <img className="nav-icon" src="/user-header.svg" alt="Аккаунт" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;