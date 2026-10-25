'use client'

import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import React from 'react'
import { BrandTag } from './shared-tag'

interface SpecsLabels {
  productType: string
  texture: string
  skinType: string
  size: string
  use: string
  absorption: string
  finish: string
}

interface SpecsValues {
  productType: string
  texture: string
  skinType: string
  size: string
  use: string
  absorption: string
  finish: string
}

interface ProductSpecsMatrixProps {
  question: string
  headline: string
  labels: SpecsLabels
  values: SpecsValues
  suitableForQuestion: string
  suitableForHeadline: string
  suitableForItems: string[]
  isAR?: boolean
}

export function ProductSpecsMatrix({
  question,
  headline,
  labels,
  values,
  suitableForQuestion,
  suitableForHeadline,
  suitableForItems = [],
  isAR,
}: ProductSpecsMatrixProps) {
  const specRows = [
    { label: labels.productType, val: values.productType },
    { label: labels.texture, val: values.texture },
    { label: labels.skinType, val: values.skinType },
    { label: labels.size, val: values.size },
    { label: labels.use, val: values.use },
    { label: labels.absorption, val: values.absorption },
    { label: labels.finish, val: values.finish },
  ]

  return (
    <section
      className={cn(
        'w-full overflow-hidden rounded-none border-y border-[#E6DFD5] bg-[#FAF8F4] py-16 shadow-none md:py-20',
        isAR ? 'font-arabic rtl' : 'ltr font-sans'
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* LEFT: Product Specifications Table */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex h-full flex-col"
          >
            <div className="flex h-full flex-col">
              <div>
                <p className="mb-2 font-mono text-xs font-medium tracking-[0.25em] text-[#8C8275] uppercase">
                  {question}
                </p>
                <h2
                  className="mb-6 font-serif text-2xl font-light text-[#1A1918] md:text-3xl"
                  style={{
                    fontFamily: isAR
                      ? 'var(--font-amiri), serif'
                      : 'var(--font-cormorant-garamond), serif',
                  }}
                >
                  {headline}
                </h2>
              </div>

              <div className="flex-1 rounded-none border-[0.5px] border-[#E6DFD5] bg-white/95 p-6 shadow-[0_8px_30px_rgba(26,25,24,0.02)] backdrop-blur-sm transition-all duration-700 hover:border-[#9F8A6B]/30 hover:shadow-[0_12px_40px_rgba(26,25,24,0.04)] md:p-8">
                <div className="divide-y divide-[#E6DFD5]">
                  {specRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between px-1 py-2.5 text-sm transition-colors duration-200 hover:bg-[#FAF8F4]/60 sm:text-base"
                    >
                      <span className="font-sans font-normal text-[#8C8275]">{row.label}</span>
                      <span className="text-right font-serif font-medium text-[#1A1918]">
                        {row.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Suitable For Compatibility Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex h-full flex-col"
          >
            <div className="flex h-full flex-col">
              <div>
                <p className="mb-2 font-mono text-xs font-medium tracking-[0.25em] text-[#8C8275] uppercase">
                  {suitableForQuestion}
                </p>
                <h2
                  className="mb-6 font-serif text-2xl font-light text-[#1A1918] md:text-3xl"
                  style={{
                    fontFamily: isAR
                      ? 'var(--font-amiri), serif'
                      : 'var(--font-cormorant-garamond), serif',
                  }}
                >
                  {suitableForHeadline}
                </h2>
              </div>

              <div className="flex-1 rounded-none border-[0.5px] border-[#E6DFD5] bg-white/95 p-6 shadow-[0_8px_30px_rgba(26,25,24,0.02)] backdrop-blur-sm transition-all duration-700 hover:border-[#9F8A6B]/30 hover:shadow-[0_12px_40px_rgba(26,25,24,0.04)] md:p-8">
                <div>
                  <div className="mb-5 flex items-center gap-2 font-mono text-xs font-medium tracking-wider text-[#1A1918] uppercase">
                    <Sparkles className="size-4 text-[#9F8A6B]" />
                    <span>
                      {isAR ? 'اختبار التوافق الجلدي' : 'Dermatologically Tested Compatibility'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {suitableForItems.map((item) => (
                      <BrandTag key={item} label={item} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
