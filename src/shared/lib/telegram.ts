import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Уведомления о заявках в Telegram.
 *
 * Настройки хранятся в глобале `notification-settings` (админка → CRM).
 * Чтение здесь идёт с overrideAccess:true — отправка выполняется на сервере
 * вне контекста пользователя CMS, а глобал закрыт от публичного REST.
 */

interface NotificationSettingsDoc {
  telegramEnabled?: boolean | null
  telegramBotToken?: string | null
  telegramChatId?: string | null
}

interface TelegramNotification {
  /** Заголовок уведомления, например «Новая заявка». */
  title: string
  /** Строки «Ключ: значение», выводятся по одной на строку. */
  fields: { label: string; value: string }[]
  /** Опционально — сайт-источник (URL), чтобы отличать инстансы. */
  siteUrl?: string
}

const TELEGRAM_API = 'https://api.telegram.org'

async function getNotificationSettings(): Promise<NotificationSettingsDoc | null> {
  try {
    const payload = await getPayload({ config })
    const doc = await payload.findGlobal({
      slug: 'notification-settings',
      overrideAccess: true,
    })
    return (doc ?? null) as NotificationSettingsDoc | null
  } catch {
    // Нет глобала или БД недоступна — молча пропускаем, уведомления не критичны.
    return null
  }
}

/** Отправка одного сообщения через Bot API. */
async function sendTelegramMessage(token: string, chatId: string, text: string): Promise<void> {
  const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Telegram ${res.status}: ${body.slice(0, 200)}`)
  }
}

/**
 * Отправляет уведомление о заявке в Telegram, если включено и заданы
 * токен + chat_id. Никогда не бросает: сбой Telegram не должен ломать
 * отправку заявки — ошибка логируется.
 */
export async function notifyTelegram(notification: TelegramNotification): Promise<void> {
  try {
    const settings = await getNotificationSettings()
    if (!settings?.telegramEnabled) return

    const token = settings.telegramBotToken?.trim()
    const chatId = settings.telegramChatId?.trim()
    if (!token || !chatId) return

    const lines: string[] = [notification.title, '']
    for (const f of notification.fields) {
      const value = (f.value ?? '').trim()
      if (value) lines.push(`${f.label}: ${value}`)
    }
    if (notification.siteUrl) {
      lines.push('', `Сайт: ${notification.siteUrl}`)
    }

    await sendTelegramMessage(token, chatId, lines.join('\n'))
  } catch (err) {
    console.error('[telegram] failed to send notification:', err)
  }
}
