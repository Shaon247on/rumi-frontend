'use client'

import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import Image, { StaticImageData } from 'next/image'
import React, { useState } from 'react'

interface TextureExperienceProps {
  question: string
  headline: string
  body: string
  feelItems?: { title: string; desc: string }[]
  image: StaticImageData | string
  isAR?: boolean
}

export function TextureExperience({
  question,
  headline,
  body,
  feelItems = [],
  image,
  isAR,
}: TextureExperienceProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - left) / width - 0.5
    const y = (e.clientY - top) / height - 0.5
    setMousePos({ x, y })
  }

  return (
    <section
      onMouseMove={handleMouseMove}
      className={cn(
        'relative w-full overflow-hidden bg-[#FAF8F4] px-6 py-24 text-[#1A1918] md:px-12 md:py-36 lg:px-24',
        isAR ? 'font-arabic rtl' : 'ltr font-sans'
      )}
    >
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row lg:gap-24">
        {/* Text Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="flex-1 space-y-8"
        >
          <span className="block text-xs font-medium tracking-[0.3em] text-[#8C8275] uppercase">
            {question}
          </span>
          <h2 className="font-serif text-3xl leading-tight whitespace-nowrap text-[#1A1918] sm:text-4xl md:text-5xl lg:text-6xl">
            {headline}
          </h2>
          <p className="max-w-xl text-lg leading-relaxed font-light text-[#4A4641] md:text-xl">
            {body}
          </p>

          {feelItems.length > 0 && (
            <div className="mt-8 space-y-8 border-t border-[#E6DFD5] pt-10">
              {feelItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + idx * 0.15 }}
                  className="group space-y-2"
                >
                  <h3 className="flex items-center gap-3 font-serif text-xl text-[#1A1918] transition-colors duration-500 group-hover:text-[#9F8A6B] md:text-2xl">
                    <span className="size-1.5 rounded-full bg-[#9F8A6B] transition-transform duration-500 group-hover:scale-150" />
                    {item.title}
                  </h3>
                  <p className="pl-4.5 text-base leading-relaxed font-light text-[#5C564E]">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Interactive Texture Visual Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.33, 1, 0.68, 1] }}
          className="relative flex aspect-square w-full flex-1 cursor-crosshair items-center justify-center overflow-hidden rounded-full border-[0.5px] border-[#E6DFD5] bg-white shadow-[0_20px_60px_rgba(26,25,24,0.08)] transition-all duration-700 hover:border-[#9F8A6B]/30 hover:shadow-[0_20px_60px_rgba(26,25,24,0.12)]"
        >
          {/* Parallax image based on mouse movement */}
          <motion.div
            animate={{
              x: mousePos.x * -25,
              y: mousePos.y * -25,
              scale: 1.05,
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="absolute inset-[-10%] h-[120%] w-[120%]"
          >
            <Image src={image} alt={headline} fill className="object-cover" />
          </motion.div>

          {/* Interactive Light Overlay */}
          <motion.div
            animate={{
              x: mousePos.x * 40,
              y: mousePos.y * 40,
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 25 }}
            className="pointer-events-none absolute h-72 w-72 rounded-full bg-[#FAF8F4]/30 mix-blend-overlay blur-3xl"
          />
        </motion.div>
      </div>
    </section>
  )
}
