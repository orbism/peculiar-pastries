'use client';

import { useState, useEffect } from 'react';
import { StoreList } from '@/components/StoreList';
import { StoreManager } from '@/components/cms/StoreManager';
import type { StoreLocation } from '@/lib/cms/types';
import styles from './page.module.css';

export default function StoresPage() {
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cms/stores')
      .then((res) => res.json())
      .then((data) => {
        setStores(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Find Our Cookies</h1>
        <p className={styles.subtitle}>Available at licensed NY dispensaries</p>
      </section>

      <section className={styles.content}>
        <StoreManager stores={stores} onUpdate={setStores} />
        {loading ? (
          <p className={styles.loading}>Loading stores...</p>
        ) : (
          <StoreList stores={stores} />
        )}
      </section>
    </div>
  );
}
