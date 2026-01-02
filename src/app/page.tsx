import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'

import { employment } from '@/employment'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import { LinkedInIcon } from '@/components/SocialIcons'
import image1 from '@/images/photos/image-1.jpg'
import image2 from '@/images/photos/image-2.jpg'
import image3 from '@/images/photos/image-3.jpg'
import image4 from '@/images/photos/image-4.jpg'
import image5 from '@/images/photos/image-5.jpg'
import { getAllPosts, type Post } from '@/lib/posts'
import { formatDate } from '@/lib/formatDate'

function BriefcaseIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400"
      />
      <path
        d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
        className="stroke-zinc-400"
      />
    </svg>
  )
}

function ChevronRightIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6.75 5.75 9.25 8l-2.5 2.25"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Article({ post, slug, date }: { post?: Post, slug: string, date: Date }) {
  return (
    <Card as="article">
      <Card.Title href={`/posts/${slug}`}>
        {post?.title}
      </Card.Title>
      <Card.Eyebrow as="time" dateTime={date.toISOString()} decorate>
        {formatDate(date)}
      </Card.Eyebrow>
      <Card.Description>{post?.description}</Card.Description>
      <Card.Cta>Read article</Card.Cta>
    </Card>
  )
}

function Resume() {
  return (
    <div className="rounded-2xl border border-zinc-100 p-6">
      <h2 className="flex text-sm font-semibold text-zinc-900">
        <BriefcaseIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Work</span>
      </h2>
      <ol className="mt-6 space-y-4">
        {employment.map((role, index) => (
          <li className="flex gap-4" key={index + role.company + role.title}>
            <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5">
              <a href={role.url} rel="nofollow" target="_blank">
                {typeof role.logo === 'string'
                  ? <Image src={role.logo} alt={role.company} className="h-7 w-7 rounded-full" unoptimized height={28} width={28} />
                  : <Image src={role.logo} alt={role.company} className="h-7 w-7 rounded-full" unoptimized />}
              </a>
            </div>
            <dl className="flex flex-auto flex-wrap gap-x-2">
              <dt className="sr-only">Company</dt>
              <dd className="w-full flex-none text-sm font-medium text-zinc-900">
                {role.url.startsWith('/') ? (
                  <Link href={role.url}>{role.company}</Link>
                ) : (
                  <a href={role.url} rel="nofollow" target="_blank">{role.company}</a>
                )}
              </dd>
              <dt className="sr-only">Role</dt>
              <dd className="text-xs text-zinc-500">
                {role.title}
              </dd>
              <dt className="sr-only">Date</dt>
              <dd
                className="ml-auto text-xs text-zinc-400"
                aria-label={`${role.between[0]} until ${role.between[1]}`}
              >
                <time dateTime={role.between[0]}>{role.between[0]}</time>{' '}
                <span aria-hidden="true">—</span>{' '}
                <time dateTime={role.between[1]}>{role.between[1]}</time>
              </dd>
            </dl>
          </li>
        ))}
      </ol>
      <Button href="#" variant="secondary" align="start" className="group mt-6 pl-15 w-full">
        Read more on LinkedIn
        <LinkedInIcon className="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600" />
      </Button>
    </div>
  )
}

function Photos() {
  let rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2']

  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
        {[image1, image2, image3, image4, image5].map((image, imageIndex) => (
          <div
            key={image.src}
            className={clsx(
              'relative w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:w-72 sm:rounded-2xl',
              rotations[imageIndex % rotations.length],
            )}
          >
            <div className="aspect-9/10">
              <Image
                src={image}
                alt=""
                sizes="(min-width: 640px) 18rem, 11rem"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function Home() {
  const items = (await getAllPosts()).slice(0, 5)

  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl">
            jdrydn
          </h1>
          <p className="mt-6 text-base text-zinc-600">
            <b>Engineer</b> at heart,{' '}
            found working on{' '}
            <b>products, projects, microservices & APIs</b> (REST, GraphQL, <s>SOAP</s>) in{' '}
            <b>Node.js</b> (ExpressJS, Koa, NextJS, Serverless) or{' '}
            <s><b>PHP</b> (CodeIgniter, Symphony, Wordpress)</s>, {' '}
            familiar with{' '}
            <b>relational databases</b> (MySQL,Postgres),{' '}
            <b>document-driven databases</b> (DynamoDB, MongoDB, <s>RethinkDB</s>, Elasticsearch),{' '}
            <b>templating</b> (React, Vue.js, Handlebars, <s>Nunjucks</s>, Jekyll, Liquid),{' '}
            <b>unit testing</b> with code-coverage (Vitest, Mocha, <s>Istanbul</s> NYC, <s>PHPUnit</s>),{' '}
            <b>integration testing</b> (Playwright, <s>Cypress</s>) &{' '}
            <b>devops</b> (dedicated servers, Docker, Kubernetes, AWS, GCP, Azure, <s>Rackspace</s>).
          </p>
          <noscript>
            <p className="mt-6 text-base text-zinc-600">
              <code>
                Some features on this site rely on JavaScript,
                which doesn't appear to be enabled,
                so parts of the site may not work as expected.
              </code>
            </p>
          </noscript>
        </div>
      </Container>
      <Photos />
      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-16">
            {items.map(({ post, slug, date }) => (
              <Article key={slug} {...{ post, slug, date }} />
            ))}
            <div className="group relative flex flex-col items-end">
              <Link
                className="relative z-10 mt-4 flex items-center text-sm font-medium text-teal-500"
                href="/posts"
              >
                Read more
                <ChevronRightIcon className="ml-1 h-4 w-4 stroke-current" />
              </Link>
            </div>
          </div>
          <div className="space-y-10 lg:pl-16 xl:pl-24">
            <Resume />
          </div>
        </div>
      </Container>
    </>
  )
}
