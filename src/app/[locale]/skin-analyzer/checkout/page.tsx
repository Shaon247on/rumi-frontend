import { redirect } from '@/i18n/navigation'

// Checkout happens from the cart page.
export default async function LegacyCheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  redirect({ href: '/profile/my-cart', locale })
}
