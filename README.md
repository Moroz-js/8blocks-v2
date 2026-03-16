# 8Blocks

Корпоративный сайт с блогом для 8Blocks — компании по разработке токеномики и стратегическому консалтингу.

**Stack:** Next.js 16 · TypeScript · SCSS Modules · Mantine · Framer Motion · Lenis · Payload CMS · PostgreSQL

---

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` нужен из-за peer dependency между Next.js 16 и Payload CMS 3.

### 2. Переменные окружения

Скопируйте `.env.example` и заполните значения:

```bash
cp .env.example .env.local
```

Обязательные переменные:

```env
DATABASE_URI=postgresql://user:password@localhost:5432/8blocks
PAYLOAD_SECRET=your-random-secret-key
```

### 3. База данных

Создайте PostgreSQL базу данных:

```sql
CREATE DATABASE 8blocks;
```

### 4. Миграции

Примените миграции для создания схемы:

```bash
npm run payload:migrate
```

Или при первом запуске с пустой БД:

```bash
npm run payload:migrate:create
npm run payload:migrate
```

### 5. Seed (опционально, для локальной разработки)

Заполните базу тестовыми данными:

```bash
npm run seed
```

Seed создаст категории, теги и статьи для тестирования блога.

> ⚠️ Seed работает только при `NODE_ENV=development`. Не запускайте на production без явного `SEED_ALLOWED=true`.

### 6. Запуск dev-сервера

```bash
npm run dev
```

Сайт: [http://localhost:3000](http://localhost:3000)  
Админка: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Структура проекта

```
src/
  app/               # Next.js App Router (роуты, layout, metadata)
  pages/             # Композиции страниц
  widgets/           # Крупные блоки UI (Header, Footer, HeroHome, ...)
  features/          # Пользовательские сценарии (submitContactForm, ...)
  entities/          # Типы бизнес-сущностей (Article, Category, ...)
  shared/            # Переиспользуемый код (UI kit, утилиты, конфиги)

payload/
  collections/       # Коллекции Payload CMS

migrations/          # Миграции БД (генерируются Payload)
scripts/             # seed.ts и другие скрипты
public/uploads/      # Загруженные медиа-файлы (не в git)
```

## npm скрипты

| Скрипт | Описание |
|--------|----------|
| `npm run dev` | Запустить dev-сервер |
| `npm run build` | Собрать production build |
| `npm run start` | Запустить production сервер |
| `npm run typecheck` | Проверить TypeScript |
| `npm run payload:migrate` | Применить миграции |
| `npm run payload:migrate:create` | Создать новую миграцию |
| `npm run seed` | Заполнить БД тестовыми данными |

---

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `DATABASE_URI` | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Секрет Payload CMS |
| `ADMIN_EMAIL` | Email первого администратора |
| `ADMIN_PASSWORD` | Пароль первого администратора |
| `SMTP_HOST` | SMTP хост для отправки писем |
| `SMTP_PORT` | SMTP порт |
| `SMTP_USER` | SMTP пользователь |
| `SMTP_PASSWORD` | SMTP пароль |
| `SMTP_FROM` | Имя и адрес отправителя |
| `ADMIN_NOTIFY_EMAIL` | Email для уведомлений о заявках |
| `NEXT_PUBLIC_SITE_URL` | Базовый URL сайта (для canonical, OG) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager ID |
