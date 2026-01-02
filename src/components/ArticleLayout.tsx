import Link from 'next/link'

import { Container } from '@/components/Container'
import { formatDate } from '@/lib/formatDate'
import type { Post } from '@/lib/posts'

function ArrowLeftIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ArticleLayout({
  post,
  children,
}: {
  post: Post
  children: React.ReactNode
}) {
  return (
    <Container className="mt-16 lg:mt-32">
      <div className="xl:relative">
        <div className="mx-auto max-w-2xl">
          <noscript>
            <p className="my-6 text-base text-zinc-600">
              <code>
                Some features on this site rely on JavaScript,
                which doesn't appear to be enabled,
                so parts of the site may not work as expected.
              </code>
            </p>
          </noscript>
          <Link
            href="/posts"
            aria-label="Go back to articles"
            className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 transition lg:absolute lg:my-0 lg:-top-1.5 lg:left-0"
          >
            <ArrowLeftIcon className="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700" />
          </Link>
          <article>
            <header className="flex flex-col">
              {post.date && (
                <time className="order-first flex items-center text-base text-zinc-400" dateTime={post.date.toISOString()}>
                  <span className="h-4 w-0.5 rounded-full bg-zinc-200" />
                  <span className="ml-3">{formatDate(post.date.toISOString())}</span>
                </time>
              )}
            </header>
            <div className="prose">
              {children}
            </div>
          </article>
        </div>
      </div>
    </Container>
  )
}
