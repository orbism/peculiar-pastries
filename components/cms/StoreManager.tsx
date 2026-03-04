'use client';

import { useState, useCallback } from 'react';
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
  const [replaceAll, setReplaceAll] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [dedupeResult, setDedupeResult] = useState<{ duplicateGroups: unknown[]; totalDuplicates: number } | null>(null);
  const [generatingThumbs, setGeneratingThumbs] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (replaceAll && stores.length > 0) {
      if (!confirm(`Replace all ${stores.length} existing stores with CSV data?`)) {
        e.target.value = '';
        return;
      }
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('replaceAll', String(replaceAll));

    try {
      const res = await fetch('/api/cms/stores', { method: 'POST', body: formData });
      const data = await res.json();

      if (res.ok) {
        setMessage(`Imported: ${data.added} added, ${data.updated} updated (${data.count} total)`);
        setMessageType('success');
        const storesRes = await fetch('/api/cms/stores');
        const newStores = await storesRes.json();
        onUpdate(newStores);
        setSelectedIds(new Set());
      } else {
        setMessage(`Error: ${data.error}`);
        setMessageType('error');
      }
    } catch {
      setMessage('Upload failed');
      setMessageType('error');
    }

    setUploading(false);
    e.target.value = '';
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Remove ${selectedIds.size} store${selectedIds.size > 1 ? 's' : ''}?`)) return;

    const res = await fetch('/api/cms/stores', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [...selectedIds] }),
    });

    if (res.ok) {
      const remaining = stores.filter((s) => !selectedIds.has(s.id));
      onUpdate(remaining);
      setSelectedIds(new Set());
      setLastClickedIndex(null);
    } else {
      setMessage('Delete failed');
      setMessageType('error');
    }
  };

  const handleCheckDupes = async () => {
    const res = await fetch('/api/cms/stores/dedupe');
    if (res.ok) {
      const data = await res.json();
      setDedupeResult(data);
      if (data.totalDuplicates === 0) {
        setMessage('No duplicates found.');
        setMessageType('success');
      } else {
        setMessage(`Found ${data.totalDuplicates} duplicate(s) in ${data.duplicateGroups.length} group(s).`);
        setMessageType('error');
      }
    }
  };

  const handleGenerateThumbs = async () => {
    setGeneratingThumbs(true);
    setMessage('Generating map thumbnails...');
    setMessageType('success');
    try {
      const res = await fetch('/api/map-thumb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Generated ${data.generated} map thumbnail${data.generated !== 1 ? 's' : ''}${data.skipped > 0 ? ` (${data.skipped} already had thumbs)` : ''}${data.errors?.length > 0 ? ` — ${data.errors.length} error(s)` : ''}`);
        setMessageType(data.errors?.length > 0 ? 'error' : 'success');
        const storesRes = await fetch('/api/cms/stores');
        const newStores = await storesRes.json();
        onUpdate(newStores);
      } else {
        setMessage(`Error: ${data.error}`);
        setMessageType('error');
      }
    } catch {
      setMessage('Failed to generate thumbnails');
      setMessageType('error');
    }
    setGeneratingThumbs(false);
  };

  const handleRemoveDupes = async () => {
    if (!confirm('Remove all duplicate stores (keeping first occurrence)?')) return;
    const res = await fetch('/api/cms/stores/dedupe', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setMessage(`Removed ${data.removed} duplicate(s). ${data.kept} stores remain.`);
      setMessageType('success');
      const storesRes = await fetch('/api/cms/stores');
      const newStores = await storesRes.json();
      onUpdate(newStores);
      setSelectedIds(new Set());
      setDedupeResult(null);
    }
  };

  const handleCheckboxClick = useCallback(
    (e: React.MouseEvent<HTMLInputElement>, store: StoreLocation, index: number) => {
      const isChecked = (e.target as HTMLInputElement).checked;

      if (e.shiftKey && lastClickedIndex !== null) {
        // Shift-click: select range
        const start = Math.min(lastClickedIndex, index);
        const end = Math.max(lastClickedIndex, index);
        const rangeIds = stores.slice(start, end + 1).map((s) => s.id);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          for (const id of rangeIds) next.add(id);
          return next;
        });
      } else {
        // Normal click or cmd/ctrl click (checkbox handles toggle natively)
        setSelectedIds((prev) => {
          const next = new Set(prev);
          if (isChecked) {
            next.add(store.id);
          } else {
            next.delete(store.id);
          }
          return next;
        });
        setLastClickedIndex(index);
      }
    },
    [lastClickedIndex, stores]
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(stores.map((s) => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const allSelected = stores.length > 0 && selectedIds.size === stores.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < stores.length;

  if (!isAdmin || !isEditing) return null;

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h3>Manage Stores</h3>
        <div className={styles.headerActions}>
          <label className={styles.replaceToggle}>
            <input
              type="checkbox"
              checked={replaceAll}
              onChange={(e) => setReplaceAll(e.target.checked)}
            />
            Replace all
          </label>
          <label className={styles.uploadBtn}>
            <input type="file" accept=".csv" onChange={handleUpload} hidden disabled={uploading} />
            {uploading ? 'Uploading...' : 'Upload CSV'}
          </label>
          {stores.length > 0 && (
            <>
              <button onClick={handleCheckDupes} className={styles.actionBtn}>
                Check Dupes
              </button>
              <button
                onClick={handleGenerateThumbs}
                className={styles.actionBtn}
                disabled={generatingThumbs}
              >
                {generatingThumbs ? 'Generating...' : 'Generate Map Thumbs'}
              </button>
            </>
          )}
          {dedupeResult && dedupeResult.totalDuplicates > 0 && (
            <button onClick={handleRemoveDupes} className={styles.dedupeBtn}>
              Remove Dupes
            </button>
          )}
        </div>
      </div>

      {message && <p className={`${styles.message} ${styles[messageType]}`}>{message}</p>}

      <p className={styles.hint}>
        CSV: Dispensary Name · Street Address · City · State · ZIP · Website · License # · Google Maps Link
        {replaceAll && <strong className={styles.replaceWarning}> — Replace All mode: existing stores will be wiped on upload</strong>}
      </p>

      {stores.length > 0 && (
        <>
          <div className={styles.toolbar}>
            <label className={styles.selectAllLabel}>
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => { if (el) el.indeterminate = someSelected; }}
                onChange={handleSelectAll}
              />
              Select All
            </label>
            {selectedIds.size > 0 && (
              <button onClick={handleBulkDelete} className={styles.deleteBtn}>
                Delete Selected ({selectedIds.size})
              </button>
            )}
          </div>

          <ul className={styles.list}>
            {stores.map((store, index) => (
              <li key={store.id} className={`${styles.item} ${selectedIds.has(store.id) ? styles.selected : ''}`}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(store.id)}
                    onClick={(e) => handleCheckboxClick(e, store, index)}
                    onChange={() => {}}
                  />
                </label>
                <span className={styles.info}>
                  <strong>{store.name}</strong>
                  <span>{store.address}, {store.city}, {store.state} {store.zip}</span>
                  {store.licenseNumber && <span className={styles.license}>{store.licenseNumber}</span>}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
