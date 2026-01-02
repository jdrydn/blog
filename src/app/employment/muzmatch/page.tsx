import Image from 'next/image'
import { onlyText } from 'react-children-utilities'

import { Container } from '@/components/Container'
import { Badge } from '@/components/Badges'

import homepageImage from './muzmatch-homepage.png'

const description = (
  <p>
    <strong>muzmatch</strong> is a dating app where single Muslims meet - similar to apps like Tinder, but focused on
    the worldwide Muslim community. I worked primarily on adding new features to the platform's API, as well as
    upgrading & improving existing features to handle an increased user count with the same resources.
  </p>
)

export const metadata = {
  title: 'muzmatch (2017 → 2018)',
  description: onlyText(description),
}

export default function Uses() {
  return (
    <Container className="mt-8">
      <header className="max-w-2xl">
        <Image src="/logos/muzmatch.jpg" alt="Car Throttle logo" className="my-3 rounded-xl" height={80} width={80} />
        <h1 className="text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl">
          muzmatch
        </h1>
        <p className="mt-6 text-base font-bold text-zinc-600">
          (2017 → 2018) Senior Backend Engineer
        </p>
      </header>
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs mt-6 px-2.5 lg:max-w-none lg:mt-0">
            <Image
              src={homepageImage}
              alt="muzmatch homepage (2018)"
              className="aspect-square rounded bg-zinc-100 object-cover"
              sizes="(min-width: 1024px) 32rem, 20rem" />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <div className="space-y-7 text-base text-zinc-600 my-3 lg:my-6">
            {description}
            <ul className="list-disc pl-4">
              <li>Joined as first hire after seed round.</li>
              <li>Migrated the entire platform to <strong>AWS</strong> from dedicated hosting.</li>
              <li>
                Added <strong>Redis</strong> as an application-level cache, caching data on write as well as on read,
                to greatly increase the number of users the existing resources could sustain.
              </li>
              <li>
                Also added <strong>ElasticSearch</strong> to build application-level searches, used as the start of the
                "matching experience" to recommend users in real-time based on a variety of factors, including age,
                location & preferences.
              </li>
              <li>Reworked user onboarding to increase MAU & subscriptions dramatically.</li>
            </ul>
          </div>
          <div className="flex flex-row flex-wrap my-3 gap-3">
            <Badge variant="purple">PHP</Badge>
            <Badge variant="yellow">MySQL</Badge>
            <Badge variant="red">Redis</Badge>
            <Badge variant="purple">ElasticSearch</Badge>
            <Badge variant="blue">XMPP</Badge>
            <Badge variant="orange">AWS</Badge>
          </div>
        </div>
      </div>
    </Container>
  )
}
