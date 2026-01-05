import Link from 'next/link'
import Image from 'next/image'
import { onlyText } from 'react-children-utilities'

import { Container } from '@/components/Container'
import { Badge } from '@/components/Badges'
import { ArrowLeftIcon } from '@/components/Icons'

import homepageImage from './techcityventures-homepage.png'
import figfinanceImage from './figfinance-homepage.png'

const description = (
  <p>
    <strong>Tech City Ventures</strong> was a collection of minds building custom applications & services for clients,
    founded by a friend from university. I spent my time here working on various platforms & services for clients, as
    well as managing a team of software developer contractors.
  </p>
)

export const metadata = {
  title: 'Tech City Ventures (2017 → 2018)',
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
          <Image src="/logos/techcityventures.jpg" alt="TechCityVentures logo" className="my-3 rounded-xl h-10 w-10" height={50} width={50} />
          <h1 className="text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl">
            Tech City Ventures
          </h1>
        </div>
        <p className="mt-6 text-base font-bold text-zinc-600">
          (2022 → 2023) Head of Technology
        </p>
      </header>
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs mt-6 px-2.5 lg:max-w-none lg:mt-0">
            <Image
              src={homepageImage}
              alt="TechCityVentures homepage (2023)"
              className="rounded border border-slate-100"
              sizes="(min-width: 1024px) 32rem, 20rem" />
          </div>
          <div className="max-w-xs mt-6 px-2.5 lg:max-w-none lg:mt-3">
            <Image
              src={figfinanceImage}
              alt="FigFinance developer portal (2023)"
              className="rounded border border-slate-100"
              sizes="(min-width: 1024px) 32rem, 20rem" />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <div className="space-y-7 text-base text-zinc-600 my-3 lg:my-6">
            {description}
            <ul className="list-disc pl-4">
              <li>Joined as the team lead, spearheaded the initial product development & release. Restructured the team, including contractor evaluation & personnel optimisation.</li>
              <li>Refactored the core application to support multi-tenacy, so one application deployment could power multiple clients, rather than multiple deployments (one-per-client).</li>
              <li>Migrated the entire core application to <b>AWS</b> (ECS) from dedicated hosting (DigitalOcean K8s).</li>
              <li>The main client during my time at TCV was <b>Fig Finance</b>, a B2B automated lending platform operating in Africa:</li>
              <ul className="list-disc pl-4">
                <li>We started as a web-application, where lenders & borrowers could negotiate terms & sign contracts via Hellosign.</li>
                <li>The business quickly pivoted to an API-first product, my team & I quickly built & iterated on a "lending API" designed to collect customer information, decide if a loan can be granted & if so, gather an e-signature & automatically create the bank account required for the loan. It also tracked repayments & sent out notifications.</li>
                <li>Our product was a fully-compliant JSON-API, with support for customer partitions, rate-limits & webhooks. We also built a standalone Retool panel for the business to review individual loan approvals & details.</li>
                <li>I designed & implemented an integration framework to interact with 3rd-party banking APIs, including automatic account creation, loan disbursement & other banking features across multiple banking providers.</li>
              </ul>
            </ul>
          </div>
          <div className="flex flex-row flex-wrap my-3 gap-3">
            <Badge variant="green">Node.js</Badge>
            <Badge variant="blue">Express.js</Badge>
            <Badge variant="green">MongoDB</Badge>
            <Badge variant="red">Redis</Badge>
            <Badge variant="slate">Integrations</Badge>
            <Badge variant="orange">AWS</Badge>
          </div>
        </div>
      </div>
    </Container>
  )
}
