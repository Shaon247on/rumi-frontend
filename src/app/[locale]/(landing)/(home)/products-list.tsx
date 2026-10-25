'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { Product } from '@/api/query-list/product.query'
import { ProductCard } from '@/components/shared/product-card-main'
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { StaticImageData } from 'next/image'

export interface ProductItem {
  id?: number
  src: StaticImageData | string
  alt: string
  category: string
  benefits: string
  skinType: string
}

interface ProductsCarouselProps {
  products: Product[]
  className?: string
  loop?: boolean
  viewDetailsLabel: string
}

export const ProductsCarousel = ({
  products,
  className,
  loop = true,
  viewDetailsLabel,
}: ProductsCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!api) return

    const updateScrollState = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }

    updateScrollState()
    api.on('select', updateScrollState)
    api.on('reInit', updateScrollState)

    return () => {
      api.off('select', updateScrollState)
      api.off('reInit', updateScrollState)
    }
  }, [api])

  return (
    <div className={cn('relative', className)}>
      {/* Left Navigation */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => api?.scrollPrev()}
        onKeyDown={(e) => e.key === 'Enter' && api?.scrollPrev()}
        disabled={!loop && !canScrollPrev}
        className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-md transition-opacity hover:bg-gray-50 disabled:opacity-50"
      >
        <ChevronLeft className="h-5 w-5 text-gray-800" />
      </button>

      {/* Right Navigation */}
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => api?.scrollNext()}
        onKeyDown={(e) => e.key === 'Enter' && api?.scrollNext()}
        disabled={!loop && !canScrollNext}
        className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-md transition-opacity hover:bg-gray-50 disabled:opacity-50"
      >
        <ChevronRight className="h-5 w-5 text-gray-800" />
      </button>

      <Carousel
        setApi={setApi}
        className="w-full px-12"
        opts={{
          loop,
          align: 'start',
          slidesToScroll: 1,
        }}
      >
        <CarouselContent className="-ml-4">
          {products.map((product, index) => (
            <CarouselItem key={index} className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3">
              <ProductCard product={product} viewDetailsLabel={viewDetailsLabel} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
