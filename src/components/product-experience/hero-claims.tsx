'use client'

import { cn } from '@/lib/utils'
import { Droplet, Feather, HeartHandshake, Shield, ShieldCheck, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import React from 'react'

interface HeroClaimsProps {
  claims: string[]
  isAR?: boolean
}

const ICONS = [Droplet, Shield, HeartHandshake, Sparkles, Feather, ShieldCheck]

export function HeroClaims({ claims, isAR }: HeroClaimsProps) {
  if (!claims || claims.length === 0) return null

  return (
    <section
      className={cn(
        'w-full overflow-hidden bg-[#1A2E1A] py-16 md:py-24',
        isAR ? 'font-arabic rtl' : 'ltr font-sans'
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {claims.map((claim, idx) => {
            const IconComponent = ICONS[idx % ICONS.length]

            return (
              <motion.div
                key={claim}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="group relative flex flex-col items-center justify-center rounded-none border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:bg-white/10"
              >
                <div className="mb-3.5 flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#D4AF37] transition-all duration-500 group-hover:scale-110 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/10">
                  <IconComponent className="size-5 stroke-[1.5]" />
                </div>
                <span className="text-xs leading-snug font-medium tracking-tight text-[#FAF8F4] sm:text-sm">
                  {claim}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
