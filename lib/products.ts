export interface Product {
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

export const products: Product[] = [
  {
    id: 'cc-single',
    name: 'Single-Serving Chocolate Chip Cookie',
    tagline: 'A classic done the Peculiar way.',
    description: `Our Chocolate Chip cookie delivers that true home-baked feel with a texture that hits just right: a light crunch with a soft chew. The dough is buttery with a lightly caramelized sweetness, loaded with semi-sweet chocolate chips throughout for a rich, satisfying bite from start to finish.`,
    details: [
      'Infused with THC + cannabis-derived full-spectrum CBD for a smooth, well-rounded experience—flavor first, consistency always.',
    ],
    serving: 'single',
    flavor: 'chocolate-chip',
    thc: '10mg',
    cbd: '5mg full-spectrum',
    images: ['/yum/placeholder-cc-single.jpg'],
  },
  {
    id: 'cc-multi',
    name: 'Multi-Serving Chocolate Chip Cookie',
    tagline: 'The original classic—made to portion your way.',
    description: `Same buttery dough. Same semi-sweet chocolate. Same perfect balance of light crunch and soft chew—just in a multi-serving cookie for flexibility. Break it into portions, take it slow, or save it for later. It's a timeless chocolate chip cookie, crafted in small batches and infused with consistent potency.`,
    details: [
      'Infused with THC + cannabis-derived full-spectrum CBD to keep the experience balanced and dependable.',
      'Portion-friendly by design: 15 calories per serving.',
    ],
    serving: 'multi',
    flavor: 'chocolate-chip',
    thc: '100mg total (~8.3mg per serving)',
    cbd: '20mg full-spectrum total (~1.6mg per serving)',
    calories: '15 per serving',
    images: ['/yum/placeholder-cc-multi.jpg'],
  },
  {
    id: 'bc-single',
    name: 'Single-Serving Birthday Cake Cookie',
    tagline: 'A celebration in your mouth.',
    description: `Our Birthday Cake cookie is sweet, nostalgic, and straight-up fun. The dough is flavored with vanilla and almond extracts for that cake-batter vibe, loaded with white chocolate chips, and finished with colorful sprinkles for a playful, dessert-forward bite.`,
    details: [
      'Infused with THC + cannabis-derived full-spectrum CBD for a smoother, more well-rounded experience.',
    ],
    serving: 'single',
    flavor: 'birthday-cake',
    thc: '10mg',
    cbd: '5mg full-spectrum',
    images: ['/yum/placeholder-bc-single.jpg'],
  },
  {
    id: 'bc-multi',
    name: 'Multi-Serving Birthday Cake Cookie',
    tagline: 'Big birthday energy—ready when you are.',
    description: `All the sweet cake flavor, vanilla-almond richness, sprinkles, and white chocolate goodness—now in a multi-serving cookie you can portion out and enjoy at your own pace. Crafted in small batches and infused for consistent potency, it's built for flexibility without sacrificing flavor.`,
    details: [
      'Infused with THC + cannabis-derived full-spectrum CBD for balanced, consistent effects.',
      'Portion-friendly by design: 15 calories per serving.',
    ],
    serving: 'multi',
    flavor: 'birthday-cake',
    thc: '100mg total (~8.3mg per serving)',
    cbd: '20mg full-spectrum total (~1.6mg per serving)',
    calories: '15 per serving',
    images: ['/yum/placeholder-bc-multi.jpg'],
  },
];

export const productIntro = {
  headline: 'Peculiar Pastries are artisanal, small-batch infused cookies made to taste like real dessert.',
  body: `Handmade with quality ingredients and a home-baked feel, each cookie is crafted for flavor, texture, and consistency—because infused should still be delicious.

Every cookie is infused with a blend of THC + cannabis-derived full-spectrum CBD, designed to support a more balanced experience through what's often called the entourage effect—the idea that the plant's natural compounds work best together.

Whether you're looking to take the edge off the day, lighten the mood, or turn a good moment into a great one…

Peculiar Pastries — Bakes Life Better.`,
};

export const whyTHCCBD = {
  title: 'Why THC + Full-Spectrum CBD?',
  body: `We infuse every cookie with THC + cannabis-derived full-spectrum CBD to create a more complete, balanced experience. Full-spectrum CBD means it comes from the cannabis plant (not hemp) and includes a broader range of naturally occurring compounds—often associated with the entourage effect, where the plant works best as a team.

In simple terms: it's the difference between a one-note edible and something that feels smoother, more layered, and more well-rounded.

Artisanal edibles—because infused should still be delicious.`,
};
