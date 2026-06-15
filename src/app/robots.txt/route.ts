import { getRobotsTxtContent } from '@/shared/lib/site-seo/get-robots-txt'

export const dynamic = 'force-dynamic'

export async function GET() {
  const body = await getRobotsTxtContent()
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
