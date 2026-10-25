import contactImage from '@/assets/image/contact-image-trans.png'
import { Mail, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

export const ContactUs = async () => {
  const t = await getTranslations('home.contactUs')

  return (
    <section className="bg-[#FFFFFF] py-16">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-5">
        {/* Left - Product Image */}
        <div className="flex w-full justify-center bg-[#FBFAF6] py-10 md:col-span-3">
          <Image src={contactImage} alt={t('imageAlt')} className="min-h-100 w-auto" />
        </div>

        {/* Right - Contact Info */}
        <div className="flex flex-col">
          <h2 className="text-main-button text-3xl md:text-4xl">{t('title')}</h2>
          <p className="mt-4 max-w-sm text-sm text-gray-600">{t('description')}</p>

          <div className="mt-8 flex flex-col gap-4">
            <a
              href={`mailto:${t('email')}`}
              className="text-main-button flex items-center gap-3 transition-colors hover:opacity-80"
            >
              <Mail className="size-5" />
              <span>{t('email')}</span>
            </a>
            <a
              href={`tel:${t('phone')}`}
              className="text-main-button flex items-center gap-3 transition-colors hover:opacity-80"
            >
              <Phone className="size-5" />
              <span>{t('phone')}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
