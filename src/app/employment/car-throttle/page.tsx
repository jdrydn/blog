import Link from 'next/link'
import Image from 'next/image'
import { onlyText } from 'react-children-utilities'

import { Container } from '@/components/Container'
import { Badge } from '@/components/Badges'
import { ArrowLeftIcon } from '@/components/Icons'

import homepageImage from './car-throttle-homepage.png'

const description = (
  <p>
    <strong>Car Throttle</strong> was "the internet's car community" - what started as a Wordpress site evolved into a
    social-media~like platform where car enthusiasts would post content about their cars, about car shows & similar.
    I worked primarily on rebuilding the legacy PHP monolith into a shiny (then new) Node.js application,
    building out an independent API "microservice" to power a new progressive web-app & set of mobile applications.
    I also helped build out a custom CMS backed by our API, and helped assemble a small suite of staff tools for
    the content creators.
  </p>
)

export const metadata = {
  title: 'Car Throttle (2015 → 2017)',
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
          <Image src="/logos/car-throttle.jpg" alt="Car Throttle logo" className="my-3 rounded-xl h-10 w-10" height={50} width={50} />
          <h1 className="text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl">
            Car Throttle
          </h1>
        </div>
        <p className="mt-6 text-base font-bold text-zinc-600">
          (2015 → 2017) Software Engineer / Senior Software Engineer
        </p>
      </header>
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs mt-6 px-2.5 lg:max-w-none lg:mt-0">
            <Image
              src={homepageImage}
              alt="Car Throttle homepage (2017)"
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="rounded border border-slate-500"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <div className="space-y-7 text-base text-zinc-600 my-3 lg:my-6">
            <p>{metadata.description}</p>
            <ul className="list-disc pl-4">
              <li><strong>Car Throttle</strong> was a Wordpress site started in 2009 & had been "<i>replatformed</i>" using SymphonyCMS (PHP XSLT framework).</li>
              <li>I joined as the first developer hire <a href="https://techcrunch.com/2015/01/19/dorm-room-to-media-domination/" target="_blank">after their Series A round</a>.</li>
              <li>Refactored legacy monolith into modern stack, separating the API/database from the frontend & new iOS/Android apps.</li>
              <li>Built a responsive internal CMS tool for editors, management, social & video teams.</li>
              <li>
                Primarily working on the main <strong>Car Throttle</strong> website,{' '}
                later also working on the new acquisition <strong>WTF1</strong>.
              </li>
              <li>After I left, Car Throttle was sold to Dennis Publishing & has since become a Wordpress site (again).</li>
            </ul>
          </div>
          <div className="flex flex-row flex-wrap my-3 gap-3">
            <Badge variant="green">Node.js</Badge>
            <Badge variant="blue">Express.js</Badge>
            <Badge variant="yellow">MySQL</Badge>
            <Badge variant="red">Redis</Badge>
            <Badge variant="purple">ElasticSearch</Badge>
            <Badge variant="orange">AWS</Badge>
          </div>
        </div>
      </div>
    </Container>
  )
}
