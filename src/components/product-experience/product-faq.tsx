'use client'

import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'

interface FAQItem {
  q: string
  a: string
}

interface ProductFAQProps {
  question: string
  headline: string
  items: FAQItem[]
  isAR?: boolean
}

export function ProductFAQ({ question, headline, items, isAR }: ProductFAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section
      className={cn(
        'w-full rounded-none border-b border-[#E6DFD5] bg-[#FAF8F4] px-6 py-20 shadow-none md:py-28 lg:py-36',
        isAR ? 'font-arabic rtl' : 'ltr font-sans'
      )}
    >
      <div className="mx-auto max-w-4xl space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="space-y-3 text-center"
        >
          <span className="block font-mono text-xs font-medium tracking-[0.3em] text-[#8C8275] uppercase">
            {question}
          </span>
          <h2
            className="font-serif text-4xl font-extralight text-[#1A1918] md:text-5xl"
            style={{
              fontFamily: isAR
                ? 'var(--font-amiri), serif'
                : 'var(--font-cormorant-garamond), serif',
            }}
          >
            {headline}
          </h2>
        </motion.div>

        {/* Thin Border Accordion List (Zero Rounded Corners, Zero Shadows) */}
        <div className="divide-y divide-[#E6DFD5] rounded-none border-y border-[#E6DFD5] shadow-none">
          {items.map((item, idx) => {
            const isOpen = openIdx === idx
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="rounded-none bg-transparent py-6 shadow-none sm:py-8"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="group flex w-full cursor-pointer items-center justify-between gap-6 text-start outline-none"
                >
                  <span
                    className="font-serif text-xl font-light text-[#1A1918] md:text-2xl"
                    style={{
                      fontFamily: isAR
                        ? 'var(--font-amiri), serif'
                        : 'var(--font-cormorant-garamond), serif',
                    }}
                  >
                    {item.q}
                  </span>
                  <span className="text-xl font-light text-[#9F8A6B] transition-transform duration-300">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-base leading-relaxed font-light text-[#5C564E] md:text-lg">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
