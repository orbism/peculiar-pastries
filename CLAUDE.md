# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Peculiar Pastries - Next.js website for a licensed NY cannabis cookie brand. Educational/informational site (no sales on-site). Products sold at licensed dispensaries only.

## Brand
- Name: **Peculiar Pastries** (not "Uncle Paulie's")
- Tagline: "Bakes Life Better"

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- CSS Modules (no Tailwind - keep it lean)
- No heavy animation libraries - use CSS transitions/animations

## Brand Colors
- `#7C2F1F` - Wordmark brown (primary)
- `#F2C7DA` - Pink background
- `#EEEABD` - Butter/cream accent
- `#FFFFFF` - White
- `#000000` - Black text

## Brand Fonts
- Wordmark: Custom (use logo PNG images)
- Headings: Eames Century Modern Bold (available in /public/fonts/)
- Body: Eames Century Modern Medium or system sans-serif fallback
- Font files: Bold, Medium, Thin variants in /public/fonts/

## Design Principles
- "Bubbly" aesthetic: soft edges, rounded corners
- Subtle animations only - smooth, elegant tweens
- Fast loading - minimize packages
- Mobile-first, responsive
- 21+ age gate required on entry

## Key Legal Requirements
- Footer: "Peculiar Pastries products are manufactured and distributed by High Moon Food Group, a licensed New York State cannabis processor and distributor."
- Disclaimer: Educational purposes only, no cannabis sold on-site
- Age verification (21+) popup on first visit

## Content Sources (in /resources)
- Product copy: `PP_ Product Page draft.pdf`
- Founder story: `PP_About_founder.pdf`
- Brand about: `PP_Brand_About.pdf`
- .EDU content: `PP_EDU.FULL.pdf`
- Layout reference: `pp_website layout .pdf`

## Deferred Items
- `BAG DESIGN PDF'S/` - packaging assets for later use
- Store locator feature
- Merch store integration (external Wix link for now)
- Backend CMS (TBD)
