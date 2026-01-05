import Link from 'next/link'
import Image from 'next/image'
import { onlyText } from 'react-children-utilities'

import { Container } from '@/components/Container'
import { Badge } from '@/components/Badges'
import { ArrowLeftIcon } from '@/components/Icons'

import homepageImage from './reallinks-homepage.png'

const description = (
  <p>
    <strong>Real Links</strong> is a B2B web-application for internal recruiters to "tap into" their employee's networks
    & identify suitable candidates for open roles. As their first hire, I spent my time building out an MVP prototype
    into a complete platform for customers, adding in new features in response to customer requests, and supporting
    existing customers with queries & issues.
  </p>
)

export const metadata = {
  title: 'Real Links (2019 → 2023)',
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
          <Image src="/logos/real-links.jpeg" alt="muzmatch logo" className="my-3 rounded-xl h-10 w-10" height={50} width={50} />
          <h1 className="text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl">
            Real Links
          </h1>
        </div>
        <p className="mt-6 text-base font-bold text-zinc-600">
          (2019 → 2023) CTO / Lead Developer
        </p>
      </header>
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs mt-6 px-2.5 lg:max-w-none lg:mt-0">
            <Image
              src={homepageImage}
              alt="Real Links homepage (2022)"
              className="rounded border border-slate-100"
              sizes="(min-width: 1024px) 32rem, 20rem" />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <div className="space-y-7 text-base text-zinc-600 my-3 lg:my-6">
            {description}
            <ul className="list-disc pl-4">
              <li>Joined as first hire after pre-seed round.</li>
              <li>Completed greenfield rebuild of MVP prototype into SaaS multi-tenanted white-labelled platform operating on <b>AWS</b>.</li>
              <li>Designed & built an integration framework to connect with <b>3rd-party ATS systems</b> (including SmartRecruiters, Greenhouse & Workday), which pushed new candidates into the ATS system & pulled updates back into our platform.</li>
              <li>Built an integration into <b>rewards providers</b>, so actions undertaken by users could translate into points, then into real products & purchases.</li>
              <li>Successful pivot to an ad-hoc interactive real-time "<i>referral jam</i>" platform, where users could interact in real-time to refer for roles, with animations & leaderboards to promote competition.</li>
              <li>Continued as <b>Technology Advisor</b> after leaving, assisting with further product development & infrastructure, as well as critical production issues.</li>
            </ul>
          </div>
          <div className="flex flex-row flex-wrap my-3 gap-3">
            <Badge variant="green">Node.js</Badge>
            <Badge variant="blue">Express.js</Badge>
            <Badge variant="blue">Vue.js</Badge>
            <Badge variant="yellow">MySQL</Badge>
            <Badge variant="red">Redis</Badge>
            <Badge variant="purple">ElasticSearch</Badge>
            <Badge variant="slate">Integrations</Badge>
            <Badge variant="orange">AWS</Badge>
          </div>
        </div>
      </div>
    </Container>
  )
}
