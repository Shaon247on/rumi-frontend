'use client'

import { Button } from '@/components/ui'
import { Input } from '@/components/ui/input'
import { type ChatConnectionState, type ChatSendMessagePayload } from '@/components/socket'
import { Camera, Send, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

type AiChatBoxProps = {
  connectionError: string | null
  connectionState: ChatConnectionState
  draft: string
  onDraftChange: (value: string) => void
  onRetry: () => void
  onSend: (message: ChatSendMessagePayload) => Promise<boolean>
}

export const AiChatBox = ({
  connectionError,
  connectionState,
  draft,
  onDraftChange,
  onRetry,
  onSend,
}: AiChatBoxProps) => {
  const t = useTranslations('aiChatAssistant')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  const quickPrompts = [
    t('quickPrompts.buildRoutine'),
    t('quickPrompts.acneProducts'),
    t('quickPrompts.vitaminC'),
    t('quickPrompts.sunscreen'),
    t('quickPrompts.mySkin'),
    t('quickPrompts.sensitive'),
  ]

  const isReady = connectionState === 'connected'
  const canSend = isReady && (Boolean(draft.trim()) || Boolean(selectedPhoto)) && !isSending

  const photoPreviewUrl = useMemo(() => {
    if (!selectedPhoto) {
      return null
    }

    return URL.createObjectURL(selectedPhoto)
  }, [selectedPhoto])

  useEffect(() => {
    if (!photoPreviewUrl) {
      return undefined
    }

    return () => {
      URL.revokeObjectURL(photoPreviewUrl)
    }
  }, [photoPreviewUrl])

  const handlePhotoButtonClick = () => {
    if (!isReady) {
      return
    }

    fileInputRef.current?.click()
  }

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    event.target.value = ''

    if (!file) {
      setSelectedPhoto(null)
      setPhotoError(null)
      return
    }

    if (!file.type.startsWith('image/')) {
      setSelectedPhoto(null)
      setPhotoError(t('validation.imageInvalid'))
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setSelectedPhoto(null)
      setPhotoError(t('validation.imageInvalid'))
      return
    }

    setSelectedPhoto(file)
    setPhotoError(null)
  }

  const handleRemovePhoto = () => {
    setSelectedPhoto(null)
    setPhotoError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSend) {
      return
    }

    setIsSending(true)
    try {
      const didSend = await onSend({ photo: selectedPhoto, text: draft })

      if (didSend) {
        setSelectedPhoto(null)
        setPhotoError(null)
      }
    } finally {
      setIsSending(false)
    }
  }

  const handleQuickPrompt = async (prompt: string) => {
    if (!isReady) {
      return
    }

    setIsSending(true)
    try {
      const didSend = await onSend({ photo: selectedPhoto, text: prompt })

      if (didSend) {
        setSelectedPhoto(null)
        setPhotoError(null)
      }
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl py-4 md:py-5">
      <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="shrink-0 rounded-full border border-[#E6DFD5] bg-white px-4 py-2 text-xs text-[#2B2B2B] transition-colors hover:border-[#1C1C1A]/40 hover:bg-[#F3EFE8] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => void handleQuickPrompt(prompt)}
            disabled={!isReady || isSending}
          >
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-[#D9D2C7] bg-white px-5 py-1.5 transition-colors focus-within:border-[#1C1C1A]/50">
            <Input
              type="text"
              value={draft}
              onChange={(event) => onDraftChange(event.target.value)}
              placeholder={t('inputPlaceholder')}
              className="border-0 bg-transparent px-0 text-sm text-[#1C1C1A] shadow-none outline-none placeholder:text-[#8C8275] focus-visible:ring-0"
              disabled={!isReady}
            />
            <button
              type="button"
              className="text-[#8C8275] transition-colors hover:text-[#1C1C1A] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={t('actions.attach')}
              onClick={handlePhotoButtonClick}
              disabled={!isReady}
            >
              <Camera className="size-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handlePhotoChange}
              aria-label={t('actions.attach')}
            />
          </div>
          <Button
            type="submit"
            className="size-11 shrink-0 rounded-full bg-[#1C1C1A] p-0 hover:bg-[#2C2A29]"
            disabled={!canSend}
            aria-label={t('actions.send')}
          >
            <Send className="size-4 text-ivory rtl:-scale-x-100" />
          </Button>
        </div>

        {photoPreviewUrl ? (
          <div className="flex items-center gap-3 rounded-2xl border border-[#E6DFD5] bg-white px-4 py-3">
            <div className="bg-main-button/5 overflow-hidden rounded-xl">
              <Image
                src={photoPreviewUrl}
                alt={selectedPhoto?.name ?? t('preview.photoAlt')}
                width={72}
                height={72}
                unoptimized
                className="h-16 w-16 object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-main-button truncate text-sm font-medium">
                {selectedPhoto?.name ?? t('preview.photoLabel')}
              </p>
              <p className="text-main-button/60 text-xs">
                {selectedPhoto
                  ? `${(selectedPhoto.size / 1024 / 1024).toFixed(2)} MB`
                  : t('preview.photoLabel')}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="text-main-button/60 hover:text-main-button rounded-full p-2 transition-colors"
              aria-label={t('actions.removeAttachment')}
            >
              <X className="size-4" />
            </button>
          </div>
        ) : null}

        {photoError ? <p className="text-xs text-red-600">{photoError}</p> : null}

        <div className="flex items-center justify-between gap-3 px-2">
          <p className="text-[11px] text-[#8C8275]">{t('disclaimer')}</p>
          {connectionError ? (
            <button
              type="button"
              onClick={onRetry}
              className="text-xs font-medium text-[#1C1C1A] hover:underline"
            >
              {t('actions.retry')}
            </button>
          ) : null}
        </div>
      </form>
    </div>
  )
}
