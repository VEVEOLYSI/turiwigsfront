import { HeroSection } from '@/components/promotions/HeroSection';
import { FeaturedProducts } from '@/components/products/FeaturedProducts';
import { CategoryStrip } from '@/components/products/CategoryStrip';
import { ServicesPreview } from '@/components/promotions/ServicesPreview';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryStrip />
      <FeaturedProducts />
      <ServicesPreview />
    </>
  );
}
