import { HeroSection } from '@/components/promotions/HeroSection';
import { PremiumServices } from '@/components/home/PremiumServices';
import { PremiumWigs } from '@/components/home/PremiumWigs';
import { Philosophy } from '@/components/home/Philosophy';
import { BookCTA } from '@/components/home/BookCTA';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PremiumServices />
      <PremiumWigs />
      <Philosophy />
      <BookCTA />
    </>
  );
}
