'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { RotateCcw, Home } from 'lucide-react'
import logoCompact from '@/assets/image/logo-compact.svg'
import { Button } from '@/components/ui/button'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console
    console.error('Captured by Next.js Locale Error Boundary:', error)
  }, [error])

  return (
    <div className="bg-background mx-auto flex min-h-screen max-w-7xl items-center justify-center">
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center py-16">
        {/* Background Pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a2e1a_1px,transparent_1px)] bg-size-[24px_24px]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex w-full max-w-2xl flex-col items-center px-6 text-center">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src={logoCompact || '/placeholder-logo.png'}
              alt="Glowmi Logo"
              className="h-auto w-32"
              priority
            />
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Title */}
            <h1 className="text-main-button text-3xl font-normal italic sm:text-4xl">
              Something went wrong
            </h1>
            <h2 className="text-main-button dir-rtl font-arabic text-2xl font-normal italic sm:text-3xl">
              حدث خطأ ما
            </h2>

            {/* Description */}
            <div className="text-main-primary-base_medium mx-auto max-w-lg space-y-4 text-sm leading-relaxed sm:text-base">
              <p>
                We apologize for the inconvenience. An unexpected error occurred while loading this
                page. Our team has been notified.
              </p>
              <p className="dir-rtl font-arabic">
                نعتذر عن الإزعاج. حدث خطأ غير متوقع أثناء تحميل هذه الصفحة. لقد تم إخطار فريق الدعم
                لدينا للعمل على إصلاحه.
              </p>
            </div>

            {/* Error Message Details (For debugging/admin) */}
            {error?.message && (
              <div className="bg-muted/50 border-border/50 mx-auto mt-4 max-h-40 max-w-lg overflow-auto rounded-lg border p-4 text-left font-mono text-xs">
                <span className="text-destructive font-semibold">Error: </span>
                {error.message}
                {error.digest && (
                  <div className="text-muted-foreground mt-1">
                    <span className="font-semibold">Digest: </span> {error.digest}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                onClick={() => reset()}
                className="h-12 min-w-[160px] rounded-full px-8 text-base font-semibold"
              >
                <RotateCcw className="mr-2 size-4" />
                Try Again / حاول مجدداً
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = '/'
                }}
                className="border-main-button text-main-button hover:bg-main-button/10 h-12 min-w-[160px] rounded-full px-8 text-base font-semibold"
              >
                <Home className="mr-2 size-4" />
                Go Home / الرئيسية
              </Button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="mt-16 flex gap-2">
            <div className="bg-main-button h-1 w-12 rounded-full opacity-30" />
            <div className="bg-main-button h-1 w-8 rounded-full opacity-50" />
            <div className="bg-main-button h-1 w-12 rounded-full opacity-30" />
          </div>
        </div>

        {/* Footer Tagline */}
        <div className="pointer-events-none absolute right-0 bottom-8 left-0">
          <p className="text-main-primary-base_medium text-center text-sm font-medium">
            GLOWMI AI Skin Intelligence
          </p>
        </div>
      </div>
    </div>
  )
}
