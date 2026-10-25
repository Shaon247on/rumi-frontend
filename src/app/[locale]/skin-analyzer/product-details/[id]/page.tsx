'use client'

import { useProduct } from '@/api/api-hooks/product.api-hook'
import { useParams } from 'next/navigation'
import { RelatedProductsFromProductDetails } from './related-products'
import SingleProductDetails from './single-product-details'

const ProductDetailsPage = () => {
  const params = useParams<{ id?: string | string[] }>()

  const rawProductId = params?.id
  const productId = Array.isArray(rawProductId) ? rawProductId[0] : rawProductId
  const normalizedProductId = productId?.trim() || undefined

  const productAction = useProduct(normalizedProductId)

  return (
    <>
      <SingleProductDetails
        normalizedProductId={normalizedProductId}
        productAction={productAction}
      />
      <RelatedProductsFromProductDetails relatedProducts={productAction.data?.related_products} />
    </>
  )
}

export default ProductDetailsPage
