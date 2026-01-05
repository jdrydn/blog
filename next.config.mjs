import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  outputFileTracingIncludes: {
    '/articles/*': ['./src/app/articles/**/*.mdx'],
  },
  env: {
    TZ: 'UTC',
  },
  images: {
    unoptimized: true,
  },
  webpack(config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) {
    // Workaround for webpack not supporting import.meta.dirname
    // - https://github.com/vercel/next.js/issues/60879#issuecomment-1900215814
    config.plugins.push(
      new webpack.DefinePlugin({
        "import.meta.dirname": "__dirname",
      }),
    );
    return config;
  },
}

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      // Highlight code blocks with Shiki
      [rehypePrettyCode, { themes: { light: 'github-dark', dark: 'github-dark' } }]
    ],
  },
})

export default withMDX(nextConfig)
