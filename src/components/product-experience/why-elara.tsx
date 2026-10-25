'use client'

import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { StaticImageData } from 'next/image'
import React from 'react'

interface StressorItem {
  title: string
  desc: string
}

interface WhyElaraProps {
  question: string
  headline: string
  body: string
  stressors: StressorItem[]
  image?: StaticImageData | string
  isAR?: boolean
}

export function WhyElara({ question, headline, body, stressors, isAR }: WhyElaraProps) {
  return (
    <section
      id="why-elara"
      className={cn(
        'w-full rounded-none bg-[#FAF8F4] px-6 py-20 shadow-none md:px-12 md:py-28 lg:px-24',
        isAR ? 'font-arabic rtl' : 'ltr font-sans'
      )}
    >
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Top Header Narrative (Full Width, Centered Editorial Layout) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl space-y-6 text-center"
        >
          <span className="block font-mono text-xs font-medium tracking-[0.3em] text-[#8C8275] uppercase">
            {question}
          </span>
          <h2
            className="font-serif text-4xl leading-tight font-extralight text-[#1A1918] md:text-5xl lg:text-6xl"
            style={{
              fontFamily: isAR
                ? 'var(--font-amiri), serif'
                : 'var(--font-cormorant-garamond), serif',
            }}
          >
            {headline}
          </h2>
          <div className="mx-auto h-[1px] w-16 bg-[#9F8A6B]/60" />
          <p className="font-serif text-xl leading-relaxed font-light text-[#4A4641] italic md:text-2xl">
            {body}
          </p>
        </motion.div>

        {/* Simplified Inline Stressors List */}
        <div className="mx-auto max-w-4xl border-t border-[#E6DFD5] pt-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-center"
          >
            {stressors.map((item, idx) => (
              <div key={idx} className="flex items-center gap-6">
                <span
                  className="font-serif text-lg text-[#1A1918] md:text-xl"
                  style={{
                    fontFamily: isAR
                      ? 'var(--font-amiri), serif'
                      : 'var(--font-cormorant-garamond), serif',
                  }}
                >
                  {item.title}
                </span>
                {idx < stressors.length - 1 && (
                  <span className="size-1.5 rounded-full bg-[#9F8A6B]/30" />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
