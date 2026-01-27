import Hero from '@/components/Hero';
import { HomeContent } from '@/components/HomeContent';
import { getHomePageContent } from '@/lib/cms/data';
import { getCarouselImages } from '@/lib/carousel';

export default async function Home() {
  const content = await getHomePageContent();
  const carouselImages = getCarouselImages();

  // Use CMS images if set, otherwise use auto-detected images
  const images = content.carouselImages?.length > 0
    ? content.carouselImages
    : carouselImages;

  return (
    <>
      <Hero />
      <HomeContent initialContent={{ ...content, carouselImages: images }} />
    </>
  );
}
