// RU staging mounts this app at /ru; production and EN staging use the root.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '')

export function pagePath(path: string) {
  return `${basePath}${path}`
}

export function artworkPath(name: string) {
  return pagePath(`/img/tokenomics-ai/${name}.png`)
}
