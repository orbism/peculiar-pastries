'use client';

import { useState } from 'react';
import { products, productIntro, whyTHCCBD } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

type ServingFilter = 'all' | 'single' | 'multi';

export default function ProductsPage() {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [servingFilter, setServingFilter] = useState<ServingFilter>('all');

  const filteredProducts = products.filter((product) => {
    if (servingFilter === 'all') return true;
    return product.serving === servingFilter;
  });

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Our Cookies</h1>
      </section>

      <section className={styles.intro}>
        <div className={styles.container}>
          <p className={styles.headline}>{productIntro.headline}</p>
          {productIntro.body.split('\n\n').map((para, i) => (
            <p key={i} className={styles.bodyText}>{para}</p>
          ))}
        </div>
      </section>

      <section className={styles.products}>
        <div className={styles.container}>
          <div className={styles.controls}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Serving:</span>
              <button
                className={`${styles.filterBtn} ${servingFilter === 'all' ? styles.active : ''}`}
                onClick={() => setServingFilter('all')}
              >
                All
              </button>
              <button
                className={`${styles.filterBtn} ${servingFilter === 'single' ? styles.active : ''}`}
                onClick={() => setServingFilter('single')}
              >
                Single
              </button>
              <button
                className={`${styles.filterBtn} ${servingFilter === 'multi' ? styles.active : ''}`}
                onClick={() => setServingFilter('multi')}
              >
                Multi
              </button>
            </div>

            <div className={styles.viewGroup}>
              <span className={styles.viewLabel}>View:</span>
              <button
                className={`${styles.viewBtn} ${view === 'list' ? styles.active : ''}`}
                onClick={() => setView('list')}
                aria-pressed={view === 'list'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="4" width="18" height="4" rx="1" />
                  <rect x="3" y="10" width="18" height="4" rx="1" />
                  <rect x="3" y="16" width="18" height="4" rx="1" />
                </svg>
                List
              </button>
              <button
                className={`${styles.viewBtn} ${view === 'grid' ? styles.active : ''}`}
                onClick={() => setView('grid')}
                aria-pressed={view === 'grid'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="8" height="8" rx="1" />
                  <rect x="13" y="3" width="8" height="8" rx="1" />
                  <rect x="3" y="13" width="8" height="8" rx="1" />
                  <rect x="13" y="13" width="8" height="8" rx="1" />
                </svg>
                Grid
              </button>
            </div>
          </div>

          <div className={`${styles.productList} ${styles[view]}`}>
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} view={view} index={index} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className={styles.noResults}>No products match this filter.</p>
          )}
        </div>
      </section>

      <section className={styles.whyCBD}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{whyTHCCBD.title}</h2>
          {whyTHCCBD.body.split('\n\n').map((para, i) => (
            <p key={i} className={styles.bodyText}>{para}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
