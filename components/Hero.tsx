import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <Image
          src="/images/logo.png"
          alt="Peculiar Pastries"
          width={400}
          height={160}
          priority
          className={styles.logo}
        />
        <p className={styles.tagline}>Bakes Life Better</p>
        <div className={styles.buttons}>
          <a href="#intro" className={styles.button}>
            Treat Yourself
          </a>
          <Link href="/products" className={`${styles.button} ${styles.secondary}`}>
            Explore the Batch
          </Link>
        </div>
      </div>
    </section>
  );
}
