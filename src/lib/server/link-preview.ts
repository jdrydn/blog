import 'server-only'
import assert from 'node:assert'
import fs from 'node:fs/promises'
import path from 'node:path'

export type LinkPreview = {
  url: string
  title?: string
  description?: string
  image?: string
  siteName?: string
}

// tweak as you like
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 // 24h

const DEFAULT_USER_AGENT = 'NextJS Blog WebLinkPreview component'

async function readCache(filePath: string, ttlMs: number) {
  try {
    const stat = await fs.stat(filePath)
    const age = Date.now() - stat.mtimeMs
    if (age > ttlMs) return null

    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw) as LinkPreview
  } catch {
    return null
  }
}

async function writeCache(filePath: string, data: LinkPreview) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}

/**
 * Minimal HTML parsing without extra deps.
 * (If you prefer, swap this for cheerio for more robust parsing.)
 */
function parsePreview(html: string, url: string): LinkPreview {
  const pick = (re: RegExp) => re.exec(html)?.[1]?.trim()

  const ogTitle = pick(
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
  )
  const titleTag = pick(/<title[^>]*>([^<]+)<\/title>/i)

  const ogDesc = pick(
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
  )
  const metaDesc = pick(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
  )

  const ogImage = pick(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
  )
  const ogSite = pick(
    /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
  )

  return {
    url,
    title: ogTitle ?? titleTag,
    description: ogDesc ?? metaDesc,
    image: ogImage,
    siteName: ogSite,
  }
}

export async function getLinkPreview(
  url: string,
  cachefile: string,
  opts?: { ttlMs?: number },
): Promise<LinkPreview | undefined> {
  const ttlMs = opts?.ttlMs ?? DEFAULT_TTL_MS

  assert(
    cachefile.endsWith('.json'),
    'Expected the main cachefile to be a JSON file',
  )

  const cached = await readCache(cachefile, ttlMs)
  if (cached) {
    return cached
  }

  if (process.env.NODE_ENV === 'production') {
    // Do not try and fetch a Link Preview during the build server - only during the dev server
    throw new Error(`Failed to fetch ${url}: ERR RUNNING IN PRODUCTION`)
  }

  const userAgent = process.env.WEBLINK_USER_AGENT || DEFAULT_USER_AGENT

  console.log('Fetching %s (with %s)', url, userAgent)

  // Next can also cache fetches; this is additive to disk cache.
  const res = await fetch(url, {
    // avoid caching forever if the remote changes often
    cache: 'no-store',
    headers: {
      'user-agent': userAgent,
    },
  })

  if (!res.ok) {
    // cache failures lightly? optional. For now, throw.
    throw new Error(`Failed to fetch ${url}: ${res.status}`)
  }

  const html = await res.text()
  const parsed = parsePreview(html, url)

  await writeCache(cachefile, parsed)
  return parsed
}
