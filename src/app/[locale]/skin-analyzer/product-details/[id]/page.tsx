import { redirect } from '@/i18n/navigation'

// Product pages now live at /products/[id]; keep old links working.
export default async function LegacyProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  redirect({ href: `/products/${id}`, locale })
}
