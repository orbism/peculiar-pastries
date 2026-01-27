'use client';

import type { COAEntry } from '@/lib/cms/types';
import { EditableText } from '@/components/cms/EditableText';
import { useCMS } from '@/lib/cms/hooks';
import styles from './COAList.module.css';

const PRODUCTS: Record<string, string> = {
  'cc-single': 'Chocolate Chip Single',
  'cc-multi': 'Chocolate Chip Multi',
  'bc-single': 'Birthday Cake Single',
  'bc-multi': 'Birthday Cake Multi',
};

interface COAListProps {
  coas: COAEntry[];
  emptyContent?: {
    title: string;
    text1: string;
    text2: string;
  };
}

const defaultEmptyContent = {
  title: 'COAs Coming Soon',
  text1: "We're building our library of Certificates of Analysis. As each batch is produced and tested, COAs will be made available here for full transparency.",
  text2: 'Every Peculiar Pastries product is lab-tested for potency, purity, and consistency.',
};

export function COAList({ coas, emptyContent = defaultEmptyContent }: COAListProps) {
  const { isEditing } = useCMS();

  if (coas.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.icon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <EditableText
          value={emptyContent.title}
          path="pages-coas.emptyTitle"
          tag="h2"
          className={styles.emptyTitle}
        />
        <EditableText
          value={emptyContent.text1}
          path="pages-coas.emptyText1"
          tag="p"
          multiline
          className={styles.emptyText}
        />
        <EditableText
          value={emptyContent.text2}
          path="pages-coas.emptyText2"
          tag="p"
          multiline
          className={styles.emptyText}
        />
        {isEditing && (
          <p className={styles.editHint}>Use the COA Manager above to add certificates</p>
        )}
      </div>
    );
  }

  // Group by product
  const byProduct = coas.reduce(
    (acc, coa) => {
      if (!acc[coa.productId]) acc[coa.productId] = [];
      acc[coa.productId].push(coa);
      return acc;
    },
    {} as Record<string, COAEntry[]>
  );

  return (
    <div className={styles.list}>
      {Object.entries(byProduct).map(([productId, productCoas]) => (
        <div key={productId} className={styles.productGroup}>
          <h2 className={styles.productName}>{PRODUCTS[productId] || productId}</h2>
          <div className={styles.coaGrid}>
            {productCoas
              .sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime())
              .map((coa) => (
                <a
                  key={coa.id}
                  href={coa.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.coaCard}
                >
                  <span className={styles.batch}>{coa.batchNumber}</span>
                  <span className={styles.date}>
                    {new Date(coa.testDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className={styles.lab}>{coa.lab}</span>
                  <span className={styles.download}>View PDF</span>
                </a>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
