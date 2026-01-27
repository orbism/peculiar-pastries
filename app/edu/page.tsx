import { getEduPageContent } from '@/lib/cms/data';
import { EduContent } from '@/components/EduContent';
import styles from './page.module.css';

export const metadata = {
  title: 'Edibles 101 | Peculiar Pastries',
  description: 'Learn how to enjoy cannabis edibles responsibly. Dosage guide, timing, and tips.',
};

export default async function EduPage() {
  const content = await getEduPageContent();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Edibles 101</h1>
        <p className={styles.subtitle}>How to Enjoy Peculiar Pastries Responsibly</p>
      </section>

      <EduContent content={content} />
    </div>
  );
}
