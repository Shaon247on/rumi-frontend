import wave from '@/assets/icons/wave.svg'
import { cn } from '@/lib/utils'
import Image from 'next/image'

type Props = {
  heading: string
  subHeading?: string
  showWave?: boolean

  // styles
  wrapperClassname?: string
  headingClassName?: string
  subHeadingClassname?: string
}

export const SiteHeading = ({
  heading,
  subHeading,
  wrapperClassname,
  headingClassName,
  subHeadingClassname,
  showWave = false,
}: Props) => {
  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-center gap-6',
        wrapperClassname
      )}
    >
      <h2
        className={cn(
          'text-h2 md:text-h1 text-charcoal text-center font-serif font-light',
          headingClassName
        )}
      >
        {heading}
      </h2>
      {showWave && <Image src={wave} alt="wave" className="w-52" />}

      {subHeading && (
        <h3
          className={cn(
            'text-body-large text-charcoal/70 max-w-2xl text-center font-sans font-light',
            subHeadingClassname
          )}
        >
          {subHeading}
        </h3>
      )}
    </div>
  )
}
