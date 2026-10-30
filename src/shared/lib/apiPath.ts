// RU staging mounts the app at /ru; production and EN staging use the root.
// Client-side fetch() does not add basePath, so API calls must prefix it themselves.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '')

export function apiPath(path: string): string {
  return `${basePath}${path}`
}
