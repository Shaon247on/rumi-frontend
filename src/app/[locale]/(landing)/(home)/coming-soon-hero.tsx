'use client'

import heroBg from '@/assets/image/coming-soon-hero-bg.png'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import type { StaticImageData } from 'next/image'
import Image from 'next/image'
import { useState } from 'react'

type ImageSlide = {
  type: 'image'
  src: StaticImageData
  alt: string
}

type VideoSlide = {
  type: 'video'
  src: string
}

type Slide = ImageSlide | VideoSlide

const slides: Slide[] = [
  { type: 'image', src: heroBg, alt: 'Coming Soon Hero' },
  { type: 'video', src: '/coming-hero-video-opt.mp4' },
]

// Carousel configuration
const CAROUSEL_CONFIG = {
  // Animation settings
  transitionDuration: 0.3, // seconds
  initialOpacity: 0,
  animateOpacity: 1,
  slideDistance: 100, // pixels for slide animation

  // Swipe/drag settings
  swipeThreshold: 100, // minimum pixels to trigger slide change

  // Height settings (Tailwind classes)
  mobileHeight: 'h-[400px]',
  tabletHeight: 'md:h-[500px]',
  desktopHeight: 'lg:h-[700px]',
} as const

export const ComingSoonHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > CAROUSEL_CONFIG.swipeThreshold) {
      nextSlide()
    }
    if (touchStart - touchEnd < -CAROUSEL_CONFIG.swipeThreshold) {
      prevSlide()
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStart) {
      setTouchEnd(e.clientX)
    }
  }

  const handleMouseUp = () => {
    if (touchStart - touchEnd > CAROUSEL_CONFIG.swipeThreshold) {
      nextSlide()
    }
    if (touchStart - touchEnd < -CAROUSEL_CONFIG.swipeThreshold) {
      prevSlide()
    }
    setTouchStart(0)
    setTouchEnd(0)
  }

  return (
    <div className="bg-background border-b border-black pb-6">
      {/* slider part - start  */}
      <div
        className={cn(
          `relative w-full cursor-grab overflow-hidden active:cursor-grabbing`,
          CAROUSEL_CONFIG.mobileHeight,
          CAROUSEL_CONFIG.tabletHeight,
          CAROUSEL_CONFIG.desktopHeight
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <AnimatePresence mode="wait">
          {slides[currentSlide].type === 'image' ? (
            <motion.div
              key={`image-${currentSlide}`}
              initial={{
                opacity: CAROUSEL_CONFIG.initialOpacity,
                x: CAROUSEL_CONFIG.slideDistance,
              }}
              animate={{ opacity: CAROUSEL_CONFIG.animateOpacity, x: 0 }}
              exit={{ opacity: CAROUSEL_CONFIG.initialOpacity, x: -CAROUSEL_CONFIG.slideDistance }}
              transition={{ duration: CAROUSEL_CONFIG.transitionDuration }}
              className="absolute inset-0"
            >
              <Image
                src={slides[currentSlide].src as StaticImageData}
                alt={(slides[currentSlide] as ImageSlide).alt}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`video-${currentSlide}`}
              initial={{
                opacity: CAROUSEL_CONFIG.initialOpacity,
                x: CAROUSEL_CONFIG.slideDistance,
              }}
              animate={{ opacity: CAROUSEL_CONFIG.animateOpacity, x: 0 }}
              exit={{ opacity: CAROUSEL_CONFIG.initialOpacity, x: -CAROUSEL_CONFIG.slideDistance }}
              transition={{ duration: CAROUSEL_CONFIG.transitionDuration }}
              className="absolute inset-0"
            >
              <video
                src={(slides[currentSlide] as VideoSlide).src}
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="none"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* slider part - End  */}

      {/* indicator */}
      <div className="mx-auto mt-10 flex max-w-20 items-center justify-center gap-1">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`min-h-3 rounded-xl transition-all ${
              currentSlide === index ? 'bg-primary min-w-14' : 'min-w-8 bg-[#D9D9D9]'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  )
}
