'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './ImageCarousel.module.css';

interface ImageCarouselProps {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
}

export default function ImageCarousel({
  images,
  autoPlay = true,
  interval = 4000,
}: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const goTo = (index: number) => {
    setCurrent(index);
  };

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, next, images.length]);

  if (images.length === 0) return null;

  return (
    <div className={styles.carousel}>
      <div className={styles.track}>
        {images.map((src, index) => (
          <div
            key={src}
            className={`${styles.slide} ${index === current ? styles.active : ''}`}
          >
            <div
              className={styles.placeholder}
              style={{ backgroundColor: `hsl(${index * 60}, 70%, 85%)` }}
            >
              <span>Image {index + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            className={`${styles.arrow} ${styles.prev}`}
            onClick={prev}
            aria-label="Previous image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            className={`${styles.arrow} ${styles.next}`}
            onClick={next}
            aria-label="Next image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <div className={styles.dots}>
            {images.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === current ? styles.active : ''}`}
                onClick={() => goTo(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
