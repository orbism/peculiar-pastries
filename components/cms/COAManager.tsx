'use client';

import { useState } from 'react';
import { useCMS } from '@/lib/cms/hooks';
import type { COAEntry } from '@/lib/cms/types';
import styles from './COAManager.module.css';

const PRODUCTS = [
  { id: 'cc-single', name: 'Chocolate Chip Single' },
  { id: 'cc-multi', name: 'Chocolate Chip Multi' },
  { id: 'bc-single', name: 'Birthday Cake Single' },
  { id: 'bc-multi', name: 'Birthday Cake Multi' },
];

interface COAManagerProps {
  coas: COAEntry[];
  onUpdate: (coas: COAEntry[]) => void;
}

export function COAManager({ coas, onUpdate }: COAManagerProps) {
  const { isAdmin, isEditing } = useCMS();
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    productId: 'cc-single',
    batchNumber: '',
    testDate: '',
    lab: '',
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  if (!isAdmin || !isEditing) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) return;

    setUploading(true);

    // Upload PDF
    const uploadForm = new FormData();
    uploadForm.append('file', pdfFile);
    const uploadRes = await fetch('/api/upload/pdf', { method: 'POST', body: uploadForm });
    const { url: pdfUrl } = await uploadRes.json();

    // Create COA entry
    const newCOA: COAEntry = {
      id: crypto.randomUUID(),
      productId: formData.productId,
      batchNumber: formData.batchNumber,
      testDate: formData.testDate,
      lab: formData.lab,
      pdfUrl,
    };

    await fetch('/api/cms/coas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCOA),
    });

    onUpdate([...coas, newCOA]);
    setIsAdding(false);
    setFormData({ productId: 'cc-single', batchNumber: '', testDate: '', lab: '' });
    setPdfFile(null);
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this COA?')) return;
    await fetch(`/api/cms/coas?id=${id}`, { method: 'DELETE' });
    onUpdate(coas.filter((c) => c.id !== id));
  };

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <h3>Manage COAs</h3>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className={styles.addBtn}>
            + Add COA
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Product</label>
            <select
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            >
              {PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Batch Number</label>
            <input
              type="text"
              value={formData.batchNumber}
              onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
              placeholder="e.g., BC-2024-001"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Test Date</label>
            <input
              type="date"
              value={formData.testDate}
              onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Testing Lab</label>
            <input
              type="text"
              value={formData.lab}
              onChange={(e) => setFormData({ ...formData, lab: e.target.value })}
              placeholder="Lab name"
              required
            />
          </div>

          <div className={styles.field}>
            <label>PDF File</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Add COA'}
            </button>
            <button type="button" onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        </form>
      )}

      {coas.length > 0 && (
        <ul className={styles.list}>
          {coas.map((coa) => (
            <li key={coa.id} className={styles.item}>
              <span className={styles.info}>
                <strong>{PRODUCTS.find((p) => p.id === coa.productId)?.name}</strong>
                <span>Batch: {coa.batchNumber}</span>
                <span>{coa.testDate}</span>
              </span>
              <button onClick={() => handleDelete(coa.id)} className={styles.deleteBtn}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
