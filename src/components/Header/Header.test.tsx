import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { describe, it, expect, vi } from 'vitest';

describe('Header Component', () => {
  const mockOnOpenAuth = vi.fn();

  const renderHeader = (userName?: string) => render(
    <BrowserRouter>
      <Header onOpenAuth={mockOnOpenAuth} userName={userName} />
    </BrowserRouter>
  );

  it('должен корректно форматировать и отображать имя пользователя', () => {
    renderHeader('иван иванов');
    expect(screen.getByText('Иван Иванов')).toBeDefined();
  });

  it('должен отображать кнопку "Войти", если userName не передан', () => {
    renderHeader(undefined);
    expect(screen.getByText(/войти/i)).toBeDefined();
  });

  it('должен открывать мобильный поиск при клике на иконку поиска', () => {
    renderHeader();

    const toggleBtn = screen.getByRole('button');
    fireEvent.click(toggleBtn);

    const input = screen.getByPlaceholderText('Поиск');
    expect(input).toBeDefined();
  });

  it('должен очищать поле ввода при клике на кнопку очистки', async () => {
    renderHeader();

    const input = screen.getByPlaceholderText('Поиск') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Matrix' } });
    expect(input.value).toBe('Matrix');

    const clearBtn = screen.getByLabelText('Очистить поиск');
    fireEvent.click(clearBtn);
    expect(input.value).toBe('');
  });
});