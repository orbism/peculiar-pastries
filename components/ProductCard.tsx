'use client';

import { Product } from '@/lib/products';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  view: 'list' | 'grid';
}

export default function ProductCard({ product, view }: ProductCardProps) {
  const flavorColor = product.flavor === 'chocolate-chip' ? '#8B4513' : '#FFB6C1';

  return (
    <article className={`${styles.card} ${styles[view]}`}>
      <div className={styles.imageContainer}>
        <div
          className={styles.placeholder}
          style={{ backgroundColor: flavorColor }}
        >
          <span className={styles.placeholderText}>
            {product.flavor === 'chocolate-chip' ? 'CC' : 'BC'}
            <br />
            {product.serving === 'single' ? 'Single' : 'Multi'}
          </span>
        </div>
      </div>

      <div className={styles.content}>
        <span className={styles.badge}>
          {product.serving === 'single' ? 'Single-Serve' : 'Multi-Serve'}
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
