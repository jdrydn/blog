import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'
import { Badge } from '@/components/Badges'

function ToolsSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-8">
        {children}
      </ul>
    </Section>
  )
}

function Tool({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: React.ReactNode
}) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export const metadata = {
  title: 'Now',
  description: 'A "now page" - merely a snapshot into my world',
}

export default function Uses() {
  return (
    <SimpleLayout
      title="What's happening now?"
      intro={
        <>
          This is inspired from <a className="underline" href="https://nownownow.com/about"><code>nownownow.com</code></a>
          {' '}- a representation on what is happening in my world.
        </>
      }
    >
      <div className="space-y-20">
        <ToolsSection title="Introduction">
          <p className="mt-2 text-sm text-zinc-600">
            Hi, I'm James! 👋
            I'm a software engineer at heart, focusing on building applications & services that make a real impact to people & teams.
          </p>
        </ToolsSection>
        <ToolsSection title="Hardware">
          <Tool title="16” MacBook Pro, M1 Max, 16GB RAM">
            Before this, I was using an Intel i5 13" MacBook Pro from 2015, and the difference between Intel & Apple
            Silicon is jaw-dropping. It may be a few years old now, but it's my go-to device to get the job done. And
            the bigger screen? Has been fantastic when commuting to the office.
          </Tool>
          <Tool title="AOC Gaming Monitor CU34G2XPD, 34” WQHD curved monitor, 3440x1440">
            This monitor completely re-energised my work setup. This, two HDMI cables & enabling Picture-by-Picture
            gives me effectively two monitors under a single glass panel - it's absolutely fantastic & incredibly
            high-definition.
          </Tool>
          <Tool title="Apple AirPods Max">
            The best headphones I've ever owned. Seriously. Best battery life I've ever experienced (I can fly over to
            the US west coast on a single charge no bother) & easy connectivity options to the Apple ecosystem.
          </Tool>
          <Tool title="Steamdeck">
            My most recent purchase - this little powerhouse has been an incredible daily gaming device. I'm slowly
            modernising my Steam library (thanks to the Wishlist notifying me when Steam sales are on!) &
          </Tool>
        </ToolsSection>
        <ToolsSection title="Software">
          <Tool title="macOS">
            macOS beats most Linux distributions anyway
          </Tool>
          <Tool title="Brave">
            One day I was triggered by Google Chrome's interference & finally made the switch - Brave has been an
            excellent experience so far, and the privacy blockers have been a breath of fresh air when browsing the
            today's ad-infested internet.
          </Tool>
          <Tool title="VSCode">
            I switched over from Atom & not looked back. There are a lot of suspicious extensions though, so you do need
            to be wary when the classic suggestion pops up "<i>Would you like to install ...</i>" but overall, it's easy
            to work with & settings sync with GitHub!
          </Tool>
          <Tool title="iTerm2">
            More than just the built-in macOS Terminal, iTerm2 has a ridiculously effective split-screen feature, which
            is handy given how much I seem to multi-task in a full-screen iTerm session!
          </Tool>
          <Tool title="Stack">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">Backend</dt>
                <dd className="mt-1 flex flex-row flex-wrap gap-3 sm:col-span-3 sm:mt-0">
                  <Badge variant="green">Node.js</Badge>
                  <Badge variant="purple">PHP</Badge>
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">Database</dt>
                <dd className="mt-1 flex flex-row flex-wrap gap-3 sm:col-span-3 sm:mt-0">
                  <Badge variant="slate">Postgres</Badge>
                  <Badge variant="yellow">MySQL</Badge>
                  <Badge variant="green">MongoDB</Badge>
                  <Badge variant="purple">ElasticSearch</Badge>
                  <Badge variant="red">Redis</Badge>
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">Frontend</dt>
                <dd className="mt-1 flex flex-row flex-wrap gap-3 sm:col-span-3 sm:mt-0">
                  <Badge variant="green">Vue.js</Badge>
                  <Badge variant="blue">React.js</Badge>
                  <Badge variant="sky">React Native</Badge>
                  <Badge variant="amber">Vite</Badge>
                  <Badge variant="cyan">Liquid</Badge>
                  <Badge variant="slate">Jekyll</Badge>
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">Testing</dt>
                <dd className="mt-1 flex flex-row flex-wrap gap-3 sm:col-span-3 sm:mt-0">
                  <Badge variant="amber">Mocha</Badge>
                  <Badge variant="blue">Jest</Badge>
                  <Badge variant="green">Vitest</Badge>
                </dd>
              </div>
            </dl>
          </Tool>
        </ToolsSection>
        <ToolsSection title="Games">
          <Tool title="Dishonored">
            A stunning story with perfect single-player gameplay, parkour, powers & pistols!
          </Tool>
          <Tool title="Dishonored 2">
            Sequel to <b>Dishonored</b> - the next generation of parkour, powers & pistols!
          </Tool>
          <Tool title="Star Wars: Jedi Fallen Order">
            Incredible game & incredible story - an amazing single-player game in the Star Wars universe, set after the
            events of the third film (<i>"Execute order 66"</i>)
          </Tool>
          <Tool title="Star Wars: Jedi Survivor">
            Sequel to <b>Jedi Fallen Order</b> - might be the only sequel where the main character isn't nerfed in the
            opening act 😍
          </Tool>
        </ToolsSection>
      </div>
    </SimpleLayout>
  )
}
