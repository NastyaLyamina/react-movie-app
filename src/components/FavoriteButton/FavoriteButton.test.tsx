import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FavoriteButton from './FavoriteButton';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../api/MovieService', () => ({
  fetchFavoriteMovies: vi.fn(() => Promise.resolve([])),
  addMovieToFavorites: vi.fn(() => Promise.resolve()),
  removeMovieFromFavorites: vi.fn(() => Promise.resolve()),
}));

describe('FavoriteButton logic', () => {
  const mockOpenAuth = vi.fn();

  it('должен вызывать onOpenAuth при клике, если пользователь не авторизован', () => {
    render(
      <FavoriteButton 
        movieId={1} 
        isAuthorized={false} 
        onOpenAuth={mockOpenAuth} 
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOpenAuth).toHaveBeenCalledTimes(1);
  });

  it('должен добавлять класс active, если фильм в избранном', async () => {
    const { fetchFavoriteMovies } = await import('../../api/MovieService');
    (fetchFavoriteMovies as any).mockResolvedValueOnce([{ id: 1 }]);

    render(
      <FavoriteButton 
        movieId={1} 
        isAuthorized={true} 
        onOpenAuth={mockOpenAuth} 
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button').classList.contains('active')).toBe(true);
    });
  });
});