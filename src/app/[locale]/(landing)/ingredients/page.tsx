import ingredientsBg from '@/assets/image/ingredients-bg.jpg'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

const Ingredients = async () => {
  const t = await getTranslations('ingredients')

  return (
    <main>
      <div className="relative">
        <Image
          src={ingredientsBg}
          alt="Background"
          className="z-50 h-screen w-full object-cover"
          priority
          quality={100}
        />
        <h1 className="text-main-button absolute bottom-10 left-20 text-5xl leading-none font-normal tracking-normal">
          {t('title1')} <br /> {t('title2')}
        </h1>
      </div>

      <div className="bg-main-primary-base_medium mt-32 h-0.5"></div>
    </main>
  )
}

export default Ingredients
