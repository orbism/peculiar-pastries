'use client';

import { useState, useEffect } from 'react';
import { COAList } from '@/components/COAList';
import { COAManager } from '@/components/cms/COAManager';
import type { COAEntry } from '@/lib/cms/types';
import styles from './page.module.css';

export default function COAsPage() {
  const [coas, setCoas] = useState<COAEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cms/coas')
      .then((res) => res.json())
      .then((data) => {
        setCoas(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Certificates of Analysis</h1>
        <p className={styles.subtitle}>Lab-tested for your peace of mind</p>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <COAManager coas={coas} onUpdate={setCoas} />
          {loading ? (
            <p className={styles.loading}>Loading COAs...</p>
          ) : (
            <COAList coas={coas} />
          )}
        </div>
      </section>
    </div>
  );
}
