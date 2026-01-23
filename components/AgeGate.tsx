'use client';

import { useState, useEffect } from 'react';
import styles from './AgeGate.module.css';

const AGE_GATE_KEY = 'pp_age_verified';
const EXPIRY_HOURS = 6;

export default function AgeGate() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(AGE_GATE_KEY);
    if (stored) {
      const { timestamp } = JSON.parse(stored);
      const hoursElapsed = (Date.now() - timestamp) / (1000 * 60 * 60);
      if (hoursElapsed < EXPIRY_HOURS) {
        return;
      }
    }
    setIsVisible(true);
  }, []);

  const handleConfirm = () => {
    localStorage.setItem(AGE_GATE_KEY, JSON.stringify({ timestamp: Date.now() }));
    setIsLeaving(true);
    setTimeout(() => setIsVisible(false), 400);
  };

  const handleDeny = () => {
    window.location.href = 'https://google.com';
  };

  if (!isVisible) return null;

  return (
    <div className={`${styles.overlay} ${isLeaving ? styles.leaving : ''}`}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Welcome to Peculiar Pastries</h2>
        <p className={styles.text}>
          This website contains information about cannabis products.
          You must be 21 or older to enter.
        </p>
        <p className={styles.question}>Are you 21 years of age or older?</p>
        <div className={styles.buttons}>
          <button onClick={handleConfirm} className={styles.confirm}>
            Yes, I'm 21+
          </button>
          <button onClick={handleDeny} className={styles.deny}>
            No
          </button>
        </div>
        <p className={styles.disclaimer}>
          This site is for educational purposes only. No cannabis products are sold here.
        </p>
      </div>
    </div>
  );
}
