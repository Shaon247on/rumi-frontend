import { CommonNav } from '@/components/shared'
import { NewFooter } from '@/components/shared/new-footer'
import React from 'react'

const ProductDetailsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <CommonNav />
      {children}
      <NewFooter className="mt-20! px-20!" />
    </>
  )
}

export default ProductDetailsLayout
