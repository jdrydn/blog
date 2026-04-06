<script setup lang="ts">
import { useData } from 'vitepress';

const { frontmatter } = useData();
</script>

<template>
  <div class="sm:px-8 mt-16 sm:mt-32">
    <div class="mx-auto w-full max-w-7xl lg:px-8">
      <div class="relative px-4 sm:px-8 lg:px-12">
        <div class="mx-auto max-w-2xl lg:max-w-5xl">
          <header class="max-w-2xl">
            <h1 class="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl">{{ frontmatter.heading }}</h1>
            <p v-if="frontmatter.intro" class="mt-6 text-base text-zinc-600" v-html="frontmatter.intro"></p>
          </header>
          <div class="mt-16 sm:mt-20">
            <Content />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
