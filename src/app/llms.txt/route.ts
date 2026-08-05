import { getLlmsTxt } from '@/shared/lib/site-seo/get-llms-txt'

export const dynamic = 'force-dynamic'

export async function GET() {
  const body = await getLlmsTxt()
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
