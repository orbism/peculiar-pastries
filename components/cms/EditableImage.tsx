'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCMS } from '@/lib/cms/hooks';
import styles from './EditableImage.module.css';

interface EditableImageProps {
  src: string;
  alt: string;
  path: string;
  width: number;
  height: number;
  className?: string;
}

export function EditableImage({ src, alt, path, width, height, className }: EditableImageProps) {
  const { isEditing, setPendingChange, pendingChanges } = useCMS();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(src);

  const displaySrc = (pendingChanges[path] as string) ?? previewUrl;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload/image', { method: 'POST', body: formData });
      if (res.ok) {
        const { url } = await res.json();
        setPreviewUrl(url);
        setPendingChange(path, url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }

    setIsUploading(false);
  };

  return (
    <div className={`${styles.wrapper} ${isEditing ? styles.editable : ''}`}>
      <Image
        src={displaySrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
      {isEditing && (
        <label className={styles.overlay}>
          <input type="file" accept="image/*" onChange={handleFileChange} hidden />
          {isUploading ? 'Uploading...' : 'Click to replace'}
        </label>
      )}
    </div>
  );
}
