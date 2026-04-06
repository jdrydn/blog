import { createContentLoader } from 'vitepress';

interface Post {
  title: string;
  description: string;
  date: string;
  url: string;
}

export default createContentLoader('posts/*/index.md', {
  transform(rawData): Post[] {
    return rawData
      .filter((page) => page.frontmatter.layout === 'post')
      .map((page) => ({
        title: page.frontmatter.title,
        description: page.frontmatter.description || '',
        date: page.frontmatter.date,
        url: page.url,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
});

export declare const data: Post[];
