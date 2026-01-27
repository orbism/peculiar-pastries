import { readdirSync, existsSync } from 'fs';
import path from 'path';

const CAROUSEL_DIR = path.join(process.cwd(), 'public', 'carousel');

export function getCarouselImages(): string[] {
  if (!existsSync(CAROUSEL_DIR)) {
    return [];
  }

  const files = readdirSync(CAROUSEL_DIR);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

  return files
    .filter((file) => imageExtensions.includes(path.extname(file).toLowerCase()))
    .sort()
    .map((file) => `/carousel/${file}`);
}
