'use client'

import { cn } from '@/lib/utils'
import { ImageIcon, Upload, X } from 'lucide-react'
import Image from 'next/image'
import type { ChangeEvent, DragEvent } from 'react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Label } from '../ui'

type UploadMediaProps = {
  label?: string
  description?: string
  error?: string
  accept?: string
  multiple?: boolean
  disabled?: boolean
  maxFiles?: number
  files?: File[]
  defaultFiles?: File[]
  onFilesChange?: (files: File[]) => void
  className?: string
  dropzoneClassName?: string
  previewClassName?: string
  name?: string
  id?: string
  ariaLabel?: string
  showPreview?: boolean
}

const isImageFile = (file: File) => file.type.startsWith('image/')

const createPreviewItems = (files: File[]) =>
  files.map((file) => ({
    file,
    previewUrl: URL.createObjectURL(file),
  }))

export const UploadMedia = ({
  label,
  description,
  error,
  accept = 'image/*',
  multiple = true,
  disabled = false,
  maxFiles,
  files,
  defaultFiles = [],
  onFilesChange,
  className,
  dropzoneClassName,
  previewClassName,
  name,
  id,
  ariaLabel,
  showPreview = true,
}: UploadMediaProps) => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const inputRef = useRef<HTMLInputElement>(null)
  const [internalFiles, setInternalFiles] = useState<File[]>(defaultFiles)
  const [isDragging, setIsDragging] = useState(false)

  const selectedFiles = files ?? internalFiles

  const effectiveFiles = useMemo(() => {
    if (!selectedFiles.length) return []
    if (typeof maxFiles === 'number') {
      return selectedFiles.slice(0, maxFiles)
    }
    return selectedFiles
  }, [maxFiles, selectedFiles])

  const previewItems = useMemo(() => createPreviewItems(effectiveFiles), [effectiveFiles])

  useEffect(() => {
    return () => {
      previewItems.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl))
    }
  }, [previewItems])

  const commitFiles = (nextFiles: File[]) => {
    const normalizedFiles = maxFiles ? nextFiles.slice(0, maxFiles) : nextFiles

    if (files === undefined) {
      setInternalFiles(normalizedFiles)
    }

    onFilesChange?.(normalizedFiles)
  }

  const openFilePicker = () => {
    if (disabled) return
    inputRef.current?.click()
  }

  const handleFiles = (incomingFiles: FileList | File[]) => {
    const nextFiles = Array.from(incomingFiles)

    if (!multiple) {
      commitFiles(nextFiles.slice(0, 1))
      return
    }

    commitFiles(nextFiles)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFiles = event.target.files
    if (!nextFiles || nextFiles.length === 0) return

    handleFiles(nextFiles)
    event.target.value = ''
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const droppedFiles = event.dataTransfer.files
    if (!droppedFiles || droppedFiles.length === 0) return

    handleFiles(droppedFiles)
  }

  const handleRemove = (index: number) => {
    const nextFiles = effectiveFiles.filter((_, currentIndex) => currentIndex !== index)
    commitFiles(nextFiles)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {(label || description) && (
        <Label
          htmlFor={inputId}
          className="text-main-button flex items-center gap-2 text-sm font-medium"
        >
          <Upload className="size-4" />
          <span>{label}</span>
        </Label>
      )}

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label={ariaLabel ?? label ?? description ?? 'Upload media'}
        className={cn(
          'border-main-button/30 bg-white',
          'flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 transition-colors',
          'focus-visible:ring-main-button focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          error && 'border-destructive',
          disabled && 'cursor-not-allowed opacity-60',
          isDragging && 'border-main-button bg-main-button/5',
          dropzoneClassName
        )}
        onClick={openFilePicker}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openFilePicker()
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault()
          event.stopPropagation()
          if (!disabled) setIsDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          event.stopPropagation()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setIsDragging(false)
        }}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          onChange={handleChange}
        />

        <Upload className="text-main-button/50 mb-2 size-6" />

        <div className="text-center">
          {label ? <p className="text-main-button text-sm font-medium">{label}</p> : null}
          {description ? <p className="text-main-button/60 mt-1 text-xs">{description}</p> : null}
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {showPreview && previewItems.length > 0 ? (
        <div className={cn('grid gap-3 sm:grid-cols-2 lg:grid-cols-3', previewClassName)}>
          {previewItems.map(({ file, previewUrl }, index) => (
            <div
              key={`${file.name}-${file.lastModified}-${index}`}
              className="border-main-button/15 flex items-start gap-3 rounded-md border bg-white p-3"
            >
              <div className="bg-main-button/5 flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md">
                {isImageFile(file) ? (
                  <Image
                    src={previewUrl}
                    alt={file.name}
                    width={56}
                    height={56}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="text-main-button/50 size-6" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#363739]">{file.name}</p>
                <p className="mt-1 text-xs text-[#666666]">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <button
                type="button"
                className="text-main-button/60 hover:text-main-button rounded-full p-1 transition-colors"
                onClick={(event) => {
                  event.stopPropagation()
                  handleRemove(index)
                }}
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
