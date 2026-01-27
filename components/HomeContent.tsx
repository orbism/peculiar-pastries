'use client';

import { useState } from 'react';
import ImageCarousel from '@/components/ImageCarousel';
import ContactForm from '@/components/ContactForm';
import { EditableText } from '@/components/cms/EditableText';
import { useCMS } from '@/lib/cms/hooks';
import styles from '@/app/page.module.css';

interface HomePageContent {
  introTitle: string;
  introCopy: string;
  carouselImages: string[];
  contactTitle: string;
  contactCopy: string;
}

export function HomeContent({ initialContent }: { initialContent: HomePageContent }) {
  const { isEditing } = useCMS();
  const [content] = useState(initialContent);

  return (
    <>
      <section id="intro" className={styles.intro}>
        <div className={styles.container}>
          <EditableText
            value={content.introTitle}
            path="pages-home.introTitle"
            tag="h2"
            className={styles.sectionTitle}
          />
          <EditableText
            value={content.introCopy}
            path="pages-home.introCopy"
            tag="p"
            multiline
            className={styles.introCopy}
          />
          <ImageCarousel images={content.carouselImages} />
          {isEditing && (
            <p className={styles.editHint}>
              (Carousel images can be managed via the content API)
            </p>
          )}
        </div>
      </section>

      <section id="contact" className={styles.contact}>
        <div className={styles.container}>
          <EditableText
            value={content.contactTitle}
            path="pages-home.contactTitle"
            tag="h2"
            className={styles.sectionTitle}
          />
          <EditableText
            value={content.contactCopy}
            path="pages-home.contactCopy"
            tag="p"
            className={styles.contactCopy}
          />
          <ContactForm />
        </div>
      </section>
    </>
  );
}
