'use client'

import { useEffect, useRef, useState } from 'react'

export function LazyVideo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked — silently ignore
      })
    }
  }, [isVisible])

  return (
    <div ref={containerRef} className="absolute inset-0 h-full w-full">
      {isVisible && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          className="h-full w-full object-cover"
        >
          <source src="/elara222.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  )
}
