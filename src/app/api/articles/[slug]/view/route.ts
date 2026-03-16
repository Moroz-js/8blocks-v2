import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'articles',
      where: {
        and: [
          { slug: { equals: slug } },
          { status: { equals: 'published' } },
        ],
      },
      limit: 1,
    })

    if (!result.docs.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const article = result.docs[0]
    const current = typeof article.views === 'number' ? article.views : 0

    await payload.update({
      collection: 'articles',
      id: article.id,
      data: { views: current + 1 },
    })

    return NextResponse.json({ views: current + 1 })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
