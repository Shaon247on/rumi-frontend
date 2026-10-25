'use client'

import { cn } from '@/lib/utils'
import { ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { motion } from 'motion/react'
import Image, { StaticImageData } from 'next/image'
import React, { useState } from 'react'

interface ProductPurchaseProps {
  title: string
  volume: string
  price: string
  tagline?: string
  quantityLabel: string
  addToBag: string
  addedToBag: string
  image: StaticImageData | string
  isAR?: boolean
}

export function ProductPurchase({
  title,
  volume,
  price,
  tagline,
  quantityLabel,
  addToBag,
  addedToBag,
  image,
  isAR,
}: ProductPurchaseProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAdd = () => {
    setIsAdding(true)
    setTimeout(() => {
      setIsAdding(false)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 3000)
    }, 800)
  }

  return (
    <section
      id="purchase-section"
      className={cn(
        'relative flex min-h-screen w-full items-center justify-center rounded-none bg-[#FAF8F4] px-6 pt-32 pb-20 shadow-none md:px-12 md:pt-40 md:pb-28 lg:px-24',
        isAR ? 'font-arabic rtl' : 'ltr font-sans'
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-20">
        {/* Large Bottle Image Column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="group relative flex aspect-[4/5] w-full flex-1 items-center justify-center overflow-hidden rounded-none border-[0.5px] border-[#E6DFD5] bg-gradient-to-b from-white to-[#FAF8F4]/50 p-8 shadow-[0_10px_40px_rgba(26,25,24,0.02)] transition-all duration-1000 hover:shadow-[0_20px_60px_rgba(26,25,24,0.05)] md:p-12"
        >
          <div className="relative h-full w-full">
            <Image src={image} alt={title} fill className="object-contain" />
          </div>
          <div className="absolute top-6 left-6 z-10">
            <span className="inline-flex items-center gap-2 rounded-none border-[0.5px] border-[#E6DFD5]/50 bg-white/80 px-4 py-2 font-mono text-[10px] font-medium tracking-[0.25em] text-[#8C8275] uppercase shadow-[0_2px_10px_rgba(0,0,0,0.02)] backdrop-blur-md transition-colors duration-500 group-hover:bg-white group-hover:text-[#5C564E]">
              <Sparkles className="size-3 text-[#9F8A6B] transition-transform duration-700 group-hover:rotate-12" />
              <span>Flagship Formulation</span>
            </span>
          </div>
        </motion.div>

        {/* Sticky Desktop Purchase Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg flex-1 space-y-8 rounded-none border-[0.5px] border-[#E6DFD5] bg-white/95 p-8 shadow-[0_10px_50px_rgba(26,25,24,0.03)] backdrop-blur-sm md:p-12 lg:sticky lg:top-40"
        >
          <div>
            <span className="mb-2 block font-mono text-xs font-medium tracking-[0.3em] text-[#8C8275] uppercase">
              {isAR ? 'التركيبة الفاخرة' : 'CELLULAR REGENERATION'}
            </span>
            <h2
              className="mb-3 font-serif text-4xl font-extralight text-[#1A1918] md:text-5xl"
              style={{
                fontFamily: isAR
                  ? 'var(--font-amiri), serif'
                  : 'var(--font-cormorant-garamond), serif',
              }}
            >
              {title}
            </h2>
            {tagline && (
              <p className="mb-6 text-base leading-relaxed font-light text-[#5C564E]">{tagline}</p>
            )}

            {/* Single Unified Size Value Matching Formulation Standards Spec Table Exactly */}
            <div className="flex items-center justify-between border-y border-[#E6DFD5] py-4 font-serif text-xl text-[#1A1918]">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-semibold tracking-wider text-[#1A1918]">
                  {volume}
                </span>
              </div>
              <span className="font-sans text-2xl font-semibold text-[#1A1918]">{price}</span>
            </div>
          </div>

          {/* Quantity & Add to Bag Area */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-4">
              <span className="font-mono text-xs tracking-widest text-[#8C8275] uppercase">
                {quantityLabel}
              </span>
              <div className="flex items-center gap-6 rounded-none border border-[#E6DFD5] bg-[#FAF8F4] px-4 py-1.5 shadow-none">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 text-xl font-light text-[#8C8275] transition-colors hover:text-[#1A1918]"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-6 text-center font-mono text-base font-medium text-[#1A1918]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 text-xl font-light text-[#8C8275] transition-colors hover:text-[#1A1918]"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Bag Button using warm off-black color token (#1C1C1A / #1A1918), no pure black (#000000) */}
            <button
              onClick={handleAdd}
              disabled={isAdding || isAdded}
              className={cn(
                'group relative w-full cursor-pointer overflow-hidden rounded-none border-[0.5px] border-transparent px-8 py-5 font-mono text-xs font-semibold tracking-[0.25em] uppercase shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-all duration-700',
                isAdded
                  ? 'bg-[#1A2E1A] text-[#FAF8F4]'
                  : 'bg-[#1C1C1A] text-[#FAF8F4] hover:border-[#9F8A6B]/50 hover:bg-[#2C2A29] hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]'
              )}
            >
              {isAdding ? (
                <span className="opacity-70">Adding to Bag...</span>
              ) : isAdded ? (
                addedToBag
              ) : (
                addToBag
              )}
            </button>

            {/* Quiet Luxury Guarantees */}
            <div className="grid grid-cols-2 gap-4 border-t border-[#E6DFD5] pt-6 font-mono text-[11px] text-[#8C8275]">
              <div className="flex items-center gap-2">
                <Truck className="size-4 text-[#9F8A6B]" />
                <span>Complimentary Express Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-[#9F8A6B]" />
                <span>Dermatologically Tested</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
