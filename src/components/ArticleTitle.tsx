import clsx from 'clsx'
import Image, { type ImageProps } from 'next/image'

export function ArticleTitle({
  title,
  icon,
  alt = '',
  size = 40,
  className,
}: {
  title: string
  icon: ImageProps['src'],
  alt?: ImageProps['alt'],
  size?: number,
  className?: string,
}) {
  return (
    <h1 className={clsx('flex flex-row flex-wrap gap-2 justify-start items-center', className)}>
      <Image src={icon} alt={alt} height={size} width={size} />
      {title}
    </h1>
  )
}
