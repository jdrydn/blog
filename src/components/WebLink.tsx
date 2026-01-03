import Image, { type ImageProps } from "next/image"
import clsx from "clsx"

const variants = {
  slate: {
    border: 'border-slate-200 hover:border-slate-300',
    title: 'text-slate-800',
    description: 'text-slate-500',
  },
  green: {
    border: 'border-green-200 hover:border-green-300',
    title: 'text-green-800',
    description: 'text-green-500',
  },
  red: {
    border: 'border-red-200 hover:border-red-300',
    title: 'text-red-800',
    description: 'text-red-500',
  },
  blue: {
    border: 'border-blue-200 hover:border-blue-300',
    title: 'text-blue-800',
    description: 'text-blue-500',
  },
  yellow: {
    border: 'border-yellow-200 hover:border-yellow-300',
    title: 'text-yellow-800',
    description: 'text-yellow-500',
  },
  purple: {
    border: 'border-purple-200 hover:border-purple-300',
    title: 'text-purple-800',
    description: 'text-purple-500',
  },
}

export function WebLinkPreview({
  title,
  description,
  href,
  rel,
  className,
  variant = 'slate',
  image,
  icon
}: {
  title: string
  description: string
  href: string
  className?: string
  rel?: string
  variant?: keyof typeof variants
  image?: Pick<ImageProps, 'src' | 'alt'>
  icon?: Pick<ImageProps, 'src' | 'alt'>
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel={rel ?? 'nofollow noopener noreferrer'}
      className={clsx(
        'group block w-full max-w-3xl overflow-hidden rounded-2xl border bg-white not-prose shadow-sm transition hover:shadow',
        variants[variant].border,
        className,
      )}
    >
      <div className="flex min-h-[120px]">
        {/* Left content */}
        <div className="flex flex-1 flex-col min-w-0 gap-2 px-5 py-4">
          <span className={clsx('text-[18px] font-semibold leading-snug line-clamp-1', variants[variant].title)}>
            {title}
          </span>

          {description ? (
            <p className={clsx('text-[15px] leading-snug', variants[variant].description)}>
              {description}
            </p>
          ) : null}

          <div className="mt-auto flex items-center gap-2">
            {icon && (
              <Image
                src={icon.src}
                alt={icon.alt}
                className="h-5 w-5 flex-none rounded-sm"
                loading="lazy"
              />
            )}

            <span className={clsx('min-w-0 truncate text-[15px]', variants[variant].title)}>
              {href.replace(/^http(s)?:\/\//, '').replace(/^www./, '')}
            </span>
          </div>
        </div>

        {/* Right image */}
        {image && (
          <div className="relative w-[36%] min-w-[220px] max-w-[340px] flex-none">
            <Image
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {/* soften the seam like many embeds do */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/70 to-transparent" />
          </div>
        )}
      </div>
    </a>
  )
}
