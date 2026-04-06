<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';

const { frontmatter, page } = useData();

function formatDate(date: string | number) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const lastUpdated = computed(() => {
  if (!page.value.lastUpdated) return null;
  return formatDate(page.value.lastUpdated);
});
</script>

<template>
  <div class="sm:px-8 mt-16 lg:mt-32">
    <div class="mx-auto w-full max-w-7xl lg:px-8">
      <div class="relative px-4 sm:px-8 lg:px-12">
        <div class="mx-auto max-w-2xl lg:max-w-5xl">
          <div class="xl:relative">
            <div class="mx-auto max-w-2xl">
              <a href="/posts" aria-label="Go back to articles" class="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 transition lg:absolute lg:my-0 lg:-top-1.5 lg:left-0">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700">
                  <path d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
              <article>
                <header class="flex flex-col">
                  <time v-if="frontmatter.date" class="order-first flex items-center text-base text-zinc-400" :datetime="frontmatter.date">
                    <span class="h-4 w-0.5 rounded-full bg-zinc-200"></span>
                    <span class="ml-3">{{ formatDate(frontmatter.date) }}</span>
                  </time>
                </header>
                <div class="prose">
                  <Content />
                </div>
                <footer v-if="lastUpdated" class="mt-12 pt-6 border-t border-zinc-100">
                  <p class="text-sm text-zinc-400">Last updated {{ lastUpdated }}</p>
                </footer>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
