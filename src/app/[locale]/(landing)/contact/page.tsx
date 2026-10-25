import React from 'react'
import { ContactForm } from './contact-form'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const isAr = locale === 'ar'

  return {
    title: isAr ? 'تواصل معنا' : 'Contact',
    description: isAr
      ? 'مراسلة الدار في جلومي. نقرأ كل رسالة بعناية واهتمام شخصي.'
      : 'Get in touch with Glowmi. We read every message personally and respond with care.',
  }
}

export default async function ContactPage() {
  return (
    <div className="relative min-h-screen bg-[#FAF8F4] pt-24 pb-12 md:pt-32">
      <ContactForm />
    </div>
  )
}
