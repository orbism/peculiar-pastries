'use client';

import { useState, useEffect } from 'react';
import { useCMS } from '@/lib/cms/hooks';
import styles from './AdminBar.module.css';

export function AdminBar() {
  const { isAdmin, isEditing, toggleEditing, login, logout, pendingChanges, saveAll, isSaving } = useCMS();
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Hidden trigger: Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (!isAdmin) {
          setShowLogin(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(password);
    if (success) {
      setShowLogin(false);
      setPassword('');
    } else {
      setError('Invalid password');
    }
  };

  if (!isAdmin && !showLogin) {
    return null;
  }

  if (!isAdmin && showLogin) {
    return (
      <div className={styles.loginOverlay}>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <h3>Admin Login</h3>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
          />
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.loginActions}>
            <button type="submit">Login</button>
            <button type="button" onClick={() => setShowLogin(false)}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  const changeCount = Object.keys(pendingChanges).length;

  return (
    <div className={styles.bar}>
      <span className={styles.status}>Admin</span>
      <button
        onClick={toggleEditing}
        className={`${styles.btn} ${isEditing ? styles.active : ''}`}
      >
        {isEditing ? 'Stop Editing' : 'Edit Page'}
      </button>
      {changeCount > 0 && (
        <button onClick={saveAll} className={`${styles.btn} ${styles.save}`} disabled={isSaving}>
          {isSaving ? 'Saving...' : `Save (${changeCount})`}
        </button>
      )}
      <button onClick={logout} className={`${styles.btn} ${styles.logout}`}>
        Logout
      </button>
    </div>
  );
}
