'use client';

import { useState } from 'react';
import { useCMS } from '@/lib/cms/hooks';
import type { Product } from '@/lib/products';
import styles from './ProductEditor.module.css';

interface ProductEditorProps {
  products: Product[];
  onUpdate: (products: Product[]) => void;
}

export function ProductEditor({ products, onUpdate }: ProductEditorProps) {
  const { isAdmin, isEditing } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!isAdmin || !isEditing) return null;

  const editingProduct = editingId ? products.find((p) => p.id === editingId) : null;

  const handleSave = async (updated: Product) => {
    setSaving(true);
    const newProducts = products.map((p) => (p.id === updated.id ? updated : p));

    await fetch('/api/cms/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'products', data: newProducts }),
    });

    onUpdate(newProducts);
    setEditingId(null);
    setSaving(false);
  };

  return (
    <div className={styles.editor}>
      <h3 className={styles.title}>Edit Products</h3>
      <div className={styles.productList}>
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => setEditingId(product.id)}
            className={`${styles.productBtn} ${editingId === product.id ? styles.active : ''}`}
          >
            {product.name}
          </button>
        ))}
      </div>

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => setEditingId(null)}
          saving={saving}
        />
      )}
    </div>
  );
}

function ProductForm({
  product,
  onSave,
  onCancel,
  saving,
}: {
  product: Product;
  onSave: (p: Product) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(product);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className={styles.field}>
        <label>Tagline</label>
        <input
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
        />
      </div>

      <div className={styles.field}>
        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
        />
      </div>

      <div className={styles.field}>
        <label>Details (one per line)</label>
        <textarea
          value={form.details.join('\n')}
          onChange={(e) => setForm({ ...form, details: e.target.value.split('\n').filter(Boolean) })}
          rows={3}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>THC</label>
          <input
            value={form.thc}
            onChange={(e) => setForm({ ...form, thc: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label>CBD</label>
          <input
            value={form.cbd}
            onChange={(e) => setForm({ ...form, cbd: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label>Calories</label>
          <input
            value={form.calories || ''}
            onChange={(e) => setForm({ ...form, calories: e.target.value || undefined })}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? 'Saving...' : 'Save Product'}
        </button>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>
          Cancel
        </button>
      </div>
    </form>
  );
}
