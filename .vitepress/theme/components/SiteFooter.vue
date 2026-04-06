<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="mt-32 flex-none">
    <div class="sm:px-8">
      <div class="mx-auto w-full max-w-7xl lg:px-8">
        <div class="border-t border-zinc-100 pt-10 pb-16">
          <div class="relative px-4 sm:px-8 lg:px-12">
            <div class="mx-auto max-w-2xl lg:max-w-5xl">
              <div class="flex flex-col items-center justify-between gap-6 md:flex-row">
                <div class="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800">
                  <a href="/posts" class="transition hover:text-teal-500">Posts</a>
                  <a href="/projects" class="transition hover:text-teal-500">Projects</a>
                  <a href="/now" class="transition hover:text-teal-500">Now</a>
                </div>
                <p class="text-sm text-zinc-400">&copy; {{ year }} jdrydn</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
