'use client'

import React, { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Captured by Next.js Global Error Boundary:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="m-0 flex min-h-screen items-center justify-center bg-[#f5f4f3] p-6 font-sans text-[#1a2e1a]">
        <div className="w-full max-w-md space-y-6 text-center">
          {/* Brand/Logo Placeholder */}
          <div className="text-2xl font-bold tracking-widest text-[#1a2e1a] uppercase">GLOWMI</div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="m-0 font-serif text-3xl italic">Critical system error</h1>
            <h2 className="m-0 font-serif text-2xl italic" dir="rtl">
              خطأ جسيم في النظام
            </h2>
          </div>

          {/* Message */}
          <div className="space-y-4 text-sm leading-relaxed text-[#1a2e1a]/80">
            <p>
              An unexpected critical error has occurred. We apologize for the interruption. Please
              try refreshing or returning home.
            </p>
            <p dir="rtl">
              حدث خطأ فني غير متوقع. نعتذر عن هذا الخلل. يرجى محاولة تحديث الصفحة أو العودة إلى
              الصفحة الرئيسية.
            </p>
          </div>

          {/* Error Message Details (For debugging/admin) */}
          {error?.message && (
            <div className="max-h-32 overflow-auto rounded border border-black/10 bg-black/5 p-4 text-left font-mono text-xs">
              <span className="font-semibold text-red-700">Error: </span>
              {error.message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
            <button
              onClick={() => reset()}
              className="h-12 cursor-pointer rounded-full border-none bg-[#1a2e1a] px-6 text-sm font-semibold text-[#f5f4f3] transition-opacity hover:opacity-90"
            >
              Try Again / حاول مجدداً
            </button>
            <button
              onClick={() => {
                window.location.href = '/'
              }}
              className="h-12 cursor-pointer rounded-full border border-solid border-[#1a2e1a] bg-transparent px-6 text-sm font-semibold text-[#1a2e1a] transition-colors hover:bg-[#1a2e1a]/5"
            >
              Go Home / الرئيسية
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
