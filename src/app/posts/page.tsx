import { type Metadata } from 'next'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { getAllPosts, type Post } from '@/lib/posts'
import { formatDate } from '@/lib/formatDate'

function ListItem({ post, slug, date }: { post?: Post, slug: string, date: Date }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/posts/${slug}`}>
          {post?.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={date.toISOString()}
          className="md:hidden"
          decorate
        >
          {formatDate(date.toISOString())}
        </Card.Eyebrow>
        <Card.Description>{post?.description}</Card.Description>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={date.toISOString()}
        className="mt-1 max-md:hidden"
      >
        {formatDate(date.toISOString())}
      </Card.Eyebrow>
    </article>
  )
}

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order.',
}

export default async function ArticlesIndex() {
  const posts = await getAllPosts()

  return (
    <SimpleLayout
      title="Writing on software design, company building, and the aerospace industry."
      intro="All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order."
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          {posts.map((post) => (
            <ListItem key={post.slug} post={post.post} slug={post.slug} date={post.date} />
          ))}
        </div>
      </div>
    </SimpleLayout>
  )
}
