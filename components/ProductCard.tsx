'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/products';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  view: 'list' | 'grid';
  index?: number;
}

function getProductImages(flavor: string, serving: string): string[] {
  const prefix = flavor === 'chocolate-chip' ? 'cc' : 'bc';
  const type = serving === 'single' ? 'single' : 'multi';
  const count = serving === 'single' ? 3 : 2;

  return Array.from({ length: count }, (_, i) => `/yum/${prefix}_${type}_${i + 1}.jpeg`);
}

export default function ProductCard({ product, view, index = 0 }: ProductCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const images = getProductImages(product.flavor, product.serving);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }

    touchStartX.current = null;
  };

  return (
    <article
      className={`${styles.card} ${styles[view]}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className={styles.imageContainer}
        onClick={nextImage}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((src, i) => (
          <div
            key={src}
            className={`${styles.imageSlide} ${i === currentImage ? styles.active : ''}`}
          >
            <Image
              src={src}
              alt={`${product.name} - image ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className={styles.productImage}
            />
          </div>
        ))}
        <div className={styles.imageDots}>
          {images.map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i === currentImage ? styles.activeDot : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImage(i);
              }}
            />
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <span className={styles.badge}>
          {product.serving === 'single' ? 'Single-Serving' : 'Multi-Serving'}
        </span>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.tagline}>{product.tagline}</p>
        <p className={styles.description}>{product.description}</p>

        {product.details.map((detail, i) => (
          <p key={i} className={styles.detail}>{detail}</p>
        ))}

        <div className={styles.specs}>
          <div className={styles.spec}>
            <span className={styles.specLabel}>THC</span>
            <span className={styles.specValue}>{product.thc}</span>
          </div>
          <div className={styles.spec}>
            <span className={styles.specLabel}>CBD</span>
            <span className={styles.specValue}>{product.cbd}</span>
          </div>
          {product.calories && (
            <div className={styles.spec}>
              <span className={styles.specLabel}>Calories</span>
              <span className={styles.specValue}>{product.calories}</span>
            </div>
          )}
        </div>

        <p className={styles.labTested}>Lab-tested for quality and consistency</p>
      </div>
    </article>
  );
}
