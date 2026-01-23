# Project Scratchpad

## Current Phase: MVP Complete - Ready for Review

---

## Pages Built

### Homepage (/)
- [x] Age gate popup (21+, localStorage, 6hr expiry)
- [x] Full-page hero banner (pink bg, logo, "Bakes Life Better", dual CTAs)
- [x] Intro section (#intro) with image carousel
- [x] Contact section (#contact) with form
- [x] Footer with legal text

### Navigation
- [x] Sticky nav, shrinks on scroll
- [x] Hamburger on mobile
- [x] Links: Home, Products, Merch (placeholder), About, .EDU, COAs, Contact

### Products (/products)
- [x] Intro blurb at top
- [x] Toggle: list view / grid view
- [x] 4 products with placeholder images
- [x] "Why THC + Full-Spectrum CBD?" section

### About (/about)
- [x] Founder story
- [x] Brand story
- [x] Placeholder for founder photo

### .EDU (/edu)
- [x] Full Edibles 101 content
- [x] Dosage chart
- [x] Tips, FAQ, all sections

### COAs (/coas)
- [x] Placeholder page

---

## TODOs (Need from User)
- [ ] Founder photo in chef gear
- [ ] Instagram URL
- [ ] Facebook URL
- [ ] Merch store URL (Wix)
- [ ] COA PDFs when ready
- [ ] Product image mapping/optimization

## Deferred / Later
- [ ] Store locator feature
- [ ] Backend CMS integration
- [ ] Bag design assets (`BAG DESIGN PDF'S/`)
- [ ] QR code linking strategy
- [ ] Real product images in carousels

---

## Decisions Made
- Brand name: Peculiar Pastries (removed "Uncle Paulie's")
- CTA copy: "Treat Yourself" + "Explore the Batch"
- Fonts: Eames Century Modern (Bold, Medium, Thin)
- Logo: PNG image
- Age gate: localStorage, 6hr expiry
- Placeholders for: founder photo, social links, merch link, product images

## Image Strategy
- Product images: Colored placeholders for now
- User will provide optimized, renamed images later
- Images go in /public/yum/

---

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- CSS Modules (zero external CSS libs)
- No animation libraries (pure CSS)

---

## File Tree (Actual)
```
/Uncle Paulies
├── CLAUDE.md
├── README.md
├── SCRATCHPAD.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── /app
│   ├── layout.tsx
│   ├── page.tsx
│   ├── page.module.css
│   ├── globals.css
│   ├── /products
│   │   ├── page.tsx
│   │   └── page.module.css
│   ├── /about
│   │   ├── page.tsx
│   │   └── page.module.css
│   ├── /edu
│   │   ├── page.tsx
│   │   └── page.module.css
│   └── /coas
│       ├── page.tsx
│       └── page.module.css
├── /components
│   ├── Nav.tsx + Nav.module.css
│   ├── Footer.tsx + Footer.module.css
│   ├── AgeGate.tsx + AgeGate.module.css
│   ├── Hero.tsx + Hero.module.css
│   ├── ImageCarousel.tsx + ImageCarousel.module.css
│   ├── ContactForm.tsx + ContactForm.module.css
│   └── ProductCard.tsx + ProductCard.module.css
├── /lib
│   ├── products.ts
│   └── content.ts
├── /public
│   ├── /fonts (Eames Century Modern .ttf files)
│   ├── /images (logo.png, logo-with-bg.png, logo-with-bg.svg)
│   └── /yum (empty - awaiting product photos)
├── /fonts (source font files)
└── /resources (source PDFs - not deployed)
```

---

## Commands
```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
