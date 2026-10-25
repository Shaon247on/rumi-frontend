import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'

const ProfilePage = async () => {
  const t = await getTranslations('profile.overview')

  return (
    <Card className="border-main-button/30 bg-background-secondary">
      <CardHeader>
        <CardTitle className="text-main-primary-base_light text-3xl font-normal">
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="text-main-primary-base_light text-base font-normal">{t('skinType')}</p>
            <p className="text-main-secondary">{t('skinTypeValue')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-main-primary-base_light text-base font-normal">
              {t('primaryConcerns')}
            </p>
            <p className="text-main-secondary text-base">{t('primaryConcernsValue')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfilePage
