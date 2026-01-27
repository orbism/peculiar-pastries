'use client';

import { useContext } from 'react';
import { CMSContext } from '@/components/cms/CMSProvider';

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within CMSProvider');
  }
  return context;
}
