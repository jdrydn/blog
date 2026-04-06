import type { Theme } from 'vitepress';
import Layout from './Layout.vue';
import WebLink from './components/WebLink.vue';
import PostsLayout from './PostsLayout.vue';
import './style.css';

export default {
  Layout,
  enhanceApp({ app }) {
    app.component('WebLink', WebLink);
    app.component('PostsLayout', PostsLayout);
  },
} satisfies Theme;
