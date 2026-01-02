'use client'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import useObscuredValue from '@/hooks/obscure-value'

import avatarImage from '@/images/avatar.png'
import { GitHubIcon, LinkedInIcon, ThreadsIcon } from '@/components/SocialIcons'

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

function SocialLink({
  className = 'h-6 w-6',
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  className?: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Link className="group p-1" {...props}>
      <Icon className={`fill-zinc-500 transition group-hover:fill-zinc-600 ${className}`} />
    </Link>
  )
}

function Avatar({
  large = false,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof Link>, 'href'> & {
  large?: boolean
}) {
  return (
    <Link
      href="/"
      aria-label="Home"
      className={clsx(className, 'pointer-events-auto')}
      {...props}
    >
      <Image
        src={avatarImage}
        alt=""
        sizes={large ? '4rem' : '2.25rem'}
        className={clsx(
          'rounded-full bg-zinc-100 object-cover',
          large ? 'h-16 w-16' : 'h-9 w-9',
        )}
        priority
      />
    </Link>
  )
}

export function Header() {
  const emailHref = useObscuredValue([
    ['#this', 'mailto:'],
    ['-is', 'james'],
    ['-the', '@'],
    ['-way', 'jdrydn.com'],
  ])

  return (
    <header
      className="pointer-events-none relative z-50 flex flex-none flex-col"
      style={{
        height: 'var(--header-height)',
        marginBottom: 'var(--header-mb)',
      }}
    >
      <div className="h-16 pt-6">
        <div className="mx-auto w-full max-w-7xl lg:px-8">
          <div className="relative flex gap-4 mx-5">
            <div className="flex flex-1">
              <Avatar />
            </div>
            <div className="flex flex-1 justify-end">
              <nav className="pointer-events-auto">
                <div className="flex items-center gap-6 text-sm font-medium text-zinc-800">
                  <SocialLink
                    className="h-5 w-5"
                    href="#"
                    aria-label="Follow on Threads"
                    icon={ThreadsIcon} />
                  <SocialLink
                    href="#"
                    aria-label="Follow on GitHub"
                    icon={GitHubIcon} />
                  <SocialLink
                    href="#"
                    aria-label="Follow on LinkedIn"
                    icon={LinkedInIcon} />
                  <SocialLink
                    href={emailHref}
                    aria-label="Email me"
                    icon={MailIcon} />
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}