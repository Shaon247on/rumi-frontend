'use client'

import carbon_update_complete from '@/assets/icons/carbon_update-complete.svg'
import { CommonNav, SiteHeading } from '@/components/shared'
import { buttonVariants } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Link } from '@/i18n/navigation'
import { CalendarCheck2, MessageCircle, Package } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { AllProductsContent } from './all-products-content'
import { YourRoutinesContents } from './your-routines-contents'

const YourRoutine = () => {
  const t = useTranslations('yourRoutine')

  return (
    <div className="bg-background min-h-screen pb-20">
      <CommonNav />
      <div className="flex justify-center pt-8">
        <span className="bg-main-button/10 text-main-button flex items-center gap-2 rounded-full px-4 py-2 text-sm">
          <Image src={carbon_update_complete} alt="carbon_update_complete" />
          {t('badge')}
        </span>
      </div>

      {/* Header */}
      <div className="py-8">
        <SiteHeading
          heading={t('heading')}
          subHeading={t('subHeading')}
          headingClassName="text-main-button"
          subHeadingClassname="text-[#363739]!"
        />
      </div>

      {/* Skin Concerns Banner */}
      <div className="mx-auto max-w-4xl px-6">
        <div className="bg-brand-shade-10 rounded-lg p-4">
          <h3 className="text-primary-base_medium mb-2 text-lg text-[32px] font-bold">
            {t('skinConcerns.title')}
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 gap-x-2 rounded-full bg-[#989E9A1A] px-3 py-1 text-sm">
              <Image src={carbon_update_complete} alt="carbon_update_complete" />
              {t('skinConcerns.acneBreakouts')}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="routine" className="mt-8">
        <TabsList className="mx-auto flex w-fit justify-center gap-2 bg-transparent">
          <TabsTrigger
            value="routine"
            className="rounded-full border border-[#59351B] px-6 py-4 text-[#363739] data-active:bg-black! data-active:text-white!"
          >
            <CalendarCheck2 />
            {t('tabs.yourRoutine')}
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="rounded-full border border-[#59351B] px-6 py-4 text-[#363739] data-active:bg-black! data-active:text-white!"
          >
            <Package className="size-5" />
            {t('tabs.allProducts')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="routine">
          <YourRoutinesContents />
        </TabsContent>
        <TabsContent value="products">
          <AllProductsContent />
        </TabsContent>
      </Tabs>

      {/* Chat CTA */}
      <div className="mx-auto mt-12 max-w-4xl px-6 text-center">
        <h3 className="text-main-button mb-2 text-3xl font-bold">{t('chatCta.title')}</h3>
        <p className="mb-6 text-sm text-[#363739]">{t('chatCta.description')}</p>
        <Link
          href={'/ai-chat-assistant'}
          className={buttonVariants({
            className: 'bg-main-button hover:bg-main-button/90 gap-2 px-8 py-6 text-white',
          })}
        >
          {t('chatCta.button')}
          <MessageCircle className="size-4" />
        </Link>
      </div>
    </div>
  )
}

export default YourRoutine
