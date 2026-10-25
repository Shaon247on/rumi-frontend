import type { Product } from '@/api/query-list/product.query'
import notImage from '@/assets/image/no-image-placeholder.svg'
import Image from 'next/image'
import Link from 'next/link'

interface Props extends React.ComponentProps<'div'> {
  product: Product
  viewDetailsLabel: string
}

export const ProductCard = ({ product, viewDetailsLabel }: Props) => {
  const productImage = product.images?.[0]?.image || notImage
  const category = product.category_name?.trim() || null
  const subtitle = product.sub_title?.trim() || null
  const benefits = product.key_benefits?.trim() || null
  const skinType = product.skin_type?.trim() || null
  const size = product.size?.trim() || null
  const price = formatCurrency(product.price)
  const discount = getDiscountPrice(product.price, product.discount)
  const hasDiscount = discount !== null
  const displayPrice = hasDiscount ? discount : price

  return (
    <div className="group flex h-full flex-col">
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#f7f5f1]">
        <Image
          src={productImage}
          alt={getProductImageAlt(product)}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-5 transition duration-300 group-hover:scale-[1.02]"
        />
        {category ? (
          <span className="absolute top-3 left-3 rounded-full bg-white/92 px-3 py-1 text-[11px] font-medium tracking-[0.12em] text-[#1a2e1a] uppercase shadow-sm">
            {category}
          </span>
        ) : null}
      </div>

      {/* Product Info */}
      <div className="mt-4 flex grow flex-col">
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-lg leading-tight font-semibold text-[#1f2933]">
            {product.title}
          </h3>
          {subtitle ? <p className="text-sm text-[#6f6c67]">{subtitle}</p> : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          {skinType ? (
            <span className="rounded-full bg-[#eef3ec] px-3 py-1 font-medium text-[#305437] capitalize">
              {skinType}
            </span>
          ) : null}
          {size ? (
            <span className="rounded-full border border-[#ded9d2] px-3 py-1 font-medium text-[#6b6257]">
              {size}
            </span>
          ) : null}
        </div>

        {benefits ? (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#56534f]">{benefits}</p>
        ) : null}

        <div className="mt-5 flex items-end gap-2">
          <span className="text-xl font-semibold text-[#1a2e1a]">{displayPrice}</span>
          {hasDiscount && price ? (
            <span className="text-sm text-[#8d877f] line-through">{price}</span>
          ) : null}
        </div>
      </div>

      {/* View Details Button */}
      <Link
        href={`/skin-analyzer/product-details/${product.id}`}
        className="mt-5 w-full rounded-xl border border-[#1a2e1a] bg-transparent py-3 text-center text-sm font-medium text-[#1a2e1a] transition-colors hover:bg-[#1a2e1a] hover:text-white"
      >
        {viewDetailsLabel}
      </Link>
    </div>
  )
}

const formatCurrency = (value?: string | null) => {
  const amount = Number(value)

  if (!Number.isFinite(amount) || amount <= 0) {
    return null
  }

  return `SAR ${amount.toFixed(2)}`
}

const getDiscountPrice = (price?: string | null, discount?: string | null) => {
  const parsedPrice = Number(price)
  const parsedDiscount = Number(discount)

  if (!Number.isFinite(parsedPrice) || !Number.isFinite(parsedDiscount) || parsedDiscount <= 0) {
    return null
  }

  if (parsedDiscount >= parsedPrice) {
    return null
  }

  return `SAR ${parsedDiscount.toFixed(2)}`
}

const getProductImageAlt = (product: Product) => {
  const category = product.category_name?.trim()
  return category ? `${product.title} from ${category}` : product.title
}
