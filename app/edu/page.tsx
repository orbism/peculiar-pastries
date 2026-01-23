import { eduContent } from '@/lib/content';
import styles from './page.module.css';

export const metadata = {
  title: 'Edibles 101 | Peculiar Pastries',
  description: 'Learn how to enjoy cannabis edibles responsibly. Dosage guide, timing, and tips.',
};

export default function EduPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Edibles 101</h1>
        <p className={styles.subtitle}>How to Enjoy Peculiar Pastries Responsibly</p>
      </section>

      <section className={styles.intro}>
        <div className={styles.container}>
          {eduContent.intro.split('\n\n').map((para, i) => (
            <p key={i} className={styles.text}>{para}</p>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{eduContent.whatAreEdibles.title}</h2>
          {eduContent.whatAreEdibles.body.split('\n\n').map((para, i) => (
            <p key={i} className={styles.text}>{para}</p>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.alt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{eduContent.timing.title}</h2>
          {eduContent.timing.body.split('\n\n').map((para, i) => (
            <p key={i} className={styles.text}>{para}</p>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{eduContent.goldenRule.title}</h2>
          <div className={styles.steps}>
            {eduContent.goldenRule.steps.map((step, i) => (
              <div key={i} className={styles.step}>
                <span className={styles.stepNumber}>{i + 1}</span>
                <div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.text}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.alt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{eduContent.dosage.title}</h2>
          <p className={styles.text}>{eduContent.dosage.body}</p>
          <div className={styles.servingCards}>
            {eduContent.dosage.servings.map((serving, i) => (
              <div key={i} className={styles.servingCard}>
                <h3 className={styles.servingType}>{serving.type}</h3>
                <p className={styles.servingSpec}><strong>THC:</strong> {serving.thc}</p>
                <p className={styles.servingSpec}><strong>CBD:</strong> {serving.cbd}</p>
              </div>
            ))}
          </div>
          <p className={styles.tip}>{eduContent.dosage.tip}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{eduContent.dosageChart.title}</h2>
          <p className={styles.text}>{eduContent.dosageChart.intro}</p>
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
                {eduContent.dosageChart.levels.map((level, i) => (
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
              {eduContent.dosageChart.cookieFit.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.alt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{eduContent.tips.title}</h2>
          <div className={styles.tipsList}>
            {eduContent.tips.items.map((tip, i) => (
              <div key={i} className={styles.tipItem}>
                <h3 className={styles.tipTitle}>{tip.title}</h3>
                <p className={styles.text}>{tip.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{eduContent.faq.title}</h2>
          <div className={styles.faq}>
            {eduContent.faq.items.map((item, i) => (
              <div key={i} className={styles.faqItem}>
                <h3 className={styles.faqQ}>{item.q}</h3>
                <p className={styles.text}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.alt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{eduContent.whyCBD.title}</h2>
          {eduContent.whyCBD.body.split('\n\n').map((para, i) => (
            <p key={i} className={styles.text}>{para}</p>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{eduContent.entourage.title}</h2>
          {eduContent.entourage.body.split('\n\n').map((para, i) => (
            <p key={i} className={styles.text}>{para}</p>
          ))}
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
    </div>
  );
}
