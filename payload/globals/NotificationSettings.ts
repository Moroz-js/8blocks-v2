import type { GlobalConfig } from 'payload'

/**
 * Настройки уведомлений о заявках (лидах).
 * Позволяет направить уведомления о новых заявках/подписках в Telegram-бота
 * без пересборки кода — только задать токен и chat_id в админке.
 */
export const NotificationSettings: GlobalConfig = {
  slug: 'notification-settings',
  label: 'Уведомления о заявках',
  admin: {
    group: 'CRM',
    description:
      'Отправка уведомлений о новых заявках и подписках в Telegram-бота. Пустой токен или chat_id — отправка в Telegram отключена.',
  },
  access: {
    // Только авторизованные пользователи CMS могут читать/менять настройки,
    // иначе токен бота утечёт через публичный REST-эндпоинт глобала.
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'telegramEnabled',
      type: 'checkbox',
      label: 'Включить уведомления в Telegram',
      defaultValue: false,
      admin: {
        description: 'Главный выключатель. Отдельные виды заявок не настраиваются — шлются все.',
      },
    },
    {
      name: 'telegramBotToken',
      type: 'text',
      label: 'Токен Telegram-бота',
      required: false,
      admin: {
        description:
          'Токен от @BotFather, например 123456789:AA… . Хранится в БД — не выводить в логи.',
        placeholder: '123456789:AA...',
      },
    },
    {
      name: 'telegramChatId',
      type: 'text',
      label: 'Chat ID',
      required: false,
      admin: {
        description:
          'ID чата/канала/пользователя, куда слать уведомления. Получить через @userinfobot или bot.sendMessage.',
        placeholder: '-1001234567890',
      },
    },
  ],
}
