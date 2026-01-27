'use client';

import { useState } from 'react';
import { EditableText } from '@/components/cms/EditableText';
import { EditableImage } from '@/components/cms/EditableImage';
import { useCMS } from '@/lib/cms/hooks';
import styles from '@/app/about/page.module.css';

interface AboutPageContent {
  brandAbout: string;
  founderStory: string;
  founderImage?: string;
}

export function AboutContent({ initialContent }: { initialContent: AboutPageContent }) {
  const { isEditing } = useCMS();
  const [content] = useState(initialContent);

  return (
    <>
      <section className={styles.brand}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>The Brand</h2>
          <EditableText
            value={content.brandAbout}
            path="pages-about.brandAbout"
            tag="div"
            multiline
            className={styles.text}
          />
        </div>
      </section>

      <section className={styles.founder}>
        <div className={styles.container}>
          <div className={styles.founderGrid}>
            <div className={styles.founderImage}>
              {content.founderImage ? (
                <EditableImage
                  src={content.founderImage}
                  alt="Founder"
                  path="pages-about.founderImage"
                  width={400}
                  height={500}
                  className={styles.founderPhoto}
                />
              ) : (
                <div className={styles.placeholder}>
                  {isEditing ? (
                    <label className={styles.uploadPlaceholder}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append('file', file);
                          const res = await fetch('/api/upload/image', { method: 'POST', body: formData });
                          if (res.ok) {
                            const { url } = await res.json();
                            // Save to CMS - merge with current content to preserve existing values
                            await fetch('/api/cms/content', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                key: 'pages-about',
                                data: { ...content, founderImage: url }
                              })
                            });
                            window.location.reload();
                          }
                        }}
                        hidden
                      />
                      <span>Click to upload founder photo</span>
                    </label>
                  ) : (
                    <span>Founder Photo</span>
                  )}
                </div>
              )}
            </div>
            <div className={styles.founderContent}>
              <h2 className={styles.sectionTitle}>The Founder</h2>
              <EditableText
                value={content.founderStory}
                path="pages-about.founderStory"
                tag="div"
                multiline
                className={styles.text}
              />
              <p className={styles.tagline}>Peculiar Pastries — Bakes Life Better.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
