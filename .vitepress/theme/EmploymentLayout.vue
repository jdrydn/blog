<script setup lang="ts">
import { useData } from 'vitepress';

const { frontmatter } = useData();
</script>

<template>
  <div class="sm:px-8 mt-8">
    <div class="mx-auto w-full max-w-7xl lg:px-8">
      <div class="relative px-4 sm:px-8 lg:px-12">
        <div class="mx-auto max-w-2xl lg:max-w-5xl">
          <header class="max-w-2xl">
            <div class="flex flex-row justify-start items-center gap-x-3">
              <a href="/" aria-label="Go back to home" class="flex group h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700">
                  <path d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
              <img v-if="frontmatter.logo" :src="frontmatter.logo" :alt="`${frontmatter.company} logo`" class="my-3 rounded-xl h-10 w-10" height="50" width="50">
              <h1 class="text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl">
                {{ frontmatter.company }}
              </h1>
            </div>
            <p class="mt-6 text-base font-bold text-zinc-600">
              {{ frontmatter.period }} {{ frontmatter.role }}
            </p>
          </header>
          <div class="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
            <div v-if="frontmatter.screenshot" class="lg:pl-20">
              <div class="max-w-xs mt-6 px-2.5 lg:max-w-none lg:mt-0">
                <img :src="frontmatter.screenshot" :alt="frontmatter.screenshot_alt" :class="['rounded', frontmatter.screenshot_border ? `border border-slate-${frontmatter.screenshot_border}` : '']" sizes="(min-width: 1024px) 32rem, 20rem">
              </div>
              <div v-if="frontmatter.screenshot2" class="max-w-xs mt-6 px-2.5 lg:max-w-none lg:mt-3">
                <img :src="frontmatter.screenshot2" :alt="frontmatter.screenshot2_alt" :class="['rounded', frontmatter.screenshot2_border ? `border border-slate-${frontmatter.screenshot2_border}` : '']" sizes="(min-width: 1024px) 32rem, 20rem">
              </div>
            </div>
            <div class="lg:order-first lg:row-span-2">
              <div class="space-y-7 text-base text-zinc-600 my-3 lg:my-6">
                <Content />
              </div>
              <div v-if="frontmatter.badges" class="flex flex-row flex-wrap my-3 gap-3">
                <span v-for="badge in frontmatter.badges" :key="badge.name" :class="[
                  'inline-flex items-center space-x-2.5 border rounded-full px-3 py-1 text-sm',
                  `border-${badge.color}-200 bg-${badge.color}-100/50 text-${badge.color}-800`,
                ]">{{ badge.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
