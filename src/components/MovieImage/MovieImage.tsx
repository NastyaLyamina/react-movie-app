import { useState, useEffect } from 'react';

interface MovieImageProps {
  src?: string;
  alt: string;
  className?: string;
}

const MovieImage = ({ src, alt, className }: MovieImageProps) => {
  const fallback = '/poster-placeholder.png';
  const [imgSrc, setImgSrc] = useState<string>(src || fallback);

  useEffect(() => {
    setImgSrc(src || fallback);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallback)}
    />
  );
};

export default MovieImage;