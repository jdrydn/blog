import Link from 'next/link'
import Image from 'next/image'
import { onlyText } from 'react-children-utilities'

import { Container } from '@/components/Container'
import { Badge } from '@/components/Badges'
import { ArrowLeftIcon } from '@/components/Icons'

import homepageImage from './mindwork-labs-homepage.png'

const description = (
  <p>
    <strong>Mindwork Labs</strong> was my first developer role back when I was at University. I worked here for a summer
    & was fortunate enough to return for my year-in-industry placement. During my time here, I was working across the
    full-stack to build community features & services to support visitors, building alongside some of the brightest
    minds in software development.
  </p>
)

export const metadata = {
  title: 'Mindwork Labs (2012 → 2014)',
  description: onlyText(description),
}

export default function Uses() {
  return (
    <Container className="mt-8">
      <header className="max-w-2xl">
        <div className="flex flex-row justify-start items-center gap-x-3">
          <Link
            href="/"
            aria-label="Go back to home"
            className="flex group h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5"
          >
            <ArrowLeftIcon className="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700" />
          </Link>
          <Image src="/logos/mindworklabs.png" alt="Mindwork Labs logo" className="my-3 rounded-xl h-10 w-10" height={50} width={50} />
          <h1 className="text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl">
            Mindwork Labs
          </h1>
        </div>
        <p className="mt-6 text-base font-bold text-zinc-600">
          (2012 → 2014) Junior Developer / Senior Developer
        </p>
      </header>
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs mt-6 px-2.5 lg:max-w-none lg:mt-0">
            <Image
              src={homepageImage}
              alt="Mindwork Labs homepage"
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="rounded"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <div className="space-y-7 text-base text-zinc-600 my-3 lg:my-6">
            {description}
            <ul className="list-disc pl-4">
              <li>University industry placement, hired after a hackathon back in 2012.</li>
              <li>Learning production-grade full-stack development, building user-facing features & staff tools.</li>
              <li>Learning core database principles & data abstraction in real-world situations.</li>
              <li>Experimenting with app development with Cordova & (early versions of) React Native.</li>
              <li>
                Experienced corporate acquisition first-hand, as{' '}
                <strong>Mindwork Labs</strong> was acquired by <strong>Markco Media</strong>, then{' '}
                who was later acquired by <strong>Monitise</strong>.{' '}
              </li>
              <li>
                Working on discount website <strong>MyDeals</strong>,{' '}
                later also working on discount website <strong>MyVoucherCodes</strong>.
              </li>
            </ul>
          </div>
          <div className="flex flex-row flex-wrap my-3 gap-3">
            <Badge variant="purple">PHP</Badge>
            <Badge variant="blue">Kohana</Badge>
            <Badge variant="yellow">MySQL</Badge>
            <Badge variant="gray">Rackspace</Badge>
          </div>
        </div>
      </div>
    </Container>
  )
}
