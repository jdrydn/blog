import fs from 'fs/promises'
import glob from 'fast-glob'

export interface Post {
  title?: string
  description?: string
  date?: Date
  draft?: boolean
}

async function importPost(
  filename: string,
): Promise<{ post?: Post; slug: string; date: Date }> {
  const stat = await fs.stat(`./src/app/posts/${filename}`)

  let { post } = (await import(`../app/posts/${filename}`)) as {
    default: unknown // React.ComponentType
    post?: Post
  }

  return {
    post,
    date: post?.date ?? stat.ctime,
    slug: filename.replace(/(\/page)?\.mdx$/, ''),
  }
}

export async function getAllPosts() {
  const filenames = await glob('**/*/page.mdx', {
    cwd: './src/app/posts',
  })

  const items = await Promise.all(filenames.map(importPost))
  return (
    items
      // Remove any marked as "draft"
      .filter((a) => a.post?.draft !== true)
      // And sort by date
      .sort((a, z) => +new Date(z.date) - +new Date(a.date))
  )
}
