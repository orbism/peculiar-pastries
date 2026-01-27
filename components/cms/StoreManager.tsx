'use client';

import { useState } from 'react';
import { useCMS } from '@/lib/cms/hooks';
import type { StoreLocation } from '@/lib/cms/types';
import styles from './StoreManager.module.css';

interface StoreManagerProps {
  stores: StoreLocation[];
  onUpdate: (stores: StoreLocation[]) => void;
}

export function StoreManager({ stores, onUpdate }: StoreManagerProps) {
  const { isAdmin, isEditing } = useCMS();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isAdmin || !isEditing) return null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/cms/stores', { method: 'POST', body: formData });
      const data = await res.json();

      if (res.ok) {
        setMessage(`Imported ${data.count} stores`);
        // Refresh stores
        const storesRes = await fetch('/api/cms/stores');
        const newStores = await storesRes.json();
        onUpdate(newStores);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch {
      setMessage('Upload failed');
    }

    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this store?')) return;
    await fetch(`/api/cms/stores?id=${id}`, { method: 'DELETE' });
    onUpdate(stores.filter((s) => s.id !== id));
  };

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h3>Manage Stores</h3>
        <label className={styles.uploadBtn}>
          <input type="file" accept=".csv" onChange={handleUpload} hidden disabled={uploading} />
          {uploading ? 'Uploading...' : 'Upload CSV'}
        </label>
      </div>

      {message && <p className={styles.message}>{message}</p>}

      <p className={styles.hint}>
        CSV format: name, address, city, state, zip, phone, website
      </p>

      {stores.length > 0 && (
        <ul className={styles.list}>
          {stores.map((store) => (
            <li key={store.id} className={styles.item}>
              <span className={styles.info}>
                <strong>{store.name}</strong>
                <span>{store.address}, {store.city}, {store.state} {store.zip}</span>
              </span>
              <button onClick={() => handleDelete(store.id)} className={styles.deleteBtn}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
