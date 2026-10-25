'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useLocale } from 'next-intl'

interface Option {
  value: string
  label: string
}

interface PremiumSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  className?: string
  ariaLabel?: string
}

export function PremiumSelect({
  options,
  value,
  onChange,
  className,
  ariaLabel,
}: PremiumSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const locale = useLocale()
  const isAr = locale === 'ar'

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentOption = options.find((opt) => opt.value === value) || options[0]

  return (
    <div ref={containerRef} className={cn('relative w-full', className)} dir={isAr ? 'rtl' : 'ltr'}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="premium-select-listbox"
        aria-label={ariaLabel}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-10 w-full cursor-pointer items-center justify-between rounded-none border bg-transparent px-4 py-2 text-start text-sm font-light text-[#2B2B2B] transition-all duration-150 outline-none',
          isOpen
            ? 'border-[#2B2B2B]'
            : 'border-[#E5E2DC] hover:border-[#2B2B2B]/60 focus:border-[#2B2B2B]'
        )}
        style={{
          fontFamily: isAr
            ? 'var(--font-ibm-plex-arabic), sans-serif'
            : 'var(--font-jost), sans-serif',
        }}
      >
        <span className="truncate">{currentOption?.label}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className={cn(
            'h-4 w-4 shrink-0 text-[#7C7A74] transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <ul
          id="premium-select-listbox"
          role="listbox"
          className="absolute top-full right-0 left-0 z-50 mt-1 divide-y divide-[#E5E2DC]/40 overflow-hidden rounded-none border border-[#E5E2DC] bg-[#FAF8F4] shadow-md"
        >
          {options.map((opt) => (
            <li key={opt.value} role="none">
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                className={cn(
                  'h-10 w-full cursor-pointer px-4 py-2.5 text-start text-sm font-light transition-all duration-150',
                  opt.value === value
                    ? 'bg-[#2B2B2B] text-[#FAF8F4]'
                    : 'text-[#2B2B2B] hover:bg-[#2B2B2B]/5'
                )}
                style={{
                  fontFamily: isAr
                    ? 'var(--font-ibm-plex-arabic), sans-serif'
                    : 'var(--font-jost), sans-serif',
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
