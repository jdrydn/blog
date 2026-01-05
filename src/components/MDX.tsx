import { onlyText } from 'react-children-utilities'
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { ArticleLayout } from './ArticleLayout';
import type { Post } from '@/lib/posts';

export { ArticleLayout } from './ArticleLayout';
export { ArticleTitle } from './ArticleTitle';
export { WebLinkFetchBlock, WebLinkPreviewBlock, getSocialLinkIcon } from './WebLink';

export function createMetadata(post: Post): Metadata {
  return {
    title: post.title,
    description: onlyText(post.description),
  }
}

export function createPage(post: Post) {
  return (props: { components?: {}; children: ReactNode }) => <ArticleLayout post={post} {...props} />;
}

export function parseDate(dirname: string) {
  const dateMatch = dirname.split('/').pop()?.match(/^(\d{4}-\d{2}-\d{2})/)
  return dateMatch ? new Date(dateMatch[1]) : undefined;
}
