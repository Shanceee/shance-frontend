'use client';

import { usePathname } from 'next/navigation';

import { BackgroundElements } from '@/components/ui/BackgroundElements';
import { StaticHeader } from '@/components/layout';
import {
  AnimatedTagsSection,
  HeroSection,
} from '@/modules/landing/start-page/components';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isProjectsPage = pathname === '/projects';

  return (
    <div className="min-h-screen bg-[#232323] relative overflow-hidden">
      <BackgroundElements />
      <AnimatedTagsSection />

      <StaticHeader />
      <HeroSection hideProjectsButton={isProjectsPage} />
      {children}
    </div>
  );
}
