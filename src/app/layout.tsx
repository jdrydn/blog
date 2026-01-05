import { type Metadata } from 'next'

import { Layout } from '@/components/Layout'

import '@/style.css'

export const metadata: Metadata = {
  title: {
    template: '%s - jdrydn',
    default: 'jdrydn',
  },
  description: 'Engineer at heart, found working on products, projects, microservices & APIs in Node.js, familiar with databases, templating, testing & devops.',
  // alternates: {
  //   types: {
  //     'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
  //   },
  // },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
      </head>
      <body className="flex h-full bg-zinc-50">
        <div className="flex w-full">
          <Layout>{children}</Layout>
        </div>
      </body>
    </html>
  )
}
