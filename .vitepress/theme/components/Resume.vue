<script setup lang="ts">
import { useData } from 'vitepress';

const { theme } = useData();

const employment = [
  { company: 'BPP Education Group', role: 'Principal Software Engineer', href: 'https://www.bpp.com', logo: '/logos/bpp.jpeg', from: '2023', to: 'Present' },
  { company: 'Tech City Ventures', role: 'Head of Technology', href: '/employment/techcityventures', logo: '/logos/techcityventures.jpg', from: '2022', to: '2023' },
  { company: 'Real Links', role: 'CTO / Lead Engineer', href: '/employment/real-links', logo: '/logos/real-links.jpeg', from: '2019', to: '2022' },
  { company: 'muzmatch', role: 'Senior Backend Engineer', href: '/employment/muzmatch', logo: '/logos/muzmatch.jpg', from: '2017', to: '2018' },
  { company: 'Car Throttle', role: 'Senior Engineer', href: '/employment/car-throttle', logo: '/logos/car-throttle.jpg', from: '2015', to: '2017' },
  { company: 'Mindwork Labs', role: 'Junior Developer / Senior Developer', href: '/employment/mindwork-labs', logo: '/logos/mindworklabs.png', from: '2012', to: '2014' },
];

function isExternal(href: string) {
  return href.startsWith('http');
}
</script>

<template>
  <div class="rounded-2xl border border-zinc-100 p-6">
    <h2 class="flex text-sm font-semibold text-zinc-900">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="h-6 w-6 flex-none">
        <path d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z" class="fill-zinc-100 stroke-zinc-400"/>
        <path d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5" class="stroke-zinc-400"/>
      </svg>
      <span class="ml-3">Work</span>
    </h2>
    <ol class="mt-6 space-y-4">
      <li v-for="role in employment" :key="role.company" class="flex gap-4">
        <div class="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5">
          <a :href="role.href" :rel="isExternal(role.href) ? 'nofollow' : undefined" :target="isExternal(role.href) ? '_blank' : undefined">
            <img :src="role.logo" :alt="role.company" class="h-7 w-7 rounded-full" height="28" width="28">
          </a>
        </div>
        <dl class="flex flex-auto flex-wrap gap-x-2">
          <dt class="sr-only">Company</dt>
          <dd class="w-full flex-none text-sm font-medium text-zinc-900">
            <a :href="role.href" :rel="isExternal(role.href) ? 'nofollow' : undefined" :target="isExternal(role.href) ? '_blank' : undefined">{{ role.company }}</a>
          </dd>
          <dt class="sr-only">Role</dt>
          <dd class="text-xs text-zinc-500">{{ role.role }}</dd>
          <dt class="sr-only">Date</dt>
          <dd class="ml-auto text-xs text-zinc-400" :aria-label="`${role.from} until ${role.to}`">
            <time :datetime="role.from">{{ role.from }}</time>
            <span aria-hidden="true">&mdash;</span>
            <time :datetime="role.to">{{ role.to }}</time>
          </dd>
        </dl>
      </li>
    </ol>
    <a :href="theme.links.linkedin" target="_blank" class="inline-flex items-center gap-2 justify-start rounded-md px-3 py-2 text-sm font-medium text-zinc-900 outline-offset-2 transition active:transition-none bg-zinc-50 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 group mt-6 pl-15 w-full">
      Read more on LinkedIn
      <svg viewBox="0 0 24 24" class="h-4 w-4 fill-zinc-400 transition group-active:fill-zinc-600">
        <path d="M18.335 18.339H15.67v-4.177c0-.996-.02-2.278-1.39-2.278-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387 2.7 0 3.2 1.778 3.2 4.091v4.715ZM7.003 8.575a1.546 1.546 0 0 1-1.548-1.549 1.548 1.548 0 1 1 1.547 1.549Zm1.336 9.764H5.666V9.75H8.34v8.589ZM19.67 3H4.329C3.593 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.338C20.4 21 21 20.42 21 19.703V4.297C21 3.58 20.4 3 19.666 3h.003Z"/>
      </svg>
    </a>
  </div>
</template>
