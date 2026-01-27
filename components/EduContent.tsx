'use client';

import { EditableText } from '@/components/cms/EditableText';
import styles from '@/app/edu/page.module.css';

interface EduContentProps {
  content: {
    intro: string;
    whatAreEdibles: { title: string; body: string };
    timing: { title: string; body: string };
    goldenRule: { title: string; steps: { title: string; body: string }[] };
    dosage: {
      title: string;
      body: string;
      servings: { type: string; thc: string; cbd: string }[];
      tip: string;
    };
    dosageChart: {
      title: string;
      intro: string;
      levels: { dose: string; level: string; feeling: string; bestFor: string }[];
      cookieFit: string[];
    };
    tips: { title: string; items: { title: string; body: string }[] };
    faq: { title: string; items: { q: string; a: string }[] };
    whyCBD: { title: string; body: string };
    entourage: { title: string; body: string };
  };
}

export function EduContent({ content }: EduContentProps) {
  return (
    <>
      <section className={styles.intro}>
        <div className={styles.container}>
          <EditableText
            value={content.intro}
            path="pages-edu.intro"
            tag="div"
            multiline
            className={styles.text}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <EditableText
            value={content.whatAreEdibles.title}
            path="pages-edu.whatAreEdibles.title"
            tag="h2"
            className={styles.sectionTitle}
          />
          <EditableText
            value={content.whatAreEdibles.body}
            path="pages-edu.whatAreEdibles.body"
            tag="div"
            multiline
            className={styles.text}
          />
        </div>
      </section>

      <section className={`${styles.section} ${styles.alt}`}>
        <div className={styles.container}>
          <EditableText
            value={content.timing.title}
            path="pages-edu.timing.title"
            tag="h2"
            className={styles.sectionTitle}
          />
          <EditableText
            value={content.timing.body}
            path="pages-edu.timing.body"
            tag="div"
            multiline
            className={styles.text}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <EditableText
            value={content.goldenRule.title}
            path="pages-edu.goldenRule.title"
            tag="h2"
            className={styles.sectionTitle}
          />
          <div className={styles.steps}>
            {content.goldenRule.steps.map((step, i) => (
              <div key={i} className={styles.step}>
                <span className={styles.stepNumber}>{i + 1}</span>
                <div>
                  <EditableText
                    value={step.title}
                    path={`pages-edu.goldenRule.steps.${i}.title`}
                    tag="h3"
                    className={styles.stepTitle}
                  />
                  <EditableText
                    value={step.body}
                    path={`pages-edu.goldenRule.steps.${i}.body`}
                    tag="p"
                    multiline
                    className={styles.text}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.alt}`}>
        <div className={styles.container}>
          <EditableText
            value={content.dosage.title}
            path="pages-edu.dosage.title"
            tag="h2"
            className={styles.sectionTitle}
          />
          <EditableText
            value={content.dosage.body}
            path="pages-edu.dosage.body"
            tag="p"
            className={styles.text}
          />
          <div className={styles.servingCards}>
            {content.dosage.servings.map((serving, i) => (
              <div key={i} className={styles.servingCard}>
                <h3 className={styles.servingType}>{serving.type}</h3>
                <p className={styles.servingSpec}><strong>THC:</strong> {serving.thc}</p>
                <p className={styles.servingSpec}><strong>CBD:</strong> {serving.cbd}</p>
              </div>
            ))}
          </div>
          <EditableText
            value={content.dosage.tip}
            path="pages-edu.dosage.tip"
            tag="p"
            className={styles.tip}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <EditableText
            value={content.dosageChart.title}
            path="pages-edu.dosageChart.title"
            tag="h2"
            className={styles.sectionTitle}
          />
          <EditableText
            value={content.dosageChart.intro}
            path="pages-edu.dosageChart.intro"
            tag="p"
            className={styles.text}
          />
          <div className={styles.chartWrapper}>
            <table className={styles.chart}>
              <thead>
                <tr>
                  <th>THC Dose</th>
                  <th>Level</th>
                  <th>What It's Like</th>
                  <th>Best For</th>
                </tr>
              </thead>
              <tbody>
                {content.dosageChart.levels.map((level, i) => (
                  <tr key={i}>
                    <td>{level.dose}</td>
                    <td>{level.level}</td>
                    <td>{level.feeling}</td>
                    <td>{level.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.cookieFit}>
            <h3>Where our cookies fit:</h3>
            <ul>
              {content.dosageChart.cookieFit.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.alt}`}>
        <div className={styles.container}>
          <EditableText
            value={content.tips.title}
            path="pages-edu.tips.title"
            tag="h2"
            className={styles.sectionTitle}
          />
          <div className={styles.tipsList}>
            {content.tips.items.map((tip, i) => (
              <div key={i} className={styles.tipItem}>
                <EditableText
                  value={tip.title}
                  path={`pages-edu.tips.items.${i}.title`}
                  tag="h3"
                  className={styles.tipTitle}
                />
                <EditableText
                  value={tip.body}
                  path={`pages-edu.tips.items.${i}.body`}
                  tag="p"
                  className={styles.text}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <EditableText
            value={content.faq.title}
            path="pages-edu.faq.title"
            tag="h2"
            className={styles.sectionTitle}
          />
          <div className={styles.faq}>
            {content.faq.items.map((item, i) => (
              <div key={i} className={styles.faqItem}>
                <EditableText
                  value={item.q}
                  path={`pages-edu.faq.items.${i}.q`}
                  tag="h3"
                  className={styles.faqQ}
                />
                <EditableText
                  value={item.a}
                  path={`pages-edu.faq.items.${i}.a`}
                  tag="p"
                  className={styles.text}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.alt}`}>
        <div className={styles.container}>
          <EditableText
            value={content.whyCBD.title}
            path="pages-edu.whyCBD.title"
            tag="h2"
            className={styles.sectionTitle}
          />
          <EditableText
            value={content.whyCBD.body}
            path="pages-edu.whyCBD.body"
            tag="div"
            multiline
            className={styles.text}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <EditableText
            value={content.entourage.title}
            path="pages-edu.entourage.title"
            tag="h2"
            className={styles.sectionTitle}
          />
          <EditableText
            value={content.entourage.body}
            path="pages-edu.entourage.body"
            tag="div"
            multiline
            className={styles.text}
          />
        </div>
      </section>

      <section className={styles.philosophy}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Philosophy</h2>
          <p className={styles.text}>Peculiar Pastries is built on a simple idea:</p>
          <p className={styles.highlight}>Edibles should taste like real dessert.</p>
          <p className={styles.text}>
            And the experience should feel consistent, intentional, and well-rounded.
          </p>
          <p className={styles.text}>
            That's why we bake with craft, obsess over detail, and infuse every cookie with
            THC + cannabis-derived full-spectrum CBD.
          </p>
          <p className={styles.tagline}>Peculiar Pastries — Bakes Life Better.</p>
        </div>
      </section>
    </>
  );
}
