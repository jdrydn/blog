import type { Theme } from 'vitepress';
import Layout from './Layout.vue';
import WebLink from './components/WebLink.vue';
import PostsLayout from './PostsLayout.vue';
import './style.css';

function initCopyButtons() {
  if (typeof document === 'undefined') return;

  document.addEventListener('click', (e) => {
    const button = (e.target as HTMLElement).closest('div[class*="language-"] .copy');
    if (!button) return;

    const parent = button.closest('div[class*="language-"]');
    const code = parent?.querySelector('code');
    if (!code) return;

    navigator.clipboard.writeText(code.textContent || '').then(() => {
      button.classList.add('copied');
      setTimeout(() => button.classList.remove('copied'), 2000);
    });
  });
}

export default {
  Layout,
  enhanceApp({ app }) {
    app.component('WebLink', WebLink);
    app.component('PostsLayout', PostsLayout);
    if (typeof window !== 'undefined') {
      initCopyButtons();
    }
  },
} satisfies Theme;
