import { founderStory, brandAbout } from '@/lib/content';
import styles from './page.module.css';

export const metadata = {
  title: 'About | Peculiar Pastries',
  description: 'The story behind Peculiar Pastries - Queens-born, small-batch cannabis cookies.',
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>About Us</h1>
      </section>

      <section className={styles.brand}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>The Brand</h2>
          {brandAbout.split('\n\n').map((para, i) => (
            <p key={i} className={styles.text}>{para}</p>
          ))}
        </div>
      </section>

      <section className={styles.founder}>
        <div className={styles.container}>
          <div className={styles.founderGrid}>
            <div className={styles.founderImage}>
              {/* TODO: Add founder photo */}
              <div className={styles.placeholder}>
                <span>Founder Photo</span>
              </div>
            </div>
            <div className={styles.founderContent}>
              <h2 className={styles.sectionTitle}>The Founder</h2>
              {founderStory.split('\n\n').map((para, i) => (
                <p key={i} className={styles.text}>{para}</p>
              ))}
              <p className={styles.tagline}>Peculiar Pastries — Bakes Life Better.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
