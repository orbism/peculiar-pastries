import { getAboutPageContent } from '@/lib/cms/data';
import { AboutContent } from '@/components/AboutContent';
import styles from './page.module.css';

export const metadata = {
  title: 'About | Peculiar Pastries',
  description: 'The story behind Peculiar Pastries - Queens-born, small-batch cannabis cookies.',
};

export default async function AboutPage() {
  const content = await getAboutPageContent();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>About Us</h1>
      </section>

      <AboutContent initialContent={content} />
    </div>
  );
}
