import { render, screen, fireEvent } from '@testing-library/react';
import MovieImage from './MovieImage';

describe('MovieImage Component', () => {
  const fallback = '/poster-placeholder.png';

  it('отображает переданный src, если всё в порядке', () => {
    render(<MovieImage src="/test-movie.jpg" alt="Тест" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/test-movie.jpg');
  });

  it('подставляет заглушку, если произошла ошибка загрузки (onError)', () => {
    render(<MovieImage src="/broken-link.jpg" alt="Тест" />);
    const img = screen.getByRole('img');

    fireEvent.error(img);

    expect(img).toHaveAttribute('src', fallback);
  });

  it('сразу ставит заглушку, если src не передан', () => {
    render(<MovieImage alt="Тест" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', fallback);
  });
});