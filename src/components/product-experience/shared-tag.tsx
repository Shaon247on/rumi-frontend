'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface BrandTagProps {
  label: string
  className?: string
}

export function BrandTag({ label, className }: BrandTagProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-none border border-[#E6DFD5] bg-transparent px-4 py-2 font-mono text-xs font-medium tracking-[0.1em] text-[#1A1918] uppercase shadow-none transition-all duration-300 hover:border-[#9F8A6B]',
        className
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-[#9F8A6B]" />
      <span>{label}</span>
    </div>
  )
}
