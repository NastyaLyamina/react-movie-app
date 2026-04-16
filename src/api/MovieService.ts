import { api } from './instance';
import type { Movie } from '../types/Movie';

export const fetchRandomMovie = async (): Promise<Movie> => {
  const response = await api.get<Movie>('movie/random');
  return response.data;
};

export const fetchTopMovies = async (): Promise<Movie[]> => {
  const response = await api.get<Movie[]>('movie/top10');
  return response.data;
};

export const fetchGenres = async (): Promise<string[]> => {
  const response = await api.get<string[]>('movie/genres');
  return response.data;
};

export const fetchMoviesByGenre = async (genre: string, page: number = 1): Promise<Movie[]> => {
  const response = await api.get<Movie[]>('movie', {
    params: { genre, page, limit: 10 }
  });
  return response.data;
};

export const fetchMovieById = async (movieId: string | number): Promise<Movie> => {
  const response = await api.get<Movie>(`movie/${movieId}`);
  return response.data;
};

export const searchMoviesByTitle = async (title: string): Promise<Movie[]> => {
  const response = await api.get<Movie[]>('movie', { params: { title } });
  return response.data;
};

export const fetchFavoriteMovies = async (): Promise<Movie[]> => {
  const response = await api.get<Movie[]>('favorites');
  return response.data;
};

export const addMovieToFavorites = async (movieId: string | number): Promise<void> => {
  await api.post('favorites', { id: String(movieId) });
};

export const removeMovieFromFavorites = async (movieId: string | number): Promise<void> => {
  await api.delete(`favorites/${movieId}`);
};