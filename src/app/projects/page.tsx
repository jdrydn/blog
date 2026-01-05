import Image from 'next/image'
import { type Metadata } from 'next'

import { Badge } from '@/components/Badges'
import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'

import kodeonImg from '@/images/projects/kodeon.png'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'I\'ve worked on a couple of projects.',
}

export default function Speaking() {
  return (
    <SimpleLayout title="I've worked on a couple of projects">
      <div className="max-w-2xl space-y-20">
        <section className="md:border-l md:border-zinc-100 md:pl-6">
          <div className="md:ml-3">
            <Card as="article">
              <Card.Title as="h3" href="https://github.com/someimportantcompany" target="_blank">
                Some Important Company
              </Card.Title>
              <Card.Description>
                A collection of open-source tools for you & your projects,
                including Node.js modules, GitHub Actions & small independent projects.
              </Card.Description>
              <Card.Cta>Learn more at github.com/someimportantcompany</Card.Cta>
            </Card>
          </div>
        </section>

        <section className="md:border-l md:border-zinc-100 md:pl-6">
          <div className="md:ml-3">
            <Card as="article">
              <Card.Title as="h3" href="https://app.kodeon.dev" target="_blank">
                Kodeon
              </Card.Title>
              <Card.Description>
                A local-first in-memory Python REPL web-application, designed for students & code enthusiasts who need
                a safe space to write & run code. Code executes & is stored locally - there are no servers, no user
                accounts, nothing to install, nothing to steal.
              </Card.Description>
              <Card.Description>
                <Image src={kodeonImg} alt="Screenshot of Kodeon" className="rounded"/>
              </Card.Description>
              <Card.Cta>Learn more at app.kodeon.dev</Card.Cta>
            </Card>
          </div>
        </section>

        <section className="md:border-l md:border-zinc-100 md:pl-6">
          <div className="md:ml-3">
            <Card as="article">
              <Card.Title as="h3">
                apisq
              </Card.Title>
              <Card.Description>
                What started as an API-portal is being reworked into a collection of standalone open-source services,
                with a CLI to make installs easy.
              </Card.Description>
              <Card.Description>
                <Badge variant="amber">Coming soon</Badge>
              </Card.Description>
            </Card>
          </div>
        </section>
      </div>
    </SimpleLayout>
  )
}
