import clsx from "clsx"
import Image, { type ImageProps } from "next/image"
import path from "node:path"

import { getLinkPreview } from "@/lib/server/link-preview";

const variants = {
  slate: {
    border: 'border-slate-200 hover:border-slate-300',
    title: 'text-slate-800',
    description: 'text-slate-500',
  },
  gray: {
    border: 'border-gray-200 hover:border-gray-300',
    title: 'text-gray-800',
    description: 'text-gray-500',
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

export interface WebLinkPreviewProps {
  href: string
  title?: string
  description?: string | false
  className?: string
  rel?: string
  variant?: keyof typeof variants
  image?: Pick<ImageProps, 'src' | 'alt'> | false
  icon?: Pick<ImageProps, 'src' | 'alt'> | false
}

export async function WebLinkFetchBlock({
  href,
  dirname,
  filename,
  title,
  description,
  rel,
  className,
  variant = 'slate',
  image,
  icon,
}: {
  href: WebLinkPreviewProps['href']
  dirname: string
  filename: string
  title?: WebLinkPreviewProps['title']
  description?: WebLinkPreviewProps['description']
  className?: WebLinkPreviewProps['className']
  rel?: WebLinkPreviewProps['rel']
  variant?: WebLinkPreviewProps['variant']
  image?: false
  icon?: false
}) {
  const preview = await getLinkPreview(href, path.join(dirname.replace('/.next/server/', '/src/'), filename))

  return (
    <WebLinkPreviewBlock
      href={href}
      title={title ?? preview?.title}
      description={description ?? preview?.description}
      image={image ?? (preview?.image ? { src: preview.image, alt: preview.title ?? '' } : undefined)}
      icon={icon ?? (preview?.favicon ? { src: preview.favicon, alt: preview.siteName ?? '' } : undefined)}
      className={className} rel={rel} variant={variant} />
  )
}

export function getSocialLinkIcon(src: string): WebLinkPreviewProps['icon'] {
  switch (src) {
    case 'GITHUB': return { src: '/link-icons/github.svg', alt: 'GitHub' }
    case 'NPM': return { src: '/link-icons/npm.png', alt: 'NPM' }
    default: return undefined
  }
}

export function WebLinkPreviewBlock({
  href,
  title,
  description,
  rel,
  className,
  variant = 'slate',
  image,
  icon,
}: WebLinkPreviewProps) {
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
          {title && (
            <span className={clsx('text-[18px] font-bold leading-snug', variants[variant].title)}>
              {title}
            </span>
          )}

          {description && (
            <p className="text-[15px] leading-snug">
              {description}
            </p>
          )}

          <div className="mt-auto flex items-center gap-2">
            {icon && (
              <Image
                src={icon.src}
                alt={icon.alt}
                className="h-5 w-5 flex-none rounded-sm"
                loading="lazy"
                height={10}
                width={10}
              />
            )}

            <span className="min-w-0 truncate text-[15px] font-light">
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
              height={200}
              width={200}
            />
            {/* soften the seam like many embeds do */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/70 to-transparent" />
          </div>
        )}
      </div>
    </a>
  )
}
