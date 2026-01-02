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
  title: 'All Posts',
  description: 'All of my thoughts on programming, product development, and more, collected into a timeline of sorts.',
}

export default async function ArticlesIndex() {
  const posts = await getAllPosts()

  return (
    <SimpleLayout
      title="All Posts"
      intro={metadata.description!}
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6">
        <div className="flex max-w-3xl flex-col space-y-16">
          {posts.map((post) => (
            <ListItem key={post.slug} post={post.post} slug={post.slug} date={post.date} />
          ))}
        </div>
      </div>
    </SimpleLayout>
  )
}
