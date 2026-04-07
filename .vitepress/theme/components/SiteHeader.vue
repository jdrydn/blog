<script setup lang="ts">
import { icons as simpleIcons } from "@iconify-json/simple-icons";
import { icons as fa7Icons } from "@iconify-json/fa7-solid";

import { onMounted, ref } from 'vue';
import { getIconData, iconToSVG, iconToHTML, replaceIDs } from '@iconify/utils';

const emailPairs = [
  // 2.8 Conversion JS
  ['#this', 'mailto:'],
  // "Despite being frighteningly simple"
  ['-is', 'james'],
  // "this is expected to be one of the very best techniques"
  ['-the', '@'],
  // @link https://spencermortensen.com/articles/email-obfuscation
  ['-way', 'jdrydn.com'],
]

const emailHref = ref(emailPairs.map(([left]) => left).join(''));
onMounted(() => {
  emailHref.value = emailPairs.map(([, right]) => right).join('')
});

const buildIcon = (name: string, size: string = '1.5rem'): string => {
  const iconData = getIconData(simpleIcons, name) || getIconData(fa7Icons, name);
  if (!iconData) {
    throw new Error(`Icon "${iconName}" is missing`);
  }

  // Use it to render icon
  const renderData = iconToSVG(iconData, {
    height: size,
    width: size,
  });

  // Generate SVG string
  return iconToHTML(replaceIDs(renderData.body), renderData.attributes);
}
</script>

<template>
  <header class="pointer-events-none relative z-50 flex flex-none flex-col" style="height: var(--header-height); margin-bottom: var(--header-mb);">
    <div class="h-16 pt-6">
      <div class="mx-auto w-full max-w-7xl lg:px-8">
        <div class="relative flex gap-4 mx-5">
          <div class="flex flex-1">
            <a href="/" aria-label="Home" class="pointer-events-auto">
              <img src="/assets/images/avatar.png" alt="" class="rounded-full bg-zinc-100 object-cover h-9 w-9">
            </a>
          </div>
          <div class="flex flex-1 justify-end">
            <nav class="pointer-events-auto">
              <div class="flex items-center gap-6 text-sm font-medium text-zinc-800">
                <a class="group p-1 fill-zinc-500 transition group-hover:fill-zinc-600 h-6 w-6" aria-label="Follow on Threads"
                  href="https://www.threads.com/@jdrydn26" target="_blank" v-html="buildIcon('threads')" />
                <a class="group p-1 fill-zinc-500 transition group-hover:fill-zinc-600 h-6 w-6" aria-label="Follow on GitHub"
                  href="https://github.com/jdrydn" target="_blank" v-html="buildIcon('github')" />
                <a class="group p-1 fill-zinc-500 transition group-hover:fill-zinc-600 h-6 w-6" aria-label="Follow on LinkedIn"
                  href="https://linkedin.com/in/jdrydn" target="_blank" v-html="buildIcon('linkedin')" />
                <a class="group p-0 fill-zinc-500 transition group-hover:fill-zinc-600 h-6 w-6" aria-label="Email me"
                  :href="emailHref" v-html="buildIcon('envelope', '2rem')"/>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
