import { storageGetJson } from './storage';
import { products as defaultProducts, productIntro, whyTHCCBD, Product } from '@/lib/products';
import { founderStory, brandAbout, eduContent } from '@/lib/content';
import type { COAEntry, StoreLocation, AboutPageContent, ProductPageContent } from './types';

function deepMerge<T extends Record<string, unknown>>(defaults: T, overrides: Partial<T> | null): T {
  if (!overrides) return defaults;

  const result = { ...defaults } as Record<string, unknown>;

  for (const key of Object.keys(overrides)) {
    const defaultVal = defaults[key as keyof T];
    const overrideVal = overrides[key as keyof T];

    if (
      overrideVal !== undefined &&
      overrideVal !== null &&
      typeof overrideVal === 'object' &&
      !Array.isArray(overrideVal) &&
      typeof defaultVal === 'object' &&
      !Array.isArray(defaultVal) &&
      defaultVal !== null
    ) {
      // Recursively merge objects
      result[key] = deepMerge(
        defaultVal as Record<string, unknown>,
        overrideVal as Record<string, unknown>
      );
    } else if (overrideVal !== undefined) {
      result[key] = overrideVal;
    }
  }

  return result as T;
}

async function fetchWithMerge<T extends Record<string, unknown>>(key: string, defaults: T): Promise<T> {
  const data = await storageGetJson<Partial<T>>(key);
  return deepMerge(defaults, data);
}

async function fetchWithFallback<T>(key: string, fallback: T): Promise<T> {
  const data = await storageGetJson<T>(key);
  return data ?? fallback;
}

export async function getProducts(): Promise<Product[]> {
  return fetchWithFallback('content/products.json', defaultProducts);
}

export async function getProductPageContent(): Promise<ProductPageContent> {
  return fetchWithMerge('content/pages-products.json', {
    headline: productIntro.headline,
    body: productIntro.body,
    whyTHCCBD: whyTHCCBD,
  });
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  return fetchWithMerge('content/pages-about.json', {
    brandAbout,
    founderStory,
  });
}

export async function getHomePageContent() {
  return fetchWithMerge('content/pages-home.json', {
    introTitle: 'Small-Batch. Handmade. Actually Delicious.',
    introCopy: `Peculiar Pastries are artisanal cannabis-infused cookies crafted in Queens, NY.
Every cookie is infused with THC + cannabis-derived full-spectrum CBD for a
smoother, more balanced experience. Because infused should still be delicious.`,
    carouselImages: ['/carousel/bc_party.jpg', '/carousel/cc_party.jpg', '/carousel/multi_party.jpg'],
    contactTitle: 'Get In Touch',
    contactCopy: 'Retailers, dispensaries, or just curious? Drop us a line.',
  });
}

export async function getEduPageContent() {
  return fetchWithMerge('content/pages-edu.json', eduContent);
}

export async function getCOAs(): Promise<COAEntry[]> {
  return fetchWithFallback('content/coas.json', []);
}

export async function getStores(): Promise<StoreLocation[]> {
  return fetchWithFallback('content/stores.json', []);
}
