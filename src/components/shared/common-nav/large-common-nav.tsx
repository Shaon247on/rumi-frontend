'use client'

import { useLogout } from '@/api/api-hooks/auth.api-hook'
import newLogo from '@/assets/GLOWMI-logo.svg'
import placeholderImg from '@/assets/image/default-avatar.png'
import { LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { LanguageToggle } from '../language-toggle'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'

export const LargeCommonNav = () => {
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const { push } = useRouter()
  const { mutateAsync: logout } = useLogout()

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      clearAuth()
      push('/login')
    }
  }

  return (
    <header className="hidden w-full bg-white lg:block">
      <div className="container mx-auto px-4">
        <div className="flex min-h-[110px] items-center justify-between">
          <Link href="/" className="shrink-0">
            <Image
              src={newLogo}
              alt="GLOWMI"
              width={400}
              height={120}
              className="h-auto w-40"
              loading="eager"
            />
          </Link>

          <div className="flex items-center gap-5">
            <LanguageToggle />

            <div className="size-11 overflow-hidden rounded-full">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className={'m-0.5 size-8 rounded-full border border-red-400/40'}>
                    <AvatarImage src={user?.image || placeholderImg.src} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => push('/profile')}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center" onClick={handleLogout}>
                      <LogOut className="size-4 text-red-600" strokeWidth={1.9} />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
