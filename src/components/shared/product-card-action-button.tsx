'use client'

/**
 * ProductCardActionButton — the single hover affordance on product cards.
 *
 * This replaces both the old "VIEW PRODUCT" overlay AND the "QUICK ADD" bar.
 * Only ONE call-to-action per card, ever.
 *
 * Design spec:
 * - Position: static, in the text block below the image — image is NEVER covered.
 * - Style: 1px solid #2B2B2B, transparent bg, full card width, height 44px.
 * - Typography: 11px, weight 500.
 *   EN: uppercase, letter-spacing 0.15em.
 *   AR: no letter-spacing, no uppercase (global [data-locale="ar"] enforces this).
 * - Visibility:
 *   Mobile — always visible (opacity-100), no hover required.
 *   Desktop — opacity 0 by default, fades to 1 on parent article.group hover, 200ms ease.
 * - Hover fill: bg #2B2B2B, text #FFFFFF, 150ms transition.
 *
 * Usage:
 *   <ProductCardActionButton label={t('addToBag')} isArabic={isAR} onClick={...} />
 */

interface ProductCardActionButtonProps {
  label: string
  isArabic?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onAdd?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function ProductCardActionButton({
  label,
  isArabic = false,
  onClick,
  onAdd,
}: ProductCardActionButtonProps) {
  const handleClick = onClick ?? onAdd

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[
        // Dimensions
        'h-11 w-full',
        // Ghost style
        'border border-[#2B2B2B] bg-transparent',
        // Typography
        'text-[11px] font-medium text-[#2B2B2B]',
        // EN only: uppercase + tracking. AR inherits letter-spacing:0 from global CSS.
        isArabic ? '' : 'tracking-[0.15em] uppercase',
        // Hover: fill to dark with 150ms transition
        'hover:bg-[#2B2B2B] hover:text-white',
        'transition-colors duration-150',
        // Visibility: always on mobile, fade-in on group hover on desktop.
        // The parent <article> must have className="group".
        'opacity-100 sm:opacity-0 sm:group-hover:opacity-100',
        'transition-opacity duration-200',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </button>
  )
}
