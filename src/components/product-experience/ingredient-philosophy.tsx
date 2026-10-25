'use client'

import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import Image, { StaticImageData } from 'next/image'
import React from 'react'

interface IngredientItem {
  name: string
  desc: string
}

interface IngredientPhilosophyProps {
  question: string
  headline: string
  body: string
  ingredients?: IngredientItem[]
  image: StaticImageData | string
  isAR?: boolean
}

export function IngredientPhilosophy({
  question,
  headline,
  body,
  ingredients = [],
  image,
  isAR,
}: IngredientPhilosophyProps) {
  return (
    <section
      className={cn(
        'relative w-full overflow-hidden rounded-none bg-[#1A2E1A] px-6 py-24 text-[#FAF8F4] shadow-none md:px-12 md:py-36 lg:px-20',
        isAR ? 'font-arabic rtl' : 'ltr font-sans'
      )}
    >
      {/* Soft Ambient Gold Glow */}
      <div className="pointer-events-none absolute -top-40 right-0 size-[500px] rounded-full bg-[#D4AF37]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 left-0 size-[500px] rounded-full bg-[#9F8A6B]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Top Story Header */}
        <div className="mx-auto mb-16 flex max-w-3xl flex-col items-center text-center md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 block font-mono text-xs font-medium tracking-[0.3em] text-[#D4AF37] uppercase"
          >
            {question}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 font-serif text-3xl leading-tight font-light text-[#FAF8F4] md:text-5xl lg:text-6xl"
            style={{
              fontFamily: isAR
                ? 'var(--font-amiri), serif'
                : 'var(--font-cormorant-garamond), serif',
            }}
          >
            {headline}
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 h-[1px] w-20 bg-[#D4AF37]/60"
          />
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base leading-relaxed font-light text-white/80 md:text-lg"
          >
            {body}
          </motion.p>
        </div>

        {/* Hero Visual & 8-Ingredient Equal Height Grid */}
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Hero Image Aspect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-none border border-white/15 shadow-none lg:col-span-5"
          >
            <Image
              src={image}
              alt={headline}
              fill
              className="object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute right-6 bottom-6 left-6">
              <span className="inline-flex items-center gap-2 rounded-none border border-white/20 bg-white/10 px-4 py-2 font-mono text-xs tracking-[0.2em] text-white uppercase shadow-none backdrop-blur-md">
                <Sparkles className="size-3.5 text-[#D4AF37]" />
                <span>Bio-Identical Synergies</span>
              </span>
            </div>
          </motion.div>

          {/* Right 8 Ingredients Equal-Height Row Grid */}
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:col-span-7">
            {ingredients.map((ing, idx) => (
              <motion.div
                key={ing.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="group relative flex h-full flex-col justify-between rounded-none border border-white/10 bg-white/5 p-6 shadow-none backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:bg-white/10 hover:shadow-[0_12px_40px_rgba(212,175,55,0.1)]"
              >
                <div>
                  <div className="mb-3 flex items-start gap-3">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                    <h3 className="font-serif text-lg leading-snug font-normal tracking-wide text-white">
                      {ing.name}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed font-light text-white/75">{ing.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
