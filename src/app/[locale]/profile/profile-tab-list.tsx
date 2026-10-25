'use client'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

import { Heart, LayoutGrid, Package, Settings, ShoppingBag } from 'lucide-react'
const tabsLists = [
  { id: 1, icon: LayoutGrid, label: 'Overview', href: '/profile' },
  { id: 2, icon: Heart, label: 'Save Routine', href: '/profile/save-routine' },
  { id: 3, icon: ShoppingBag, label: 'My Cart', href: '/profile/my-cart' },
  { id: 4, icon: Package, label: 'Order History', href: '/profile/order-history' },
  { id: 5, icon: Settings, label: 'Settings', href: '/profile/settings' },
]

export const ProfileTabList = () => {
  const pathname = usePathname()

  const isActive = (href: string) => {
    // Remove locale prefix from pathname (e.g., /en/profile -> /profile)
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '')

    if (href === '/profile') {
      return pathWithoutLocale === '/profile'
    }
    return pathWithoutLocale.startsWith(href)
  }

  return (
    <div aria-label="tab-list" className="mt-8 mb-10 border-b border-gray-300">
      <nav className="flex gap-8">
        {tabsLists.map((tab) => (
          <Link
            key={tab.id}
            href={{ pathname: tab.href }}
            className={cn(
              'text-main-button hover:text-main-button/80 flex items-center gap-2 border-b-2 pb-3 text-2xl leading-none font-normal transition-colors',
              isActive(tab.href) ? 'border-main-button' : 'border-transparent'
            )}
          >
            <tab.icon className="size-6" />
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
