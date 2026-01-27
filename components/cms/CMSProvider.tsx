'use client';

import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface CMSContextType {
  isAdmin: boolean;
  isEditing: boolean;
  toggleEditing: () => void;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  pendingChanges: Record<string, unknown>;
  setPendingChange: (path: string, value: unknown) => void;
  saveAll: () => Promise<void>;
  isSaving: boolean;
}

export const CMSContext = createContext<CMSContextType | null>(null);

export function CMSProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, unknown>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/auth/check')
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.isAdmin))
      .catch(() => setIsAdmin(false));
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAdmin(false);
    setIsEditing(false);
    setPendingChanges({});
  }, []);

  const toggleEditing = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  const setPendingChange = useCallback((path: string, value: unknown) => {
    setPendingChanges((prev) => ({ ...prev, [path]: value }));
  }, []);

  const saveAll = useCallback(async () => {
    if (Object.keys(pendingChanges).length === 0) return;

    setIsSaving(true);

    // Group changes by content key (first part of path)
    const grouped: Record<string, Record<string, unknown>> = {};
    for (const [path, value] of Object.entries(pendingChanges)) {
      const [key, ...rest] = path.split('.');
      if (!grouped[key]) grouped[key] = {};

      // Set nested value
      let target = grouped[key];
      for (let i = 0; i < rest.length - 1; i++) {
        if (!target[rest[i]]) target[rest[i]] = {};
        target = target[rest[i]] as Record<string, unknown>;
      }
      if (rest.length > 0) {
        target[rest[rest.length - 1]] = value;
      } else {
        grouped[key] = value as Record<string, unknown>;
      }
    }

    // Save each content key
    for (const [key, data] of Object.entries(grouped)) {
      // First fetch existing content, then merge
      const existingRes = await fetch(`/api/cms/content?key=${key}`);
      let existing = {};
      if (existingRes.ok) {
        const json = await existingRes.json();
        if (json) existing = json;
      }

      const merged = deepMerge(existing, data);

      await fetch('/api/cms/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, data: merged }),
      });
    }

    setPendingChanges({});
    setIsSaving(false);

    // Refresh page to show new content
    window.location.reload();
  }, [pendingChanges]);

  return (
    <CMSContext.Provider
      value={{
        isAdmin,
        isEditing,
        toggleEditing,
        login,
        logout,
        pendingChanges,
        setPendingChange,
        saveAll,
        isSaving,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(
        (result[key] as Record<string, unknown>) || {},
        source[key] as Record<string, unknown>
      );
    } else {
      result[key] = source[key];
    }
  }
  return result;
}
