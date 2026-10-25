import dynamic from 'next/dynamic'
import { NewComingSoonHero } from './new-coming-soon-hero'
import { ShowModals } from './show-modals'

// Below-fold components — lazy loaded for performance
const GlowmiStates = dynamic(() =>
  import('./glowmi-states').then((mod) => ({ default: mod.GlowmiStates }))
)
const VisualsResultsHero = dynamic(() =>
  import('./visuals-results-hero').then((mod) => ({ default: mod.VisualsResultsHero }))
)
const TransformationWrapper = dynamic(() =>
  import('./transformation-wrapper').then((mod) => ({ default: mod.TransformationWrapper }))
)
const SkincareShowcase = dynamic(() =>
  import('./skincare-showcase').then((mod) => ({ default: mod.SkincareShowcase }))
)
const BrandStoryTeaser = dynamic(() =>
  import('./brand-story-teaser').then((mod) => ({ default: mod.BrandStoryTeaser }))
)
const HomeBottomCta = dynamic(() =>
  import('./home-bottom-cta').then((mod) => ({ default: mod.HomeBottomCta }))
)

// ISR: revalidate every hour for edge cache hits
export const revalidate = 3600

export default function HomePage() {
  return (
    <>
      <NewComingSoonHero />

      <GlowmiStates />
      <ShowModals />

      <TransformationWrapper />

      <div className="container mx-auto">
        <SkincareShowcase />
      </div>

      <VisualsResultsHero />

      <BrandStoryTeaser />

      <HomeBottomCta />
    </>
  )
}
