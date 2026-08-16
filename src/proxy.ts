import { NextResponse, type NextRequest } from 'next/server'

const PATHNAME_HEADER = 'x-pathname'

// Внутренние инструкции со скриншотами админки существуют только на стейджинге:
// вне его и страницы, и картинки должны выглядеть как несуществующие.
const IS_STAGING = process.env.NEXT_PUBLIC_STAGING === 'true'
const STAGING_ONLY_PREFIX = '/staging-docs'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!IS_STAGING && pathname.startsWith(STAGING_ONLY_PREFIX)) {
    return new NextResponse(null, { status: 404 })
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(PATHNAME_HEADER, pathname)
  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: [
    // Статика под /staging-docs должна проходить проверку, поэтому идёт отдельным правилом.
    '/staging-docs/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot)$).*)',
  ],
}
