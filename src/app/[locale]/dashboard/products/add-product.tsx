'use client'

import { useCategories } from '@/api/api-hooks/category.api-hook'
import {
  useCreateAdminProduct,
  useUpdateAdminProduct,
} from '@/api/api-hooks/admin/product.api-hooks'
import type { AdminProduct } from '@/api/query-list/admin/product-query'
import { Button } from '@/components/ui'
import { DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import { useState } from 'react'
import { useForm, type UseFormRegisterReturn } from 'react-hook-form'
import { z } from 'zod'

const numberText = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .refine((value) => Number(value) >= 0, 'Enter a valid number')

const productSchema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters'),
  subTitle: z.string().trim().min(5, 'Sub title must be at least 5 characters'),
  price: numberText('Price is required'),
  size: z.string().trim().min(2, 'Size is required'),
  discount: z
    .string()
    .trim()
    .refine((value) => Number(value) >= 0 && Number(value) <= 100, 'Discount must be 0 to 100'),
  category: z.string().min(1, 'Category is required'),
  sku: z.string().trim(),
  stock: numberText('Stock is required'),
  keyIngredients: z.string().trim().min(10, 'Key ingredients must be at least 10 characters'),
  skinType: z.string().min(1, 'Skin type is required'),
  keyBenefits: z.string().trim().min(10, 'Key benefits must be at least 10 characters'),
  description: z.string().trim().min(20, 'Description must be at least 20 characters'),
  howToUse: z.string().trim().min(10, 'How to use must be at least 10 characters'),
})

type ProductFormData = z.infer<typeof productSchema>

const SKIN_TYPES = ['oily', 'dry', 'normal', 'combination', 'sensitive']

const labelClassName = 'text-sm font-medium text-white'
const inputClassName = 'text-dashboard border-0 bg-[#F8F5EE]'

const Field = ({
  label,
  placeholder,
  error,
  registration,
}: {
  label: string
  placeholder: string
  error?: string
  registration: UseFormRegisterReturn
}) => (
  <div className="space-y-1.5">
    <label htmlFor={registration.name} className={labelClassName}>
      {label}
    </label>
    <Input
      id={registration.name}
      placeholder={placeholder}
      className={inputClassName}
      {...registration}
    />
    {error ? <p className="text-sm text-red-300">{error}</p> : null}
  </div>
)

const TextField = ({
  label,
  placeholder,
  error,
  registration,
}: {
  label: string
  placeholder: string
  error?: string
  registration: UseFormRegisterReturn
}) => (
  <div className="space-y-1.5">
    <label htmlFor={registration.name} className={labelClassName}>
      {label}
    </label>
    <Textarea
      id={registration.name}
      placeholder={placeholder}
      className={`min-h-[100px] resize-none ${inputClassName}`}
      {...registration}
    />
    {error ? <p className="text-sm text-red-300">{error}</p> : null}
  </div>
)

export const AddProduct = ({ product, onDone }: { product?: AdminProduct; onDone: () => void }) => {
  const { data: categories } = useCategories()
  const { mutateAsync: createProduct } = useCreateAdminProduct()
  const { mutateAsync: updateProduct } = useUpdateAdminProduct()
  const [images, setImages] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    values: {
      title: product?.title ?? '',
      subTitle: product?.sub_title ?? '',
      price: product?.price ?? '',
      size: product?.size ?? '',
      discount: product?.discount ?? '0',
      // Wait for the list so the select can show the saved category
      category: product && categories ? String(product.category) : '',
      sku: product?.sku ?? '',
      stock: product ? String(product.stock) : '',
      keyIngredients: product?.key_ingredients ?? '',
      skinType: product?.skin_type ?? '',
      keyBenefits: product?.key_benefits ?? '',
      description: product?.description ?? '',
      howToUse: product?.how_to_use ?? '',
    },
    resetOptions: { keepDirtyValues: true },
  })

  const onSubmit = async (data: ProductFormData) => {
    const payload = {
      title: data.title,
      sub_title: data.subTitle,
      price: data.price,
      size: data.size,
      discount: data.discount || '0',
      category: Number(data.category),
      sku: data.sku,
      stock: Number(data.stock),
      key_ingredients: data.keyIngredients,
      skin_type: data.skinType,
      key_benefits: data.keyBenefits,
      description: data.description,
      how_to_use: data.howToUse,
      images,
    }

    try {
      await (product ? updateProduct({ id: product.id, data: payload }) : createProduct(payload))
      onDone()
    } catch {
      // The mutation hook already shows the error toast
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <DialogTitle className="text-2xl font-medium text-white">
          {product ? 'Edit Product' : 'Add Products'}
        </DialogTitle>
        <p className="text-sm text-white/60">
          Listing your product with clear details with this module
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field
          label="Title"
          placeholder="Write the title"
          error={errors.title?.message}
          registration={register('title')}
        />
        <Field
          label="Sub Title"
          placeholder="Write the sub title"
          error={errors.subTitle?.message}
          registration={register('subTitle')}
        />
        <Field
          label="Price"
          placeholder="Write the price"
          error={errors.price?.message}
          registration={register('price')}
        />
        <Field
          label="Size(ml)"
          placeholder="30ml"
          error={errors.size?.message}
          registration={register('size')}
        />
        <Field
          label="Discount(%)"
          placeholder="Enter a discount"
          error={errors.discount?.message}
          registration={register('discount')}
        />

        <div className="space-y-1.5">
          <label htmlFor="category" className={labelClassName}>
            Category
          </label>
          <select
            id="category"
            className={`h-9 w-full rounded-md px-3 text-sm ${inputClassName}`}
            {...register('category')}
          >
            <option value="">Select category</option>
            {(categories ?? []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category ? <p className="text-sm text-red-300">{errors.category.message}</p> : null}
        </div>

        <Field
          label="Product ID (SKU, optional)"
          placeholder="Write the product id"
          error={errors.sku?.message}
          registration={register('sku')}
        />
        <Field
          label="Stock"
          placeholder="10"
          error={errors.stock?.message}
          registration={register('stock')}
        />

        <TextField
          label="Key Ingredients"
          placeholder="Write the ingredients, separated by commas"
          error={errors.keyIngredients?.message}
          registration={register('keyIngredients')}
        />

        <div className="space-y-1.5">
          <label htmlFor="skinType" className={labelClassName}>
            Skin Type
          </label>
          <select
            id="skinType"
            className={`h-9 w-full rounded-md px-3 text-sm capitalize ${inputClassName}`}
            {...register('skinType')}
          >
            <option value="">Select skin type</option>
            {SKIN_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.skinType ? <p className="text-sm text-red-300">{errors.skinType.message}</p> : null}
        </div>

        <TextField
          label="Key Benefits"
          placeholder="Write the benefits, separated by commas"
          error={errors.keyBenefits?.message}
          registration={register('keyBenefits')}
        />
        <TextField
          label="Description"
          placeholder="Write about the product"
          error={errors.description?.message}
          registration={register('description')}
        />
        <TextField
          label="How to use"
          placeholder="Write how to use it"
          error={errors.howToUse?.message}
          registration={register('howToUse')}
        />

        {/* Image upload */}
        <div className="space-y-1.5">
          <span className={labelClassName}>Images</span>
          <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/30 bg-[#F8F5EE] hover:border-white/50">
            <Upload className="text-dashboard size-8" />
            <p className="text-dashboard/80 mt-2 px-4 text-center text-sm">
              {images.length > 0 ? (
                `${images.length} image(s) selected`
              ) : (
                <>
                  Drop your images here or{' '}
                  <span className="text-dashboard">click to browse</span>
                </>
              )}
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              aria-label="Product images"
              onChange={(event) => setImages(Array.from(event.target.files ?? []))}
            />
          </label>
          {product && images.length > 0 ? (
            <p className="text-xs text-white/60">These replace the current product images.</p>
          ) : null}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="text-dashboard bg-white px-8 hover:bg-white/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'SAVING...' : product ? 'SAVE CHANGES' : 'ADD PRODUCT'}
          </Button>
        </div>
      </form>
    </div>
  )
}
