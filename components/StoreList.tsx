'use client';

import { useState, useMemo } from 'react';
import type { StoreLocation } from '@/lib/cms/types';
import styles from './StoreList.module.css';

interface StoreListProps {
  stores: StoreLocation[];
}

function getMapUrl(store: StoreLocation): string {
  if (store.googleMapsLink) return store.googleMapsLink;
  const query = encodeURIComponent(`${store.address}, ${store.city}, ${store.state} ${store.zip}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function MapPinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={styles.pinIcon}
    >
      <path
        fillRule="evenodd"
        d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.003 3.5-4.697 3.5-8.327a8 8 0 10-16 0c0 3.63 1.556 6.326 3.5 8.327a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function StoreList({ stores }: StoreListProps) {
  const [cityFilter, setCityFilter] = useState('');

  const sorted = useMemo(
    () => [...stores].sort((a, b) => a.name.localeCompare(b.name)),
    [stores]
  );

  const cities = useMemo(
    () => Array.from(new Set(sorted.map((s) => s.city).filter(Boolean))).sort(),
    [sorted]
  );

  const filtered = useMemo(() => {
    if (!cityFilter) return sorted;
    return sorted.filter((s) => s.city === cityFilter);
  }, [sorted, cityFilter]);

  if (stores.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Store locations coming soon.</p>
        <p className={styles.hint}>Check back as we expand our retail partnerships.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className={styles.citySelect}
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        {cityFilter && (
          <button onClick={() => setCityFilter('')} className={styles.clearBtn}>
            Clear
          </button>
        )}
      </div>

      <ul className={styles.list}>
        {filtered.map((store) => {
          const mapUrl = getMapUrl(store);
          return (
            <li key={store.id} className={styles.row}>
              <div className={styles.info}>
                <span className={styles.storeName}>{store.name}</span>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.addressLink}
                >
                  {[store.address, store.city, `${store.state} ${store.zip}`.trim()].filter(Boolean).join(', ')}
                </a>
                <div className={styles.btnRow}>
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapsBtn}
                  >
                    View on Google Maps
                  </a>
                  {store.website && (
                    <a
                      href={store.website.startsWith('http') ? store.website : `https://${store.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.websiteLink}
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>

              {store.mapThumbUrl ? (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.thumbLink}
                  aria-label={`Open ${store.name} in Google Maps`}
                >
                  <img
                    src={store.mapThumbUrl}
                    alt=""
                    className={styles.thumb}
                    width={180}
                    height={108}
                  />
                </a>
              ) : (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.pinLink}
                  aria-label={`Open ${store.name} in Google Maps`}
                >
                  <MapPinIcon />
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
