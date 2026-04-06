import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'jdrydn',
  description:
    'Engineer at heart, found working on products, projects, microservices & APIs in Node.js, familiar with databases, templating, testing & devops.',

  head: [
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicons/favicon-16x16.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicons/favicon-32x32.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-touch-icon.png' }],
  ],

  cleanUrls: true,

  markdown: {
    theme: 'github-dark',
  },

  srcExclude: ['README.md'],

  lastUpdated: true,

  themeConfig: {
    links: {
      threads: 'https://www.threads.com/@jdrydn26',
      linkedin: 'https://linkedin.com/in/jdrydn',
      github: 'https://github.com/jdrydn',
    },
  },
});
