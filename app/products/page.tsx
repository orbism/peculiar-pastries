'use client';

import { useState, useEffect } from 'react';
import { products as defaultProducts, Product } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { EditableText } from '@/components/cms/EditableText';
import { ProductEditor } from '@/components/cms/ProductEditor';
import { useCMS } from '@/lib/cms/hooks';
import styles from './page.module.css';

type ServingFilter = 'all' | 'single' | 'multi';

interface ProductPageContent {
  headline: string;
  body: string;
  whyTHCCBD: {
    title: string;
    body: string;
  };
}

export default function ProductsPage() {
  const { isEditing } = useCMS();
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [servingFilter, setServingFilter] = useState<ServingFilter>('all');
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [content, setContent] = useState<ProductPageContent>({
    headline: 'Peculiar Pastries are artisanal, small-batch infused cookies made to taste like real dessert.',
    body: `Handmade with quality ingredients and a home-baked feel, each cookie is crafted for flavor, texture, and consistency—because infused should still be delicious.

Every cookie is infused with a blend of THC + cannabis-derived full-spectrum CBD, designed to support a more balanced experience through what's often called the entourage effect—the idea that the plant's natural compounds work best together.

Whether you're looking to take the edge off the day, lighten the mood, or turn a good moment into a great one…

Peculiar Pastries — Bakes Life Better.`,
    whyTHCCBD: {
      title: 'Why THC + Full-Spectrum CBD?',
      body: `We infuse every cookie with THC + cannabis-derived full-spectrum CBD to create a more complete, balanced experience. Full-spectrum CBD means it comes from the cannabis plant (not hemp) and includes a broader range of naturally occurring compounds—often associated with the entourage effect, where the plant works best as a team.

In simple terms: it's the difference between a one-note edible and something that feels smoother, more layered, and more well-rounded.

Artisanal edibles—because infused should still be delicious.`,
    },
  });

  useEffect(() => {
    // Fetch CMS content and merge with defaults
    fetch('/api/cms/content?key=pages-products')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setContent((prev) => ({
            ...prev,
            ...data,
            whyTHCCBD: { ...prev.whyTHCCBD, ...data.whyTHCCBD },
          }));
        }
      })
      .catch(() => {});

    fetch('/api/cms/content?key=products')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) setProducts(data);
      })
      .catch(() => {});
  }, []);

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
          <EditableText
            value={content.headline}
            path="pages-products.headline"
            tag="p"
            className={styles.headline}
          />
          <EditableText
            value={content.body}
            path="pages-products.body"
            tag="div"
            multiline
            className={styles.bodyText}
          />
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

          <ProductEditor products={products} onUpdate={setProducts} />

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
          <EditableText
            value={content.whyTHCCBD?.title ?? ''}
            path="pages-products.whyTHCCBD.title"
            tag="h2"
            className={styles.sectionTitle}
          />
          <EditableText
            value={content.whyTHCCBD?.body ?? ''}
            path="pages-products.whyTHCCBD.body"
            tag="div"
            multiline
            className={styles.bodyText}
          />
        </div>
      </section>
    </div>
  );
}
