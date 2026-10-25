/**
 * ProductStatusBadge — shared across EN and AR locales.
 *
 * Badge system rules (locked):
 * - Priority order (enforced in data layer — only one badge key per product):
 *   1. limited-edition  2. award-winning  3. best-seller
 *   4. dermatologist-developed  5. ai-recommended  6. clinically-tested
 * - Only ONE badge label renders per card, ever.
 * - Typography: 11px, #9A9A9A, weight 400, no background, no border, no pill.
 *   EN → tracking-[0.1em] | AR → letter-spacing: 0 (global CSS rule)
 * - Position: flex justify-between row. Category at inline-start, badge at
 *   inline-end. RTL mirrors this automatically via CSS direction — no bespoke
 *   RTL logic needed.
 *
 * Usage:
 *   <ProductStatusBadge
 *     category={t(`categories.${p.category}`)}
 *     badge={badge}     ← already-resolved localized string (t(`catalog.${id}.badge`))
 *     isArabic={isAR}
 *   />
 */

interface ProductStatusBadgeProps {
  /** Localized category label (e.g. "SERUMS" / "السيروم") */
  category: string | null
  /**
   * Already-localized badge display string.
   * Resolved by the caller via t(`catalog.${p.id}.badge`).
   * Keeping resolution outside this component ensures the component
   * is purely presentational with no translation dependency.
   */
  badge?: string | null
  /** Whether the current locale is Arabic */
  isArabic?: boolean
}

export function ProductStatusBadge({ category, badge, isArabic = false }: ProductStatusBadgeProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      {/* Category label — inline-start edge */}
      {category ? (
        <span
          className={[
            'text-[11px] font-medium text-[#9A8F87] uppercase',
            isArabic ? '' : 'tracking-[0.18em]',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {category}
        </span>
      ) : (
        <span />
      )}

      {/* Badge label — inline-end edge.
          Visual position: right in LTR, left in RTL — mirrors automatically. */}
      {badge ? (
        <span
          className={[
            'shrink-0 text-[11px] font-normal text-[#9A9A9A]',
            isArabic ? '' : 'tracking-[0.1em]',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {badge}
        </span>
      ) : null}
    </div>
  )
}
