export const getRatingColor = (rating: number): string => {
  if (rating >= 8) return '#A59400';
  if (rating >= 7) return '#308E21';
  if (rating >= 5) return '#777777';
  return '#FF4B4B';
};