import React from 'react'
import { getLocale, getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { NewNav } from '@/components/shared/new-nav'
import { NewFooter } from '@/components/shared/new-footer'

// Flagship Framework Components
import { HeroClaims } from '@/components/product-experience/hero-claims'
import { WhyElara } from '@/components/product-experience/why-elara'
import { IngredientPhilosophy } from '@/components/product-experience/ingredient-philosophy'
import { TextureExperience } from '@/components/product-experience/texture-experience'
import { ProductSpecsMatrix } from '@/components/product-experience/product-specs-matrix'
import { RitualExperience } from '@/components/product-experience/ritual-experience'
import { ProductFAQ } from '@/components/product-experience/product-faq'
import { ProductPurchase } from '@/components/product-experience/product-purchase'

import elaraSerum from '@/assets/products/elara-serum.jpg'
import elaraTextureGlow from '@/assets/image/elara-texture-glow.png'
import elaraBioBotanicals from '@/assets/image/elara-bio-botanicals.jpg'

async function Flagship14SectionExperience() {
  const t = await getTranslations('productsPage')
  const locale = await getLocale()
  const isAR = locale === 'ar'

  // Type-safe fallback wrappers for raw translation retrieval
  const getRawArray = <T,>(key: string): T[] => {
    try {
      const val = t.raw(key)
      return Array.isArray(val) ? val : []
    } catch {
      return []
    }
  }

  const getRawObject = <T extends object>(key: string, fallback: T): T => {
    try {
      const val = t.raw(key)
      return val && typeof val === 'object' && !Array.isArray(val) ? val : fallback
    } catch {
      return fallback
    }
  }

  // Extract raw translation arrays/objects with bulletproof fail-safes
  const rawHeroClaims = getRawArray<string>('elara.heroClaims')
  const rawIngredients = getRawArray<{ name: string; desc: string }>('elara.philosophy.ingredients')
  const rawStressors = getRawArray<{ title: string; desc: string }>('elara.why.stressors')
  const rawFeelItems = getRawArray<{ title: string; desc: string }>('elara.howItFeels.items')

  const defaultSpecs = {
    productType: '',
    texture: '',
    skinType: '',
    size: '',
    use: '',
    absorption: '',
    finish: '',
  }

  const rawSpecsLabels = getRawObject('elara.specs.labels', defaultSpecs)
  const rawSpecsValues = getRawObject('elara.specs.values', defaultSpecs)
  const rawSuitableForItems = getRawArray<string>('elara.specs.suitableForItems')
  const rawMorningSteps = getRawArray<{ action: string; detail: string }>(
    'elara.ritual.morning.steps'
  )
  const rawNightSteps = getRawArray<{ action: string; detail: string }>('elara.ritual.night.steps')
  const rawFaqItems = getRawArray<{ q: string; a: string }>('elara.faq.items')

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#FAF8F4] selection:bg-[#1A2E1A] selection:text-white">
      {/* Quiet Luxury Noise & Film Grain Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      <NewNav />

      {/* SECTION 1: Product & Purchase (Hero) */}
      <ProductPurchase
        title={t('elara.purchase.title')}
        volume={t('elara.purchase.volume')}
        price={t('elara.purchase.price')}
        tagline={t('elara.purchase.tagline')}
        quantityLabel={t('elara.purchase.quantityLabel')}
        addToBag={t('elara.purchase.addToBag')}
        addedToBag={t('elara.purchase.addedToBag')}
        image={elaraSerum}
        isAR={isAR}
      />

      {/* SECTION 2: Key Benefits (Green Cards) */}
      <HeroClaims claims={rawHeroClaims} isAR={isAR} />

      {/* SECTION 3: Why ELARA */}
      <WhyElara
        question={t('elara.why.question')}
        headline={t('elara.why.headline')}
        body={t('elara.why.body')}
        stressors={rawStressors}
        isAR={isAR}
      />

      {/* SECTION 4: 8 Key Ingredients Philosophy */}
      <IngredientPhilosophy
        question={t('elara.philosophy.question')}
        headline={t('elara.philosophy.headline')}
        body={t('elara.philosophy.body')}
        ingredients={rawIngredients}
        image={elaraBioBotanicals}
        isAR={isAR}
      />

      {/* SECTION 5: Texture & Sensory Experience */}
      <TextureExperience
        question={t('elara.texture.question')}
        headline={t('elara.texture.headline')}
        body={t('elara.texture.body')}
        feelItems={rawFeelItems}
        image={elaraTextureGlow}
        isAR={isAR}
      />

      {/* SECTION 6: Daily Ritual (Morning & Night) */}
      <RitualExperience
        question={t('elara.ritual.question')}
        headline={t('elara.ritual.headline')}
        morning={{
          title: t('elara.ritual.morning.title'),
          steps: rawMorningSteps,
        }}
        night={{
          title: t('elara.ritual.night.title'),
          steps: rawNightSteps,
        }}
        isAR={isAR}
      />

      {/* SECTION 7: Product Specifications & Suitable For Matrix */}
      <ProductSpecsMatrix
        question={t('elara.specs.question')}
        headline={t('elara.specs.headline')}
        labels={rawSpecsLabels}
        values={rawSpecsValues}
        suitableForQuestion={t('elara.specs.suitableForQuestion')}
        suitableForHeadline={t('elara.specs.suitableForHeadline')}
        suitableForItems={rawSuitableForItems}
        isAR={isAR}
      />

      {/* SECTION 8: Product FAQ */}
      <ProductFAQ
        question={t('elara.faq.question')}
        headline={t('elara.faq.headline')}
        items={rawFaqItems}
        isAR={isAR}
      />

      <NewFooter />
    </main>
  )
}

export default async function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F4]" />}>
      <Flagship14SectionExperience />
    </Suspense>
  )
}
