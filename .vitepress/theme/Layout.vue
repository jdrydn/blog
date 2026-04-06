<script setup lang="ts">
import { useData } from 'vitepress';
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';
import HomeLayout from './HomeLayout.vue';
import PostLayout from './PostLayout.vue';
import SimpleLayout from './SimpleLayout.vue';
import EmploymentLayout from './EmploymentLayout.vue';
import NotFound from './NotFound.vue';

const { frontmatter, page } = useData();
</script>

<template>
  <div class="flex w-full">
    <div class="fixed inset-0 flex justify-center sm:px-8">
      <div class="flex w-full max-w-7xl lg:px-8">
        <div class="w-full bg-white ring-1 ring-zinc-100"></div>
      </div>
    </div>
    <div class="relative flex w-full flex-col">
      <SiteHeader />
      <main class="flex-auto">
        <NotFound v-if="page.isNotFound" />
        <HomeLayout v-else-if="frontmatter.layout === 'home'" />
        <PostLayout v-else-if="frontmatter.layout === 'post'" />
        <SimpleLayout v-else-if="frontmatter.layout === 'simple'" />
        <EmploymentLayout v-else-if="frontmatter.layout === 'employment'" />
        <Content v-else />
      </main>
      <SiteFooter />
    </div>
  </div>
</template>
