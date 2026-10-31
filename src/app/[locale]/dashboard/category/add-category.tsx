'use client'

import {
  useCreateAdminCategory,
  useUpdateAdminCategory,
} from '@/api/api-hooks/admin/category.api-hooks'
import type { AdminCategory } from '@/api/query-list/admin/category-query'
import { Button, DialogHeader, DialogTitle, Input } from '@/components/ui'
import { Upload } from 'lucide-react'
import Image from 'next/image'
import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'

export const AddCategory = ({
  category,
  onDone,
}: {
  category?: AdminCategory
  onDone: () => void
}) => {
  const [name, setName] = useState(category?.name ?? '')
  const [image, setImage] = useState<File | undefined>()
  const [error, setError] = useState('')
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateAdminCategory()
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateAdminCategory()
  const isPending = isCreating || isUpdating

  const preview = useMemo(
    () => (image ? URL.createObjectURL(image) : category?.image),
    [category?.image, image]
  )

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (name.trim().length < 2) {
      setError('Category name must be at least 2 characters')
      return
    }

    try {
      const data = { name: name.trim(), image }
      await (category ? updateCategory({ id: category.id, data }) : createCategory(data))
      onDone()
    } catch {
      // The mutation hook already shows the error toast
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-normal">
          {category ? 'Edit Category' : 'Add Category'}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-6 py-4">
        <div className="grid grid-cols-[120px_1fr] items-start gap-4">
          <label htmlFor="category-name" className="pt-3 text-right text-sm">
            Category
          </label>
          <div>
            <Input
              id="category-name"
              placeholder="Category name"
              className="h-12"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setError('')
              }}
            />
            {error ? <p className="text-destructive mt-1 text-sm">{error}</p> : null}
          </div>
        </div>
        <div className="grid grid-cols-[120px_1fr] items-start gap-4">
          <span className="pt-2 text-right text-sm">Images</span>
          <label className="relative flex h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400">
            {preview ? (
              <Image src={preview} alt="" fill unoptimized className="object-contain p-2" />
            ) : (
              <>
                <Upload className="text-main-button size-8" />
                <p className="text-muted-foreground mt-2 px-4 text-center text-sm">
                  Drop your image here or{' '}
                  <span className="text-main-button">click to browse</span>
                </p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              aria-label="Category image"
              onChange={(event) => setImage(event.target.files?.[0])}
            />
          </label>
        </div>
        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
          <span />
          <Button
            type="submit"
            className="bg-main-button hover:bg-main-button/90 w-32 text-white"
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </>
  )
}
