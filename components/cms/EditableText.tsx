'use client';

import { useState, useEffect } from 'react';
import { useCMS } from '@/lib/cms/hooks';
import styles from './EditableText.module.css';

interface EditableTextProps {
  value: string;
  path: string;
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'div';
  multiline?: boolean;
  className?: string;
}

export function EditableText({
  value,
  path,
  tag: Tag = 'p',
  multiline = false,
  className,
}: EditableTextProps) {
  const { isEditing, setPendingChange, pendingChanges } = useCMS();
  const safeValue = value ?? '';
  const [localValue, setLocalValue] = useState(safeValue);

  useEffect(() => {
    setLocalValue(safeValue);
  }, [safeValue]);

  const displayValue = (pendingChanges[path] as string) ?? localValue ?? '';

  if (!isEditing) {
    if (multiline) {
      return (
        <Tag className={className}>
          {displayValue.split('\n\n').map((para, i) => (
            <span key={i}>
              {i > 0 && <><br /><br /></>}
              {para}
            </span>
          ))}
        </Tag>
      );
    }
    return <Tag className={className}>{displayValue}</Tag>;
  }

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    setPendingChange(path, newValue);
  };

  return (
    <div className={styles.wrapper}>
      {multiline ? (
        <textarea
          value={displayValue}
          onChange={(e) => handleChange(e.target.value)}
          className={`${className || ''} ${styles.textarea}`}
          rows={Math.max(3, displayValue.split('\n').length)}
        />
      ) : (
        <input
          type="text"
          value={displayValue}
          onChange={(e) => handleChange(e.target.value)}
          className={`${className || ''} ${styles.input}`}
        />
      )}
      <span className={styles.indicator}>Editing</span>
    </div>
  );
}
