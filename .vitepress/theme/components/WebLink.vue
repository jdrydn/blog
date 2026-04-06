<script setup lang="ts">
const props = withDefaults(defineProps<{
  href: string;
  title?: string;
  description?: string;
  variant?: string;
  image?: string;
  icon?: string;
  iconAlt?: string;
}>(), {
  variant: 'slate',
});

const domain = props.href.replace(/^https?:\/\//, '').replace(/^www\./, '');
</script>

<template>
  <a :href="href" target="_blank" rel="nofollow noopener noreferrer" :class="[
    'group block w-full max-w-3xl my-5 overflow-hidden rounded-2xl border bg-white not-prose shadow-sm transition hover:shadow',
    `border-${variant}-200 hover:border-${variant}-300`,
  ]">
    <div class="flex flex-col sm:flex-row min-h-[120px]">
      <div class="flex flex-1 flex-col min-w-0 gap-2 px-5 py-4 order-2 sm:order-1">
        <span v-if="title" :class="[`text-[18px] font-bold leading-snug text-${variant}-800`]">{{ title }}</span>
        <p v-if="description" class="text-[15px] leading-snug">{{ description }}</p>
        <div class="mt-auto flex items-center gap-2">
          <img v-if="icon" :src="icon" :alt="iconAlt" class="h-5 w-5 flex-none rounded-sm" loading="lazy" height="10" width="10">
          <span class="min-w-0 truncate text-[15px] font-light">{{ domain }}</span>
        </div>
      </div>
      <div v-if="image" class="relative sm:w-[36%] sm:min-w-[220px] sm:max-w-[340px] flex-none order-1 sm:order-2">
        <img :src="image" :alt="title" class="h-full w-full max-h-[250px] sm:max-h-full object-cover" loading="lazy" height="200" width="200">
      </div>
    </div>
  </a>
</template>
