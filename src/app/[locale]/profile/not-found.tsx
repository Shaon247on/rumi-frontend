import { Button } from '@/components/ui'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

const ProfileNotFound = async () => {
  const t = await getTranslations('profile.notFound')

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center py-12 text-center">
      <h2 className="text-main-button text-4xl font-normal">{t('title')}</h2>
      <p className="text-main-button/70 mt-3 text-sm">{t('description')}</p>
      <Link href="/profile">
        <Button className="bg-main-button hover:bg-main-button/90 mt-6 text-white">
          {t('backButton')}
        </Button>
      </Link>
    </div>
  )
}

export default ProfileNotFound
