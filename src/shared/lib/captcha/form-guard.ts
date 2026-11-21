import { NextResponse, type NextRequest } from 'next/server'
import { uiStrings } from '@/shared/content/uiStrings'
import { isHoneypotFilled } from './provider'
import { clientIp, verifyCaptcha } from './server'

/**
 * Общие проверки публичных форм до записи в базу.
 * 1. Только application/json: запрос text/plain обходит CORS-проверку и позволяет слать форму с чужого сайта.
 * 2. Ловушка заполнена → обычный успех без записи, чтобы бот не узнал, что его отсеяли.
 */
export async function readPublicForm(
  req: NextRequest,
  logTag: string,
): Promise<{ body: Record<string, unknown> } | { response: NextResponse }> {
  const contentType = req.headers.get('content-type') ?? ''
  if (!/^application\/json\b/i.test(contentType)) {
    return { response: NextResponse.json({ error: uiStrings.formWrongContentType }, { status: 415 }) }
  }
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return { response: NextResponse.json({ error: 'Invalid request body' }, { status: 400 }) }
  }
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return { response: NextResponse.json({ error: 'Invalid request body' }, { status: 400 }) }
  }
  if (isHoneypotFilled(body)) {
    console.warn(`[honeypot] ${logTag}: dropped bot submission from ${clientIp(req.headers) ?? 'unknown ip'}`)
    return { response: NextResponse.json({ success: true }) }
  }
  return { body: body as Record<string, unknown> }
}

/** Проверка капчи; при отказе — готовый ответ 403. */
export async function checkCaptcha(req: NextRequest, body: Record<string, unknown>, logTag: string) {
  const ip = clientIp(req.headers)
  const verdict = await verifyCaptcha(body.captchaToken, ip)
  if (verdict.ok) return null
  console.warn(`[captcha] ${logTag}: ${verdict.reason} from ${ip ?? 'unknown ip'}`)
  return NextResponse.json({ error: uiStrings.captchaFailed }, { status: 403 })
}
