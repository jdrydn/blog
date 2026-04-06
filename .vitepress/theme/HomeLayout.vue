<script setup lang="ts">
import { data as posts } from './posts.data';
import HomepagePhotos from './components/HomepagePhotos.vue';
import Resume from './components/Resume.vue';

const recentPosts = posts.slice(0, 5);

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
</script>

<template>
  <div class="sm:px-8 mt-9">
    <div class="mx-auto w-full max-w-7xl lg:px-8">
      <div class="relative px-4 sm:px-8 lg:px-12">
        <div class="mx-auto max-w-2xl lg:max-w-5xl">
          <div class="max-w-2xl">
            <h1 class="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl">
              jdrydn
            </h1>
            <p class="mt-6 text-base text-zinc-600">
              <b>Engineer</b> at heart,
              found working on
              <b>products, projects, microservices &amp; APIs</b> (REST, GraphQL, <s>SOAP</s>) in
              <b>Node.js</b> (ExpressJS, Koa, NextJS, Serverless) or
              <s><b>PHP</b> (CodeIgniter, Symphony, Wordpress)</s>,
              familiar with
              <b>relational databases</b> (MySQL, Postgres),
              <b>document-driven databases</b> (DynamoDB, MongoDB, <s>RethinkDB</s>, Elasticsearch),
              <b>templating</b> (React, Vue.js, Handlebars, <s>Nunjucks</s>, Jekyll, Liquid),
              <b>unit testing</b> with code-coverage (Vitest, Mocha, <s>Istanbul</s> NYC, <s>PHPUnit</s>),
              <b>integration testing</b> (Playwright, <s>Cypress</s>) &amp;
              <b>devops</b> (dedicated servers, Docker, Kubernetes, AWS, GCP, Azure, <s>Rackspace</s>).
            </p>
            <noscript>
              <p class="mt-6 text-base text-zinc-600">
                <code>
                  Some features on this site rely on JavaScript,
                  which doesn't appear to be enabled,
                  so parts of the site may not work as expected.
                </code>
              </p>
            </noscript>
          </div>
        </div>
      </div>
    </div>
  </div>

  <HomepagePhotos />

  <div class="sm:px-8 mt-24 md:mt-28">
    <div class="mx-auto w-full max-w-7xl lg:px-8">
      <div class="relative px-4 sm:px-8 lg:px-12">
        <div class="mx-auto max-w-2xl lg:max-w-5xl">
          <div class="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
            <div class="flex flex-col gap-16">
              <article v-for="post in recentPosts" :key="post.url" class="group relative flex flex-col items-start">
                <h2 class="text-base font-semibold tracking-tight text-zinc-800">
                  <div class="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl"></div>
                  <a :href="post.url">
                    <span class="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl"></span>
                    <span class="relative z-10">{{ post.title }}</span>
                  </a>
                </h2>
                <time class="relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 pl-3.5" :datetime="post.date">
                  <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                    <span class="h-4 w-0.5 rounded-full bg-zinc-200"></span>
                  </span>
                  {{ formatDate(post.date) }}
                </time>
                <p class="relative z-10 mt-2 text-sm text-zinc-600">{{ post.description }}</p>
                <div aria-hidden="true" class="relative z-10 mt-4 flex items-center text-sm font-medium text-teal-500">
                  Read article
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="ml-1 h-4 w-4 stroke-current"><path d="M6.75 5.75 9.25 8l-2.5 2.25" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </article>
              <div class="group relative flex flex-col items-start">
                <a class="relative z-10 mt-4 flex items-center text-sm font-medium text-teal-500" href="/posts">
                  All Posts
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="ml-1 h-4 w-4 stroke-current"><path d="M6.75 5.75 9.25 8l-2.5 2.25" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </a>
              </div>
            </div>
            <div class="space-y-10 lg:pl-16 xl:pl-24">
              <Resume />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
