import styles from './page.module.css';

export const metadata = {
  title: 'COAs | Peculiar Pastries',
  description: 'Certificates of Analysis for Peculiar Pastries products.',
};

export default function COAsPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Certificates of Analysis</h1>
        <p className={styles.subtitle}>Lab-tested for your peace of mind</p>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.placeholder}>
            <div className={styles.icon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className={styles.placeholderTitle}>COAs Coming Soon</h2>
            <p className={styles.placeholderText}>
              We're building our library of Certificates of Analysis. As each batch is produced
              and tested, COAs will be made available here for full transparency.
            </p>
            <p className={styles.placeholderText}>
              Every Peculiar Pastries product is lab-tested for potency, purity, and consistency.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
