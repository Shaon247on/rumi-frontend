import type { AdminProduct } from '@/api/query-list/admin/product-query'
import productFallbackImage from '@/assets/image/no-image-placeholder.svg'
import { Button } from '@/components/ui'
import { DialogTitle } from '@/components/ui/dialog'
import { formatSAR, getProductPricing } from '@/lib/price'
import Image from 'next/image'

const Detail = ({ title, value }: { title: string; value?: string | null }) =>
  value ? (
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-white/80">{value}</p>
    </div>
  ) : null

export const ProductView = ({
  product,
  onEdit,
}: {
  product: AdminProduct
  onEdit: () => void
}) => {
  const { basePrice, finalPrice, hasDiscount } = getProductPricing(product)

  return (
    <div className="bg-dashboard space-y-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left - Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-[#f5f4f3]">
          <Image
            src={product.images[0]?.image || productFallbackImage}
            alt={product.title}
            fill
            unoptimized
            className="object-contain p-8"
          />
        </div>

        {/* Right - Product Details */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <DialogTitle className="text-3xl font-normal text-white lg:text-4xl">
              {product.title}
            </DialogTitle>
            <p className="mt-1 text-sm text-white/70">{product.sub_title}</p>
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-medium text-white">{formatSAR(finalPrice)}</span>
            {hasDiscount ? (
              <span className="text-sm text-white/70 line-through">{formatSAR(basePrice)}</span>
            ) : null}
            <span className="text-sm text-white/60">{product.size}</span>
          </div>

          <p className="text-sm text-white/70">
            {product.stock} in stock · {product.order_count} sold
            {product.sku ? ` · ${product.sku}` : ''}
          </p>

          <Detail title="Description" value={product.description} />
          <Detail title="Skin Type" value={product.skin_type} />
          <Detail title="Key Ingredients" value={product.key_ingredients} />
          <Detail title="Key Benefits" value={product.key_benefits} />
          <Detail title="How to Use" value={product.how_to_use} />

          {/* Edit Button */}
          <div className="pt-4">
            <Button
              type="button"
              className="text-dashboard w-full bg-white hover:bg-white/90 lg:w-auto lg:px-12"
              onClick={onEdit}
            >
              EDIT
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
