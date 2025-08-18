'use client';

import { EnhancedHeroSection } from '@/components/hero';

interface HeroSectionProps {
  hideProjectsButton?: boolean;
}

export function HeroSection({ hideProjectsButton = false }: HeroSectionProps) {
  return <EnhancedHeroSection hideProjectsButton={hideProjectsButton} />;
}
