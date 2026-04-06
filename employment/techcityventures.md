---
layout: employment
company: Tech City Ventures
title: Tech City Ventures (2022 → 2023)
description: >-
  Tech City Ventures was a collection of minds building custom applications & services for clients, founded by a friend
  from university. I spent my time here working on various platforms & services for clients, as well as managing a team
  of software developer contractors.
period: '(2022 → 2023)'
role: Head of Technology
logo: /logos/techcityventures.jpg
screenshot: /assets/images/employment/techcityventures/techcityventures-homepage.png
screenshot_alt: TechCityVentures homepage (2023)
screenshot_border: '100'
screenshot2: /assets/images/employment/techcityventures/figfinance-homepage.png
screenshot2_alt: FigFinance developer portal (2023)
screenshot2_border: '100'
badges:
  - { name: Node.js, color: green }
  - { name: Express.js, color: blue }
  - { name: MongoDB, color: green }
  - { name: Redis, color: red }
  - { name: Integrations, color: slate }
  - { name: AWS, color: orange }
---

<p>
  <strong>Tech City Ventures</strong> was a collection of minds building custom applications & services for clients,
  founded by a friend from university. I spent my time here working on various platforms & services for clients, as
  well as managing a team of software developer contractors.
</p>

<ul class="list-disc pl-4">
  <li>Joined as the team lead, spearheaded the initial product development & release. Restructured the team, including contractor evaluation & personnel optimisation.</li>
  <li>Refactored the core application to support multi-tenacy, so one application deployment could power multiple clients, rather than multiple deployments (one-per-client).</li>
  <li>Migrated the entire core application to <b>AWS</b> (ECS) from dedicated hosting (DigitalOcean K8s).</li>
  <li>The main client during my time at TCV was <b>Fig Finance</b>, a B2B automated lending platform operating in Africa:</li>
  <ul class="list-disc pl-4">
    <li>We started as a web-application, where lenders & borrowers could negotiate terms & sign contracts via Hellosign.</li>
    <li>The business quickly pivoted to an API-first product, my team & I quickly built & iterated on a "lending API" designed to collect customer information, decide if a loan can be granted & if so, gather an e-signature & automatically create the bank account required for the loan. It also tracked repayments & sent out notifications.</li>
    <li>Our product was a fully-compliant JSON-API, with support for customer partitions, rate-limits & webhooks. We also built a standalone Retool panel for the business to review individual loan approvals & details.</li>
    <li>I designed & implemented an integration framework to interact with 3rd-party banking APIs, including automatic account creation, loan disbursement & other banking features across multiple banking providers.</li>
  </ul>
</ul>
