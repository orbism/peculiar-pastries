import Hero from '@/components/Hero';
import ImageCarousel from '@/components/ImageCarousel';
import ContactForm from '@/components/ContactForm';
import styles from './page.module.css';

const placeholderImages = [
  '/yum/placeholder-1.jpg',
  '/yum/placeholder-2.jpg',
  '/yum/placeholder-3.jpg',
  '/yum/placeholder-4.jpg',
];

export default function Home() {
  return (
    <>
      <Hero />

      <section id="intro" className={styles.intro}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Small-Batch. Handmade. Actually Delicious.</h2>
          <p className={styles.introCopy}>
            Peculiar Pastries are artisanal cannabis-infused cookies crafted in Queens, NY.
            Every cookie is infused with THC + cannabis-derived full-spectrum CBD for a
            smoother, more balanced experience. Because infused should still be delicious.
          </p>
          <ImageCarousel images={placeholderImages} />
        </div>
      </section>

      <section id="contact" className={styles.contact}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Get In Touch</h2>
          <p className={styles.contactCopy}>
            Retailers, dispensaries, or just curious? Drop us a line.
          </p>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
