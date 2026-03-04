export interface CMSProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  details: string[];
  serving: 'single' | 'multi';
  flavor: 'chocolate-chip' | 'birthday-cake';
  thc: string;
  cbd: string;
  calories?: string;
  images: string[];
}

export interface ProductPageContent {
  headline: string;
  body: string;
  whyTHCCBD: {
    title: string;
    body: string;
  };
}

export interface AboutPageContent {
  brandAbout: string;
  founderStory: string;
  founderImage?: string;
}

export interface HomePageContent {
  introTitle: string;
  introCopy: string;
  carouselImages: string[];
  contactTitle: string;
  contactCopy: string;
}

export interface EduSection {
  title?: string;
  body: string;
}

export interface DosageLevel {
  level: string;
  thc: string;
  effects: string;
  ideal: string;
}

export interface EduPageContent {
  intro: string;
  whatAreEdibles: EduSection;
  timing: EduSection;
  goldenRule: {
    title: string;
    subtitle: string;
    steps: string[];
  };
  dosage: EduSection & {
    servingNote: string;
    chart: DosageLevel[];
  };
  tips: {
    title: string;
    items: string[];
  };
  faq: {
    title: string;
    items: { q: string; a: string }[];
  };
  whyTHCCBD: EduSection;
  entourageEffect: EduSection;
}

export interface COAEntry {
  id: string;
  productId: string;
  batchNumber: string;
  testDate: string;
  pdfUrl: string;
  lab: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  website?: string;
  licenseNumber?: string;
  googleMapsLink?: string;
  mapThumbUrl?: string;
}
