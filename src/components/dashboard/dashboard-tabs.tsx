'use client'

import icon1 from '@/assets/icons/blocks.svg'
import icon7 from '@/assets/icons/carbon_analytics.svg'
import icon9 from '@/assets/icons/members.svg'
import icon3 from '@/assets/icons/notes.svg'
import icon6 from '@/assets/icons/ri_search-ai-line.svg'
import icon8 from '@/assets/icons/settings-light.svg'
import icon4 from '@/assets/icons/shop-bags.svg'
import icon2 from '@/assets/icons/tags.svg'
import icon5 from '@/assets/icons/users.svg'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export const dashboardNavList = [
  { icon: icon1, label: 'Dashboard', href: '/dashboard' },
  { icon: icon2, label: 'Category', href: '/dashboard/category' },
  { icon: icon9, label: 'Member', href: '/dashboard/member' },
  { icon: icon3, label: 'Products', href: '/dashboard/products' },
  { icon: icon4, label: 'Orders', href: '/dashboard/orders' },
  { icon: icon5, label: 'Customer', href: '/dashboard/customer' },
  { icon: icon6, label: 'Analyzers', href: '/dashboard/analyzers' },
  { icon: icon7, label: 'Ai Analytics', href: '/dashboard/ai-analytics' },
  { icon: icon8, label: 'Settings', href: '/dashboard/settings' },
]

// The shared close button is dark by default, which disappears on green
export const greenPanelClassName =
  'bg-dashboard [&_[data-slot$=-close]]:text-white [&_[data-slot$=-close]]:hover:bg-white/10 [&_[data-slot$=-close]]:hover:text-white'

export const DashboardTabs = () => {
  const pathname = usePathname()

  return (
    <div aria-label="tab-list" className="mt-8 mb-10 hidden lg:block">
      <nav className="flex flex-wrap gap-x-5 gap-y-3">
        {dashboardNavList.map((item) => {
          const isActive =
            item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 border-b-2 pb-3 text-xl leading-none font-normal text-[#E6DFC2BF] transition-colors hover:text-[#F8F5EE]',
                isActive ? 'border-[#F8F5EE] text-[#F8F5EE]!' : 'border-transparent'
              )}
            >
              <Image src={item.icon} alt="" className="size-6" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
