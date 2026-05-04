/* THIS FILE IS AUTO-MANAGED BY PAYLOAD */
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '@payload-config'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments?: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

/** Для `/admin` без хвоста Next даёт `segments` undefined. Нельзя подставлять `[]`: в Payload тогда path «/» → currentRoute `/admin/` ≠ `/admin` → 404. */
function payloadAdminParams(segments: string[] | undefined) {
  if (segments?.length) {
    return { segments }
  }
  return {}
}

export const generateMetadata = async ({ params, searchParams }: Args) => {
  const p = await params
  return generatePageMetadata({
    config,
    params: Promise.resolve(
      payloadAdminParams(p.segments) as { [key: string]: string | string[] },
    ),
    searchParams,
  })
}

const Page = async ({ params, searchParams }: Args) => {
  const p = await params
  return RootPage({
    config,
    params: Promise.resolve(
      payloadAdminParams(p.segments) as { segments: string[] },
    ),
    searchParams,
    importMap,
  })
}

export default Page
