import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FavoriteMovieCard from './FavoriteMovieCard';
import { describe, it, expect, vi } from 'vitest';

describe('FavoriteMovieCard', () => {
  const mockMovie = {
    id: 123,
    title: 'Тестовый фильм',
    posterUrl: '/test-poster.jpg',
  } as any;

  const mockOnRemove = vi.fn();

  const renderComponent = () => render(
    <BrowserRouter>
      <FavoriteMovieCard movie={mockMovie} onRemove={mockOnRemove} />
    </BrowserRouter>
  );

  it('должен рендерить заголовок и постер фильма', () => {
    renderComponent();

    const img = screen.getByAltText(mockMovie.title);
    expect(img).toBeDefined();
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe(`/movie/${mockMovie.id}`);
  });

  it('должен вызывать onRemove при клике на кнопку удаления', () => {
    renderComponent();

    const removeBtn = document.querySelector('.remove-fav-btn') as HTMLElement;
    fireEvent.click(removeBtn);
    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });
});