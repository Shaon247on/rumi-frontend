'use client'

import { cn } from '@/lib/utils'
import { ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { motion } from 'motion/react'
import Image, { StaticImageData } from 'next/image'
import { useState } from 'react'

interface ProductPurchaseProps {
  title: string
  volume?: string
  price: string
  compareAtPrice?: string
  tagline?: string
  eyebrow?: string
  badge?: string
  quantityLabel: string
  addToBag: string
  addingToBag: string
  addedToBag: string
  outOfStockLabel: string
  shippingNote: string
  testedNote: string
  images: (StaticImageData | string)[]
  /** Units available; 0 means out of stock */
  stock: number
  onAddToBag: (quantity: number) => Promise<boolean>
  isAR?: boolean
}

export function ProductPurchase({
  title,
  volume,
  price,
  compareAtPrice,
  tagline,
  eyebrow,
  badge,
  quantityLabel,
  addToBag,
  addingToBag,
  addedToBag,
  outOfStockLabel,
  shippingNote,
  testedNote,
  images,
  stock,
  onAddToBag,
  isAR,
}: ProductPurchaseProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const isOutOfStock = stock <= 0
  const maxQuantity = Math.max(1, stock)

  const handleAdd = async () => {
    if (isOutOfStock || isAdding) return

    setIsAdding(true)
    const added = await onAddToBag(quantity)
    setIsAdding(false)

    if (added) {
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 3000)
    }
  }

  const mainImage = images[activeImage] ?? images[0]

  return (
    <section
      id="purchase-section"
      className={cn(
        'relative flex w-full items-center justify-center bg-ivory px-4 pt-8 pb-16 sm:px-6 md:px-12 md:pt-10 md:pb-24 lg:px-24',
        isAR ? 'font-arabic rtl' : 'ltr font-sans'
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-10 lg:flex-row lg:gap-20">
        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex-1"
        >
          <div className="group relative flex aspect-4/5 w-full items-center justify-center overflow-hidden border-[0.5px] border-[#E6DFD5] bg-linear-to-b from-white to-ivory/50 p-8 shadow-[0_10px_40px_rgba(26,25,24,0.02)] md:p-12">
            {mainImage ? (
              <div className="relative h-full w-full">
                <Image
                  src={mainImage}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
              </div>
            ) : null}
            {badge ? (
              <div className="absolute start-6 top-6 z-10">
                <span className="inline-flex items-center gap-2 border-[0.5px] border-[#E6DFD5]/50 bg-white/80 px-4 py-2 text-[10px] font-medium tracking-[0.25em] text-[#8C8275] uppercase backdrop-blur-md">
                  <Sparkles className="size-3 text-gold" />
                  <span>{badge}</span>
                </span>
              </div>
            ) : null}
          </div>

          {images.length > 1 ? (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={typeof image === 'string' ? image : image.src}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`${title} ${index + 1}`}
                  className={cn(
                    'relative size-20 shrink-0 border bg-white transition-colors',
                    index === activeImage ? 'border-[#1C1C1A]' : 'border-[#E6DFD5]'
                  )}
                >
                  <Image src={image} alt="" fill sizes="80px" className="object-contain p-2" />
                </button>
              ))}
            </div>
          ) : null}
        </motion.div>

        {/* Purchase card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg flex-1 space-y-8 border-[0.5px] border-[#E6DFD5] bg-white/95 p-6 shadow-[0_10px_50px_rgba(26,25,24,0.03)] sm:p-8 md:p-12 lg:sticky lg:top-40"
        >
          <div>
            {eyebrow ? (
              <span className="mb-2 block text-xs font-medium tracking-[0.3em] text-[#8C8275] uppercase">
                {eyebrow}
              </span>
            ) : null}
            <h1
              className="mb-3 text-4xl font-extralight text-[#1A1918] md:text-5xl"
              style={{
                fontFamily: isAR ? 'var(--font-amiri), serif' : 'var(--font-cormorant-garamond), serif',
              }}
            >
              {title}
            </h1>
            {tagline ? (
              <p className="mb-6 text-base leading-relaxed font-light text-[#5C564E]">{tagline}</p>
            ) : null}

            <div className="flex items-center justify-between gap-4 border-y border-[#E6DFD5] py-4">
              <span className="font-mono text-sm font-semibold tracking-wider text-[#1A1918]">
                {volume}
              </span>
              <div className="flex items-baseline gap-2">
                {compareAtPrice ? (
                  <span className="text-sm text-[#A39B90] line-through">{compareAtPrice}</span>
                ) : null}
                <span className="text-2xl font-semibold text-[#1A1918]">{price}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {!isOutOfStock ? (
              <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-4">
                <span className="text-xs tracking-widest text-[#8C8275] uppercase">
                  {quantityLabel}
                </span>
                <div className="flex items-center gap-6 border border-[#E6DFD5] bg-ivory px-4 py-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    className="px-2 text-xl font-light text-[#8C8275] transition-colors hover:text-[#1A1918] disabled:opacity-40"
                    disabled={quantity <= 1}
                    aria-label="-"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-mono text-base font-medium text-[#1A1918]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))}
                    className="px-2 text-xl font-light text-[#8C8275] transition-colors hover:text-[#1A1918] disabled:opacity-40"
                    disabled={quantity >= maxQuantity}
                    aria-label="+"
                  >
                    +
                  </button>
                </div>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => void handleAdd()}
              disabled={isAdding || isOutOfStock}
              className={cn(
                'w-full cursor-pointer border-[0.5px] border-transparent px-8 py-5 text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-500 disabled:cursor-not-allowed',
                isOutOfStock
                  ? 'bg-[#E6DFD5] text-[#8C8275]'
                  : isAdded
                    ? 'bg-deep-green text-ivory'
                    : 'bg-[#1C1C1A] text-ivory hover:bg-[#2C2A29]'
              )}
            >
              {isOutOfStock
                ? outOfStockLabel
                : isAdding
                  ? addingToBag
                  : isAdded
                    ? addedToBag
                    : addToBag}
            </button>

            <div className="grid grid-cols-1 gap-3 border-t border-[#E6DFD5] pt-6 text-[11px] text-[#8C8275] sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Truck className="size-4 shrink-0 text-gold" strokeWidth={1.25} />
                <span>{shippingNote}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 shrink-0 text-gold" strokeWidth={1.25} />
                <span>{testedNote}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
