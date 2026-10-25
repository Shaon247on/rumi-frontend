'use client'

import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import React from 'react'

interface StepDetail {
  action: string
  detail: string
}

interface RitualPhase {
  title: string
  steps: StepDetail[]
}

interface RitualExperienceProps {
  question?: string
  headline?: string
  morning: RitualPhase
  night: RitualPhase
  isAR?: boolean
}

export function RitualExperience({
  question = 'Daily Ritual',
  headline = 'Harmonized Application',
  morning,
  night,
  isAR,
}: RitualExperienceProps) {
  const fontSerif = isAR
    ? 'var(--font-ibm-plex-arabic), sans-serif'
    : 'var(--font-cormorant-garamond), serif'

  return (
    <section
      className={cn(
        'w-full rounded-none bg-[#1A2E1A] px-6 py-20 text-[#FAF8F4] shadow-none md:px-12 md:py-28 lg:px-24',
        isAR ? 'font-arabic rtl' : 'ltr font-sans'
      )}
    >
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-3 block font-mono text-xs font-medium tracking-[0.3em] text-[#D4AF37] uppercase">
            {question}
          </span>
          <h2
            className="font-serif text-4xl font-light text-white md:text-5xl"
            style={{ fontFamily: fontSerif }}
          >
            {headline}
          </h2>
        </motion.div>

        {/* Compact Morning & Night Timeline */}
        <div className="mx-auto max-w-5xl rounded-none border-[0.5px] border-white/15 bg-white/5 p-8 shadow-[0_10px_50px_rgba(0,0,0,0.15)] backdrop-blur-lg transition-all duration-700 hover:border-white/25 md:p-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
            {/* Morning Column */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h3 className="border-b border-white/10 pb-4 font-mono text-xs tracking-[0.25em] text-[#D4AF37] uppercase">
                {morning.title}
              </h3>
              <div className="space-y-6">
                {morning.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <span className="pt-1 font-mono text-[10px] text-white/50">0{idx + 1}</span>
                    <div>
                      <h4
                        className="font-serif text-xl font-medium text-white"
                        style={{ fontFamily: fontSerif }}
                      >
                        {step.action}
                      </h4>
                      <p className="mt-1 text-sm font-light text-white/80">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Night Column */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <h3 className="border-b border-white/10 pb-4 font-mono text-xs tracking-[0.25em] text-[#D4AF37] uppercase">
                {night.title}
              </h3>
              <div className="space-y-6">
                {night.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <span className="pt-1 font-mono text-[10px] text-white/50">0{idx + 1}</span>
                    <div>
                      <h4
                        className="font-serif text-xl font-medium text-white"
                        style={{ fontFamily: fontSerif }}
                      >
                        {step.action}
                      </h4>
                      <p className="mt-1 text-sm font-light text-white/80">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
