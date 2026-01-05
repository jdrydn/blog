import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import type { PropsWithChildren } from 'react'
import type { MDXComponents } from 'mdx/types'

function MdxLink({ href, children }: PropsWithChildren<{ href: string }>) {
  if (href.startsWith('/')) {
    return (
      <Link href={href}>
        {children}
      </Link>
    )
  } else {
    return (
      <a href={href} target="_blank" rel="nofollow noopener noreferrer">
        {children}
      </a>
    );
  }
}

export function useMDXComponents(components: MDXComponents) {
  return {
    ...components,
    a: MdxLink,
    Image: (props: ImageProps) => <Image {...props} />,
  }
}
