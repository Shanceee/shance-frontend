import {
  HeaderSection,
  HeroSection,
  FeaturesSection,
  FAQSection,
  FooterSection,
  ScrollToTopSection,
  AnimatedTagsSection,
} from '@/components/landing';
import { ProcessSteps } from '@/components/ui';

// Эта страница будет статически сгенерирована (SSG)
export const dynamic = 'force-static';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#232323] text-white relative no-horizontal-scroll">
      <AnimatedTagsSection />
      <HeaderSection />
      <HeroSection />
      <ProcessSteps />
      <FeaturesSection />
      <FAQSection />
      <FooterSection />
      <ScrollToTopSection />
    </main>
  );
}
