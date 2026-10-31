'use client'

import { useLogout } from '@/api/api-hooks/auth.api-hook'
import { useRouter } from '@/i18n/navigation'
import logoLight from '@/assets/icons/logo-light.png'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Link } from '@/i18n/navigation'
import { useAuthStore } from '@/store/auth.store'
import { LogOut, Menu, UserRound } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { dashboardNavList, greenPanelClassName } from './dashboard-tabs'

const Avatar = ({ size, image, name }: { size: string; image?: string | null; name: string }) => (
  <div
    className={`relative flex items-center justify-center overflow-hidden rounded-full bg-[#f5f4f3] ${size}`}
  >
    {image ? (
      <Image src={image} alt={name} fill unoptimized className="object-cover" />
    ) : (
      <UserRound className="text-dashboard size-5" />
    )}
  </div>
)

export const DashboardNav = () => {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const { mutateAsync: logout } = useLogout()
  const name = user?.full_name || 'Admin'

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // The session is cleared locally even if the server call fails
    }
    clearAuth()
    router.push('/login')
  }

  return (
    <header className="bg-dashboard flex items-center justify-between border-b-2 border-white/40 px-4 py-4 text-white lg:px-20">
      {/* Logo and tagline */}
      <div className="flex flex-col gap-1 lg:gap-3">
        <Link href="/dashboard">
          <Image src={logoLight} alt="Logo" className="max-w-24 lg:max-w-none" />
        </Link>
        <p className="hidden text-sm text-white/60 lg:ml-10 lg:block">
          Monitor user interactions and skincare analytics
        </p>
      </div>

      {/* Desktop - Avatar and Logout */}
      <div className="hidden items-center gap-4 lg:flex">
        <Avatar size="size-10" image={user?.image} name={name} />
        <button
          type="button"
          aria-label="Logout"
          className="text-white/70 hover:text-white"
          onClick={() => void handleLogout()}
        >
          <LogOut className="size-5" />
        </button>
      </div>

      {/* Mobile - Sheet Menu */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger aria-label="Open menu">
            <Menu className="size-6 text-white" />
          </SheetTrigger>
          <SheetContent side="right" className={cn(greenPanelClassName, 'w-64 border-white/20')}>
            <div className="flex flex-col gap-6 px-4 pt-8">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <Avatar size="size-12" image={user?.image} name={name} />
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{name}</p>
                  <p className="truncate text-sm text-white/60">{user?.email}</p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1">
                {dashboardNavList.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Image src={item.icon} alt="" className="size-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Logout */}
              <button
                type="button"
                className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                onClick={() => void handleLogout()}
              >
                <LogOut className="size-5" />
                <span>Logout</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
