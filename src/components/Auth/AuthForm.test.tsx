import { render, screen, fireEvent } from '@testing-library/react';
import AuthForm from './AuthForm';
import { expect, it, describe, vi } from 'vitest';

describe('AuthForm Component', () => {
  const mockOnSuccess = vi.fn();

  it('должен отображать форму входа по умолчанию', () => {
    render(<AuthForm onSuccess={mockOnSuccess} />);

    expect(screen.getByText('Войти')).toBeDefined();
    expect(screen.queryByPlaceholderText('Имя')).toBeNull();
  });

  it('должен переключаться на форму регистрации', () => {
    render(<AuthForm onSuccess={mockOnSuccess} />);

    const toggleBtn = screen.getByText('Регистрация');
    fireEvent.click(toggleBtn);

    expect(screen.getByText('Регистрация')).toBeDefined();
    expect(screen.getByPlaceholderText('Имя')).toBeDefined();
  });

  it('должен подсвечивать ошибки при отправке пустой формы', () => {
    render(<AuthForm onSuccess={mockOnSuccess} />);

    const submitBtn = screen.getByText('Войти');
    fireEvent.click(submitBtn);

    const emailWrapper = screen.getByPlaceholderText('Электронная почта').closest('.input-wrapper');
    expect(emailWrapper?.classList.contains('error')).toBe(true);
  });
});