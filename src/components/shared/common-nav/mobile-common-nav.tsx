'use client'

import newLogo from '@/assets/GLOWMI-logo.svg'
import placeholderImg from '@/assets/image/placeholder.svg'
import { useLogout } from '@/api/api-hooks/auth.api-hook'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LanguageToggle } from '../language-toggle'
import { useAuthStore } from '@/store/auth.store'
import { Link } from '@/i18n/navigation'
import { LogOut, Menu, User, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'

export const MobileCommonNav = () => {
  const [open, setOpen] = useState(false)
  const { push } = useRouter()
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const { mutateAsync: logout } = useLogout()

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      clearAuth()
      setOpen(false)
      push('/login')
    }
  }

  return (
    <header className="w-full bg-white lg:hidden">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="shrink-0">
            <Image src={newLogo} alt="GLOWMI" width={120} height={35} className="h-auto w-28" />
          </Link>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                aria-label="Open menu"
                className="rounded-full border border-[#E6E1D8] p-2 transition hover:bg-[#f7f5ef]"
              >
                <Menu className="text-main-button size-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96" showCloseButton={false}>
                <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
                  <Image
                    src={newLogo}
                    alt="GLOWMI"
                    width={100}
                    height={30}
                    className="h-auto w-24"
                  />
                  <SheetClose
                    aria-label="Close menu"
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                  >
                    <X className="size-5 text-[#363739]" />
                  </SheetClose>
                </div>

                <div className="px-5 py-6">
                  <div className="flex items-center gap-3 rounded-2xl bg-[#f7f5ef] p-4">
                    <Avatar className="size-12">
                      <AvatarImage src={user?.image || placeholderImg.src} />
                      <AvatarFallback>
                        <User className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#363739]">
                        {user?.full_name || 'Guest'}
                      </p>
                      <p className="truncate text-xs text-[#666666]">{user?.email || ' '}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/5 px-2 py-3">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-[#363739] transition hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    <User className="size-5" />
                    <span className="text-sm font-medium">Profile</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[#b42318] transition hover:bg-red-50"
                  >
                    <LogOut className="size-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
