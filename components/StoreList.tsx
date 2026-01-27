import type { StoreLocation } from '@/lib/cms/types';
import styles from './StoreList.module.css';

interface StoreListProps {
  stores: StoreLocation[];
}

export function StoreList({ stores }: StoreListProps) {
  if (stores.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Store locations coming soon.</p>
        <p className={styles.hint}>Check back as we expand our retail partnerships.</p>
      </div>
    );
  }

  // Group by city
  const byCity = stores.reduce(
    (acc, store) => {
      const city = store.city || 'Other';
      if (!acc[city]) acc[city] = [];
      acc[city].push(store);
      return acc;
    },
    {} as Record<string, StoreLocation[]>
  );

  const sortedCities = Object.keys(byCity).sort();

  return (
    <div className={styles.list}>
      {sortedCities.map((city) => (
        <div key={city} className={styles.cityGroup}>
          <h2 className={styles.cityName}>{city}</h2>
          <div className={styles.storeGrid}>
            {byCity[city].map((store) => (
              <div key={store.id} className={styles.storeCard}>
                <h3 className={styles.storeName}>{store.name}</h3>
                <p className={styles.address}>
                  {store.address}
                  <br />
                  {store.city}, {store.state} {store.zip}
                </p>
                {store.phone && <p className={styles.phone}>{store.phone}</p>}
                {store.website && (
                  <a
                    href={store.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    Visit Website
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
