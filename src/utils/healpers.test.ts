import { describe, it, expect } from 'vitest';
import { getRatingColor } from './helpers';

describe('getRatingColor', () => {
  it('должна возвращать золотой (#A59400) для рейтинга 8 и выше', () => {
    expect(getRatingColor(8)).toBe('#A59400');
    expect(getRatingColor(9.5)).toBe('#A59400');
  });

  it('должна возвращать зеленый (#308E21) для рейтинга от 7 до 7.9', () => {
    expect(getRatingColor(7)).toBe('#308E21');
    expect(getRatingColor(7.5)).toBe('#308E21');
  });

  it('должна возвращать серый (#777777) для рейтинга от 5 до 6.9', () => {
    expect(getRatingColor(5)).toBe('#777777');
    expect(getRatingColor(6.2)).toBe('#777777');
  });

  it('должна возвращать красный (#FF4B4B) для рейтинга ниже 5', () => {
    expect(getRatingColor(4.9)).toBe('#FF4B4B');
    expect(getRatingColor(2.0)).toBe('#FF4B4B');
  });
});