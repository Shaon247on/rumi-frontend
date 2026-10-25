import logoCompact from '@/assets/image/logo-compact.svg'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { ArrowLeft, Home } from 'lucide-react'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="bg-background mx-auto max-w-7xl">
      <div className="relative flex min-h-screen flex-col items-center justify-center py-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a2e1a_1px,transparent_1px)] bg-size-[24px_24px]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex w-full max-w-2xl flex-col items-center px-6 text-center">
          {/* Logo */}
          <div className="mb-8">
            <Image src={logoCompact} alt="Glowmi Logo" className="h-auto w-32" priority />
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* 404 Number */}
            <p className={`text-main-button/20 text-9xl font-normal`}>404</p>

            {/* Title */}
            <h1 className={`text-main-button text-4xl font-normal italic sm:text-5xl`}>
              Page Not Found
            </h1>

            {/* Description */}
            <p
              className={`text-main-primary-base_medium mx-auto max-w-lg text-base leading-relaxed sm:text-lg`}
            >
              Oops! The page you&apos;re looking for seems to have wandered off. Let&apos;s get you
              back on track to your skincare journey.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href={{ pathname: '/' }}>
                <Button className={`h-12 rounded-full px-8 text-base font-semibold`}>
                  <Home className="mr-2 size-4" />
                  Back to Home
                </Button>
              </Link>
            </div>

            {/* Back Link */}
            <div className="mt-8">
              <Link
                href={{ pathname: '/' }}
                className={`text-main-button inline-flex items-center gap-2 text-base font-medium transition-opacity hover:opacity-70`}
              >
                <ArrowLeft className="size-4" />
                Go back
              </Link>
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
        <div className="absolute right-0 bottom-8 left-0">
          <p className={`text-main-primary-base_medium text-center text-sm`}>
            The Essence of Timeless Glow
          </p>
        </div>
      </div>
    </div>
  )
}
