type PricedProduct = {
  price?: string | number | null
  discount?: string | number | null
}

/** `discount` is a percentage on the backend (0–100). */
export const getProductPricing = (product: PricedProduct) => {
  const price = Number(product.price)
  const discount = Number(product.discount)
  const basePrice = Number.isFinite(price) ? price : 0
  const hasDiscount = Number.isFinite(discount) && discount > 0 && discount < 100

  return {
    basePrice,
    finalPrice: hasDiscount ? basePrice * (1 - discount / 100) : basePrice,
    discountPercent: hasDiscount ? discount : 0,
    hasDiscount,
  }
}

export const formatSAR = (amount: string | number | null | undefined, locale = 'en') => {
  const value = Number(amount)

  if (!Number.isFinite(value)) {
    return ''
  }

  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 2,
  }).format(value)
}
