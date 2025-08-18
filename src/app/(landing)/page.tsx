import {
  FeaturesSection,
  FAQSection,
  FooterSection,
  ScrollToTopSection,
} from '@/modules/landing/start-page/components';
import { ProcessSteps, AboutSection } from '@/components/ui';

// Эта страница будет статически сгенерирована (SSG)
export const dynamic = 'force-static';

export default function HomePage() {
  return (
    <main className="text-white relative no-horizontal-scroll">
      <ProcessSteps />
      <AboutSection />
      <FeaturesSection />
      <FAQSection />
      <FooterSection />
      <ScrollToTopSection />
    </main>
  );
}
