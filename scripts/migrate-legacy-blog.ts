/**
 * Локальная миграция Prisma-блога → Payload по mapping JSON + папка data (uploads + .sql дамп).
 *
 *   npm run migrate:legacy -- --mapping=migration/migrate-sites.json
 *
 *   --lang=ru|en — только с --internal-site: язык полей legacy (title/content Ru vs EN), перекрывает site.lang в mapping.
 *
 * Данные читаются только из PostgreSQL (SELECT), не из текста .sql. sourceDatabaseUrl — БД, где лежит
 * legacy после импорта дампа (часто localhost). importSqlDump:true — перед миграцией: psql -f dumpFile в эту БД.
 * `--dry-run` — без psql-импорта.
 *
 * После миграции (если не `--dry-run` и не `--skip-remote-uploads` / `--skip-upload-ssh`) `public/uploads` → `remoteUploadsPath`: сначала `rsync`, иначе `tar | ssh` (те же `ssh.*`, что в mapping). Перед rsync выполняется `rsync -n --stats`: если передавать нечего, выгрузка пропускается.
 * При `ssh.tunnel: true` дополнительно поднимается `ssh -L` к Postgres; uploads идут отдельным SSH-каналом.
 *
 * Файлы-источник обложек: dataDir/uploads/; Payload пишет в public/uploads.
 *
 * В development Payload по умолчанию открывает WebSocket к Next HMR — без отключения процесс не завершается.
 * Скрипт выставляет DISABLE_PAYLOAD_HMR=true, если вы сами не задали переменную.
 */
import { randomBytes } from 'node:crypto'
import fs from 'fs'
import os from 'os'
import path from 'path'
import net from 'net'
import { spawn, spawnSync, type ChildProcess } from 'child_process'
import { pathToFileURL } from 'url'
import { Client } from 'pg'
import * as cheerio from 'cheerio'
import type { AnyNode } from 'domhandler'
import { getPayload } from 'payload'
import type { Payload } from 'payload'

const ROOT = process.cwd()

if (process.env.DISABLE_PAYLOAD_HMR === undefined) {
  process.env.DISABLE_PAYLOAD_HMR = 'true'
}

type PayloadGlobalCacheEntry = { ws?: { close: () => void } | null }

/** destroy() не закрывает HMR-WebSocket Payload — закрываем вручную, иначе Node не выходит. */
function closePayloadCliSockets() {
  const m = (globalThis as typeof globalThis & { _payload?: Map<string, PayloadGlobalCacheEntry> })
    ._payload
  if (!m) return
  for (const c of m.values()) {
    const w = c?.ws
    if (w && typeof w.close === 'function') {
      try {
        w.close()
      } catch {
        /* ignore */
      }
    }
    if (c) c.ws = null
  }
}

function wipePayloadGlobalCache() {
  const m = (globalThis as typeof globalThis & { _payload?: Map<string, unknown> })._payload
  m?.clear()
}

async function shutdownPayload(payload: { destroy: () => Promise<void> }) {
  await payload.destroy()
  closePayloadCliSockets()
  wipePayloadGlobalCache()
}

type SiteSsh = {
  host: string
  user: string
  port?: number
  /** Путь к приватному ключу; если есть — пароль SSH не используется. */
  keyPath?: string
  /** Имя переменной окружения с паролем SSH. На Windows без ключа нужен sshpass в PATH или используйте keyPath. */
  passwordEnv?: string
  /**
   * Поднять `ssh -L 127.0.0.1:local:remotePostgresHost:remotePostgresPort` и подставить в DATABASE_URI
   * хост 127.0.0.1 и локальный порт (логин/пароль БД берутся из databaseUri).
   */
  tunnel?: boolean
  /** Фиксированный локальный порт; иначе — свободный. */
  localPort?: number
  /** Адрес Postgres на стороне сервера (часто 127.0.0.1). */
  remotePostgresHost?: string
  remotePostgresPort?: number
}

type SiteMapping = {
  id: string
  lang: 'ru' | 'en' | string
  databaseUri: string
  ssh?: SiteSsh
  remoteUploadsPath: string
}

type MappingFile = {
  _readme?: string
  sourceDatabaseUrl: string
  dataDir: string
  /** Имя файла в dataDir; для importSqlDump — обычно *.sql */
  dumpFile?: string
  /** true: перед миграцией один раз выполнить psql -f dumpFile в sourceDatabaseUrl */
  importSqlDump?: boolean
  sites: SiteMapping[]
}

const dryRun = process.argv.includes('--dry-run')
const skipExisting = process.argv.includes('--skip-existing')
const skipRemoteUploads =
  process.argv.includes('--skip-remote-uploads') || process.argv.includes('--skip-upload-ssh')

function argValue(name: string): string | undefined {
  const pref = `${name}=`
  const hit = process.argv.find((a) => a.startsWith(pref))
  if (hit) return hit.slice(pref.length)
  const idx = process.argv.indexOf(name)
  if (idx >= 0) {
    const next = process.argv[idx + 1]
    if (next && !next.startsWith('-')) return next
  }
  return undefined
}

function expandPath(p: string): string {
  if (p.startsWith('~/')) return path.join(os.homedir(), p.slice(2))
  return path.isAbsolute(p) ? p : path.resolve(ROOT, p)
}

/** При входе по паролю отключаем перебор ~/.ssh/* — иначе битый id_rsa мешает до password и даёт «invalid format». */
function sshPasswordAuthOpts(): string[] {
  return ['-o', 'PubkeyAuthentication=no', '-o', 'PreferredAuthentications=password,keyboard-interactive']
}

function loadMapping(mappingPath: string): MappingFile {
  const abs = expandPath(mappingPath)
  const raw = fs.readFileSync(abs, 'utf8')
  const data = JSON.parse(raw) as MappingFile
  if (!data.sourceDatabaseUrl || !data.dataDir || !Array.isArray(data.sites)) {
    console.error('mapping: нужны sourceDatabaseUrl, dataDir, sites[]')
    process.exit(1)
  }
  return data
}

function redactDatabaseUri(uri: string): string {
  try {
    const u = new URL(uri)
    if (u.password) u.password = '****'
    return u.toString()
  } catch {
    return uri
  }
}

/** Подключение с UTF-8 и проверка server_encoding (LATIN1/SQL_ASCII ломают кириллицу). */
async function connectPostgresClientUtf8(connectionString: string): Promise<Client> {
  const client = new Client({ connectionString })
  await client.connect()
  await client.query(`SET client_encoding TO 'UTF8'`)
  try {
    const r = await client.query<{ server_encoding: string }>('SHOW server_encoding')
    const enc = r.rows[0]?.server_encoding?.toUpperCase()
    if (enc && enc !== 'UTF8') {
      console.warn(
        `⚠ PostgreSQL server_encoding=${enc} (нужен UTF8). Кириллица может отображаться как «?». Пересоздайте БД с ENCODING 'UTF8' (template0).`,
      )
    }
  } catch {
    /* ignore */
  }
  return client
}

/** true, если URI ведёт на эту машину — миграция не затронет Postgres на VPS без туннеля/прямого хоста. */
function isLoopbackDatabaseUri(uri: string): boolean {
  try {
    const u = new URL(uri)
    const host = (u.hostname || '').replace(/^\[(.+)\]$/, '$1').toLowerCase()
    return host === 'localhost' || host === '127.0.0.1' || host === '::1'
  } catch {
    return false
  }
}

function warnIfTargetDbIsLocalOnly(site: SiteMapping) {
  if (site.ssh?.tunnel) return
  const uri = site.databaseUri.trim()
  if (!isLoopbackDatabaseUri(uri)) return
  const h = site.ssh?.host
  console.warn('')
  console.warn(
    '⚠  databaseUri указывает на localhost/127.0.0.1 — без SSH-туннеля данные пишутся в Postgres только на этой машине.',
  )
  if (h) {
    console.warn(
      `   Задан ssh.host=${h}: добавьте \"tunnel\": true в объект ssh — скрипт поднимет ssh -L к Postgres на сервере.`,
    )
  } else {
    console.warn(
      '   Для VPS: \"tunnel\": true + блок ssh, либо прямой databaseUri на хост сервера, либо ручной ssh -L и порт в URI.',
    )
  }
  console.warn('')
}

function sleepMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function findFreeTcpPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const s = net.createServer()
    s.on('error', reject)
    s.listen(0, '127.0.0.1', () => {
      const a = s.address()
      const p = typeof a === 'object' && a && 'port' in a ? a.port : 0
      s.close(() => resolve(p))
    })
  })
}

async function waitForTcpOpen(host: string, port: number, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs
  for (;;) {
    const ok = await new Promise<boolean>((resolve) => {
      const sock = net.createConnection({ host, port }, () => {
        sock.destroy()
        resolve(true)
      })
      sock.on('error', () => {
        sock.destroy()
        resolve(false)
      })
    })
    if (ok) return
    if (Date.now() >= deadline) {
      throw new Error(
        `Таймаут ожидания локального порта ${port} (туннель не поднялся: ssh, ключ, пароль, remotePostgresHost/Port).`,
      )
    }
    await sleepMs(150)
  }
}

type SshTunnelHandle = { child: ChildProcess; localPort: number }

function rewriteDatabaseUriLoopbackPort(uri: string, localPort: number): string {
  const u = new URL(uri)
  u.hostname = '127.0.0.1'
  u.port = String(localPort)
  return u.href
}

/** Запуск ssh (или sshpass+ssh) с -L; ждёт, пока локальный порт начнёт принимать соединения. */
async function startSshPostgresTunnel(site: SiteMapping): Promise<SshTunnelHandle> {
  const ssh = site.ssh
  if (!ssh?.tunnel) {
    throw new Error('startSshPostgresTunnel: нужен ssh.tunnel')
  }
  if (!ssh.host?.trim() || !ssh.user?.trim()) {
    console.error('ssh.tunnel: true требует ssh.host и ssh.user')
    process.exit(1)
  }
  const rHost = ssh.remotePostgresHost?.trim() || '127.0.0.1'
  const rPort = ssh.remotePostgresPort ?? 5432
  const sshPort = ssh.port ?? 22
  const localPort = ssh.localPort && ssh.localPort > 0 ? ssh.localPort : await findFreeTcpPort()

  const sshBaseArgs = [
    '-N',
    '-o',
    'ExitOnForwardFailure=yes',
    '-o',
    'ServerAliveInterval=30',
    '-o',
    'ServerAliveCountMax=4',
    '-o',
    'ConnectTimeout=25',
    '-L',
    `127.0.0.1:${localPort}:${rHost}:${rPort}`,
    '-p',
    String(sshPort),
  ]
  const target = `${ssh.user}@${ssh.host}`

  let cmd: string
  let args: string[]
  let env: NodeJS.ProcessEnv = { ...process.env }

  if (ssh.keyPath) {
    const key = expandPath(ssh.keyPath)
    if (!fs.existsSync(key)) {
      console.error(`SSH keyPath не найден: ${key}`)
      process.exit(1)
    }
    cmd = 'ssh'
    args = [...sshBaseArgs, '-i', key, '-o', 'BatchMode=yes', target]
  } else if (ssh.passwordEnv) {
    const pass = process.env[ssh.passwordEnv]
    if (!pass) {
      console.error(
        `Переменная ${ssh.passwordEnv} пуста (пароль SSH для туннеля). Или задайте ssh.keyPath.`,
      )
      process.exit(1)
    }
    cmd = 'sshpass'
    args = ['-e', 'ssh', ...sshBaseArgs, ...sshPasswordAuthOpts(), '-o', 'BatchMode=no', target]
    env.SSHPASS = pass
  } else {
    cmd = 'ssh'
    args = [...sshBaseArgs, '-o', 'BatchMode=yes', target]
  }

  console.log(
    `→ SSH туннель: локально 127.0.0.1:${localPort} → ${rHost}:${rPort} на ${ssh.user}@${ssh.host}:${sshPort}`,
  )

  const child = spawn(cmd, args, {
    env,
    stdio: ['ignore', 'ignore', 'pipe'],
    windowsHide: true,
  })

  let stderrBuf = ''
  child.stderr?.on('data', (chunk: Buffer) => {
    const t = chunk.toString()
    stderrBuf += t
    if (stderrBuf.length > 4000) stderrBuf = stderrBuf.slice(-4000)
    process.stderr.write(t)
  })

  child.once('exit', (code, signal) => {
    if (code !== 0 && code !== null) {
      console.error(`SSH туннель завершился (code=${code} signal=${signal ?? ''})`)
      if (stderrBuf.trim()) console.error(stderrBuf.trim())
    }
  })

  const spawnErr = await new Promise<Error | null>((resolve) => {
    const t = setTimeout(() => resolve(null), 10_000)
    child.once('error', (e) => {
      clearTimeout(t)
      resolve(e as Error)
    })
    child.once('spawn', () => {
      clearTimeout(t)
      resolve(null)
    })
  })
  if (spawnErr) {
    console.error(`Не удалось запустить ${cmd}:`, spawnErr.message)
    const code = (spawnErr as NodeJS.ErrnoException).code
    if (code === 'ENOENT') {
      console.error(
        'Команда не найдена в PATH. Нужны ssh (OpenSSH); для пароля SSH — sshpass или укажите ssh.keyPath.',
      )
    }
    process.exit(1)
  }

  await sleepMs(500)
  try {
    await waitForTcpOpen('127.0.0.1', localPort, 55_000)
  } catch (e) {
    try {
      child.kill('SIGTERM')
    } catch {
      /* ignore */
    }
    throw e
  }

  return { child, localPort }
}

function stopSshTunnel(handle: SshTunnelHandle | null) {
  if (!handle) return
  try {
    handle.child.kill('SIGTERM')
  } catch {
    /* ignore */
  }
  setTimeout(() => {
    try {
      if (!handle.child.killed) handle.child.kill('SIGKILL')
    } catch {
      /* ignore */
    }
  }, 2000)
}

/** Путь для удалённой команды без кавычек (иначе ssh.exe на Windows искажает remote command при вложенных кавычках). */
function assertPlainUnixPathForRemote(label: string, p: string): string {
  const n = p.replace(/\\/g, '/').trim()
  if (n === '/') return n
  if (/^\/[a-zA-Z0-9/_\-.]+$/.test(n)) return n
  console.error(
    `${label}: допустимы только абсолютные Unix-пути из [A-Za-z0-9/_\-.] без пробелов (или «/»): ${p}`,
  )
  process.exit(1)
}

type RsyncUploadsConfig = {
  env: NodeJS.ProcessEnv
  src: string
  dest: string
  remoteDir: string
  label: string
}

/** Общий RSYNC_RSH + пути для rsync uploads (локальный каталог со слэшем → user@host:remoteDir/). */
function getRsyncUploadsConfig(
  localUploadsAbs: string,
  site: SiteMapping,
): RsyncUploadsConfig | null {
  const ssh = site.ssh!
  const port = ssh.port ?? 22
  const remoteDir = site.remoteUploadsPath.replace(/\\/g, '/').replace(/\/?$/, '/')
  const dest = `${ssh.user}@${ssh.host}:${remoteDir}`
  const src = path.resolve(localUploadsAbs).replace(/\\/g, '/') + '/'

  const env = { ...process.env } as NodeJS.ProcessEnv
  let rsh = `ssh -p ${port} -o ConnectTimeout=60 -o ServerAliveInterval=30`
  if (ssh.keyPath) {
    rsh += ` -i ${expandPath(ssh.keyPath)} -o BatchMode=yes`
  } else {
    rsh += ` -o BatchMode=no`
  }
  if (ssh.passwordEnv && !ssh.keyPath) {
    const p = process.env[ssh.passwordEnv]
    if (!p) return null
    env.SSHPASS = p
    rsh = `sshpass -e ${rsh}`
    rsh += ` -o PubkeyAuthentication=no -o PreferredAuthentications=password,keyboard-interactive`
  }
  env.RSYNC_RSH = rsh
  const label = `${ssh.user}@${ssh.host}:${remoteDir}`
  return { env, src, dest, remoteDir, label }
}

/**
 * true — по rsync -n на сервере уже всё совпадает с локальным public/uploads, реальную выгрузку можно не делать.
 * false — есть отличия или не удалось надёжно проверить (тогда делаем обычный rsync).
 */
function rsyncUploadsRemoteAlreadyUpToDate(cfg: RsyncUploadsConfig): boolean {
  const r = spawnSync('rsync', ['-avzn', '--stats', cfg.src, cfg.dest], {
    env: cfg.env,
    encoding: 'utf8',
    cwd: ROOT,
  })
  if (r.error && (r.error as NodeJS.ErrnoException).code === 'ENOENT') return false
  if (r.status !== 0) return false
  const out = `${r.stdout || ''}\n${r.stderr || ''}`
  const m = out.match(/Number of regular files transferred:\s*(\d+)/i)
  if (!m) return false
  return m[1] === '0'
}

/** rsync localDir/ → user@host:remoteDir/ (без --delete — не трогаем лишние файлы на сервере). */
function tryRsyncUploads(localUploadsAbs: string, site: SiteMapping): 'ok' | 'not_found' | 'error' {
  const cfg = getRsyncUploadsConfig(localUploadsAbs, site)
  if (!cfg) {
    const ssh = site.ssh!
    console.error(`rsync: переменная ${ssh.passwordEnv} пуста`)
    return 'error'
  }

  console.log(`→ rsync uploads → ${cfg.label}`)
  const r = spawnSync('rsync', ['-avz', cfg.src, cfg.dest], {
    env: cfg.env,
    stdio: 'inherit',
    cwd: ROOT,
  })
  if (r.error && (r.error as NodeJS.ErrnoException).code === 'ENOENT') return 'not_found'
  if (r.status !== 0) return 'error'
  return 'ok'
}

/** tar czf каталога uploads | ssh … tar xzf в родитель remoteUploadsPath. */
async function tarPipeUploadsToRemote(localUploadsAbs: string, site: SiteMapping): Promise<void> {
  const ssh = site.ssh!
  const port = ssh.port ?? 22
  const publicDir = path.resolve(path.dirname(localUploadsAbs))
  const uploadsName = path.basename(localUploadsAbs)
  const rawRemote = (site.remoteUploadsPath || '').replace(/\\/g, '/').trim()
  if (!rawRemote) {
    console.error('tar|ssh: в mapping пустой remoteUploadsPath')
    process.exit(1)
  }
  const remotePath = rawRemote.replace(/\/+$/, '') || '/'
  const remoteParent = path.posix.dirname(remotePath)
  if (!remoteParent) {
    console.error(`tar|ssh: не удалось вычислить родительский каталог для ${remotePath}`)
    process.exit(1)
  }
  const rp = assertPlainUnixPathForRemote('tar|ssh remoteUploadsPath', remotePath)
  const rpar = assertPlainUnixPathForRemote('tar|ssh (родитель uploads)', remoteParent)
  /** Одна строка без вложенных кавычек — иначе OpenSSH на Windows искажает remote command. */
  const remoteCmd = `mkdir -p ${rp} && tar xzf - -C ${rpar}`
  const target = `${ssh.user}@${ssh.host}`

  const sshBase = [
    '-p',
    String(port),
    '-o',
    'ConnectTimeout=60',
    '-o',
    'ServerAliveInterval=30',
    ...(ssh.keyPath || !ssh.passwordEnv ? [] : sshPasswordAuthOpts()),
    target,
    remoteCmd,
  ]

  let file: string
  let args: string[]
  let env: NodeJS.ProcessEnv = { ...process.env }

  if (ssh.keyPath) {
    const key = expandPath(ssh.keyPath)
    file = 'ssh'
    args = ['-i', key, '-o', 'BatchMode=yes', ...sshBase]
  } else if (ssh.passwordEnv) {
    const p = process.env[ssh.passwordEnv]
    if (!p) {
      console.error(`tar|ssh: переменная ${ssh.passwordEnv} пуста`)
      process.exit(1)
    }
    env.SSHPASS = p
    file = 'sshpass'
    args = ['-e', 'ssh', '-o', 'BatchMode=no', ...sshBase]
  } else {
    file = 'ssh'
    args = ['-o', 'BatchMode=yes', ...sshBase]
  }

  console.log(`→ tar|ssh uploads → ${target}:${remotePath}`)

  await new Promise<void>((resolve, reject) => {
    let settled = false
    const finish = (fn: () => void) => {
      if (settled) return
      settled = true
      fn()
    }

    const tar = spawn('tar', ['czf', '-', '-C', publicDir, uploadsName], {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: ROOT,
    })
    const sshP = spawn(file, args, { env, stdio: ['pipe', 'inherit', 'pipe'] })

    let errTail = ''
    const collect = (c: Buffer) => {
      errTail += c.toString()
      if (errTail.length > 6000) errTail = errTail.slice(-6000)
    }
    tar.stderr?.on('data', collect)
    sshP.stderr?.on('data', (c) => {
      collect(c)
      process.stderr.write(c)
    })

    const swallowStdinNoise = (e: NodeJS.ErrnoException) => {
      if (e.code === 'EPIPE' || e.code === 'ERR_STREAM_DESTROYED') return
      if (!settled) finish(() => reject(e))
    }
    sshP.stdin?.on('error', swallowStdinNoise)
    tar.stdout.on('error', swallowStdinNoise)

    tar.stdout.pipe(sshP.stdin)

    tar.on('error', (e) => {
      try {
        sshP.kill('SIGTERM')
      } catch {
        /* ignore */
      }
      finish(() => reject(e))
    })
    sshP.on('error', (e) => {
      try {
        tar.kill('SIGTERM')
      } catch {
        /* ignore */
      }
      finish(() => reject(e))
    })
    tar.on('close', (code) => {
      if (code !== 0) {
        try {
          sshP.kill('SIGTERM')
        } catch {
          /* ignore */
        }
        finish(() => reject(new Error(`tar завершился с code=${code}\n${errTail}`)))
      }
    })
    sshP.on('close', (code) => {
      if (code === 0) finish(() => resolve())
      else finish(() => reject(new Error(`ssh завершился с code=${code}\n${errTail}`)))
    })
  })
}

async function syncPayloadUploadsToRemote(localUploadsAbs: string, site: SiteMapping) {
  if (skipRemoteUploads) {
    console.log('→ выгрузка uploads пропущена (--skip-remote-uploads или --skip-upload-ssh)')
    return
  }
  if (dryRun) {
    console.log(`[dry-run] не выгружаем uploads на ${site.remoteUploadsPath}`)
    return
  }
  if (!site.ssh?.host) {
    console.warn('→ ssh.host не задан — выгрузка uploads на сервер пропущена.')
    return
  }
  if (!fs.existsSync(localUploadsAbs)) {
    console.warn(`→ нет папки ${localUploadsAbs}, выгрузка пропущена.`)
    return
  }
  const hasFiles = fs.readdirSync(localUploadsAbs).some((n) => n !== '.gitkeep')
  if (!hasFiles) {
    console.log('→ public/uploads пуст (или только .gitkeep) — rsync/tar не запускаем.')
    return
  }

  const rsyncCfg = getRsyncUploadsConfig(localUploadsAbs, site)
  if (rsyncCfg && rsyncUploadsRemoteAlreadyUpToDate(rsyncCfg)) {
    console.log(
      `→ выгрузка uploads пропущена: на ${rsyncCfg.label} уже есть те же файлы (проверка rsync --dry-run).`,
    )
    return
  }

  const rs = tryRsyncUploads(localUploadsAbs, site)
  if (rs === 'ok') {
    console.log('✓ uploads выгружены (rsync)')
    return
  }
  if (rs === 'error') {
    console.error('✗ rsync завершился с ошибкой (см. вывод выше).')
    process.exit(1)
  }

  console.log('→ rsync не найден в PATH, использую tar | ssh …')
  try {
    await tarPipeUploadsToRemote(localUploadsAbs, site)
    console.log('✓ uploads выгружены (tar|ssh)')
  } catch (e) {
    console.error('✗ tar|ssh:', e)
    process.exit(1)
  }
}

/** Один раз перед сайтами: залить plain SQL в БД legacy (psql). */
function importSqlDumpWithPsql(connectionString: string, sqlFileAbs: string) {
  if (!fs.existsSync(sqlFileAbs)) {
    console.error(`Файл дампа не найден: ${sqlFileAbs}`)
    process.exit(1)
  }
  if (!sqlFileAbs.toLowerCase().endsWith('.sql')) {
    console.error('importSqlDump поддерживает только .sql (plain). Для custom используйте pg_restore вручную.')
    process.exit(1)
  }
  console.log(`→ psql импорт ${sqlFileAbs} → ${redactDatabaseUri(connectionString)}`)
  const r = spawnSync(
    'psql',
    [connectionString, '-v', 'ON_ERROR_STOP=1', '-f', sqlFileAbs],
    {
      stdio: 'inherit',
      cwd: ROOT,
      env: { ...process.env, PGCLIENTENCODING: 'UTF8' },
    },
  )
  if (r.error && (r.error as NodeJS.ErrnoException).code === 'ENOENT') {
    console.error('Команда psql не найдена. Установите PostgreSQL client и добавьте в PATH, или импортируйте .sql вручную.')
    process.exit(1)
  }
  if (r.status !== 0) {
    console.error('psql завершился с ошибкой (часто \\restrict в дампе — удалите строки или обновите psql).')
    process.exit(r.status ?? 1)
  }
  console.log('✓ SQL импортирован')
}

function clearLocalUploads() {
  const dir = path.join(ROOT, 'public', 'uploads')
  if (!fs.existsSync(dir)) return
  for (const name of fs.readdirSync(dir)) {
    if (name === '.gitkeep') continue
    fs.rmSync(path.join(dir, name), { recursive: true, force: true })
  }
}

// ── rich text / статьи (HTML → Lexical) ──

function makeRichText(blocks: object[]) {
  return {
    root: {
      type: 'root',
      children: blocks,
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

function paragraph(children: object[]): object {
  return {
    type: 'paragraph',
    children,
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  }
}

function textNode(text: string): object {
  return { type: 'text', text, version: 1 }
}

function paragraphText(text: string): object {
  return paragraph([textNode(text)])
}

function heading(text: string, tag: 'h2' | 'h3'): object {
  return {
    type: 'heading',
    tag,
    children: [textNode(text)],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  }
}

function quoteBlock(text: string): object {
  return {
    type: 'quote',
    children: [textNode(text)],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  }
}

function lexicalList(listType: 'bullet' | 'number', items: string[]): object {
  return {
    type: 'list',
    listType,
    children: items.map((t) => ({
      type: 'listitem',
      children: [paragraphText(t)],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    })),
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  }
}

function horizontalRule(): object {
  return { type: 'horizontalrule', version: 1 }
}

/** Lexical upload node (Payload richtext-lexical v3, см. UploadServerNode.exportJSON). */
function lexicalUploadNode(mediaId: string, alt: string): object {
  const safeAlt = (alt || 'image').slice(0, 500)
  return {
    type: 'upload',
    format: '',
    version: 3,
    id: randomBytes(12).toString('hex'),
    relationTo: 'media',
    value: mediaId,
    fields: { alt: safeAlt },
  }
}

/** Предпочитает primary после trim; если пусто — fallback (иначе пробелы в *Ru ломали выбор EN-поля). */
function pickLocalizedText(
  primary: string | null | undefined,
  fallback: string | null | undefined,
): string {
  const a = primary?.trim()
  if (a) return a
  return fallback?.trim() ?? ''
}

function pickTitle(row: Record<string, unknown>, useRu: boolean): string {
  const ru = row.titleRu as string | null | undefined
  const en = row.title as string | null | undefined
  const t = useRu ? pickLocalizedText(ru, en) : pickLocalizedText(en, ru)
  return t || 'Untitled'
}

function pickExcerpt(row: Record<string, unknown>, useRu: boolean): string | undefined {
  const ru = row.excerptRu as string | null | undefined
  const en = row.excerpt as string | null | undefined
  const s = useRu ? pickLocalizedText(ru, en) : pickLocalizedText(en, ru)
  return s || undefined
}

function pickContentHtml(row: Record<string, unknown>, useRu: boolean): string {
  const ru = row.contentRu as string | null | undefined
  const en = row.content as string | null | undefined
  const html = useRu ? pickLocalizedText(ru, en) : pickLocalizedText(en, ru)
  return html
}

// ── категории: локаль из legacy Category ──

function pickCategoryName(row: Record<string, unknown>, useRu: boolean): string {
  const ru = row.nameRu as string | null | undefined
  const en = row.name as string | null | undefined
  const t = useRu ? pickLocalizedText(ru, en) : pickLocalizedText(en, ru)
  return t || 'Category'
}

function pickCategoryDesc(row: Record<string, unknown>, useRu: boolean): string | undefined {
  const ru = row.descriptionRu as string | null | undefined
  const en = row.description as string | null | undefined
  const s = useRu ? pickLocalizedText(ru, en) : pickLocalizedText(en, ru)
  return s || undefined
}

function normalizeFeaturedPath(raw: string | null | undefined): string | null {
  if (!raw || !String(raw).trim()) return null
  let s = String(raw).trim()
  try {
    if (/^https?:\/\//i.test(s)) {
      const u = new URL(s)
      s = u.pathname
    }
  } catch {
    /* keep s */
  }
  s = s.replace(/^\/+/, '')
  const idx = s.toLowerCase().indexOf('uploads/')
  if (idx >= 0) s = s.slice(idx + 'uploads/'.length)
  const base = path.basename(s)
  return base || null
}

function htmlToLexical(html: string, mediaByBasename: Map<string, string> = new Map()): object {
  const trimmed = html.trim()
  if (!trimmed) return makeRichText([paragraphText(' ')])

  const wrapped = trimmed.startsWith('<') ? trimmed : `<p>${escapeHtml(trimmed)}</p>`
  const $ = cheerio.load(wrapped, null, false)
  const blocks: object[] = []

  const pushTextBlocks = (el: cheerio.Cheerio<AnyNode>) => {
    el.contents().each((_, node) => {
      if (node.type === 'text') {
        const t = $(node).text().replace(/\s+/g, ' ').trim()
        if (t) blocks.push(paragraphText(t))
      }
    })
  }

  const walk = (container: cheerio.Cheerio<AnyNode>) => {
    container.children().each((_, el) => {
      if (el.type !== 'tag') return
      const name = el.tagName.toLowerCase()
      const $el = $(el)

      if (name === 'p') {
        const t = $el.text().replace(/\s+/g, ' ').trim()
        if (t) blocks.push(paragraphText(t))
        return
      }
      if (name === 'h1' || name === 'h2') {
        const t = $el.text().trim()
        if (t) blocks.push(heading(t, 'h2'))
        return
      }
      if (name === 'h3' || name === 'h4' || name === 'h5' || name === 'h6') {
        const t = $el.text().trim()
        if (t) blocks.push(heading(t, 'h3'))
        return
      }
      if (name === 'blockquote') {
        const t = $el.text().trim()
        if (t) blocks.push(quoteBlock(t))
        return
      }
      if (name === 'hr') {
        blocks.push(horizontalRule())
        return
      }
      if (name === 'ul') {
        const items: string[] = []
        $el.find('> li').each((__, li) => {
          const t = $(li).text().replace(/\s+/g, ' ').trim()
          if (t) items.push(t)
        })
        if (items.length) blocks.push(lexicalList('bullet', items))
        return
      }
      if (name === 'ol') {
        const items: string[] = []
        $el.find('> li').each((__, li) => {
          const t = $(li).text().replace(/\s+/g, ' ').trim()
          if (t) items.push(t)
        })
        if (items.length) blocks.push(lexicalList('number', items))
        return
      }
      if (name === 'br') return
      if (name === 'div' && $el.attr('data-type') === 'embed') {
        const clone = $el.clone()
        clone.find('style').remove()
        const aside = clone.find('aside').first()
        const t = (aside.length ? aside : clone).text().replace(/\s+/g, ' ').trim()
        if (t) blocks.push(paragraphText(t))
        return
      }
      if (name === 'div' || name === 'section' || name === 'article' || name === 'main') {
        walk($el)
        return
      }
      if (name === 'img') {
        const alt = $el.attr('alt')?.trim() || 'image'
        const src = $el.attr('src') || ''
        const basename = normalizeFeaturedPath(src)
        const mediaId = basename ? mediaByBasename.get(basename) : undefined
        if (mediaId) {
          blocks.push(lexicalUploadNode(mediaId, alt))
        } else {
          blocks.push(paragraphText(`[image: ${alt}]`))
        }
        return
      }
      const t = $el.text().replace(/\s+/g, ' ').trim()
      if (t) blocks.push(paragraphText(t))
    })
  }

  const root = $.root()
  if (root.children().length === 0) {
    pushTextBlocks(root)
  } else {
    walk(root)
  }

  if (blocks.length === 0) {
    const plain = $.text().replace(/\s+/g, ' ').trim()
    blocks.push(paragraphText(plain || ' '))
  }

  return makeRichText(blocks)
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Создаёт записи media для всех <img> в HTML; карта basename → Payload media id. */
async function ensureImagesFromHtml(
  html: string,
  ensureMedia: (basename: string, alt: string) => Promise<string | undefined>,
): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  const trimmed = html.trim()
  if (!trimmed) return map
  const wrapped = trimmed.startsWith('<') ? trimmed : `<p>${escapeHtml(trimmed)}</p>`
  const $ = cheerio.load(wrapped, null, false)
  const imgs = $('img').toArray()
  for (const el of imgs) {
    const $el = $(el)
    const src = $el.attr('src') || ''
    const alt = $el.attr('alt')?.trim() || 'image'
    const basename = normalizeFeaturedPath(src)
    if (!basename || map.has(basename)) continue
    const id = await ensureMedia(basename, alt)
    if (id) map.set(basename, id)
  }
  return map
}

/** Типографские кавычки/тире → ASCII; NBSP → пробел (Lexical/браузер). */
function normalizeTypographicText(s: string): string {
  if (!s) return s
  return s
    .replace(/\u00A0/g, ' ')
    .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, '-')
}

/** Уже нормальная кириллица в UTF-16 — не трогаем latin1-буфером (иначе каждый символ режется до младшего байта → мусор и «?»). */
function hasCyrillicScript(s: string): boolean {
  return /\p{Script=Cyrillic}/u.test(s)
}

/**
 * UTF-8, ошибочно интерпретированный как Latin-1 (часто даёт «â€™» вместо апострофа).
 * Только для текста **без** нормальной кириллицы: иначе Buffer.from(s,'latin1') портит всю строку целиком.
 */
function tryRecoverUtf8MisreadAsLatin1(s: string): string {
  if (hasCyrillicScript(s)) return s
  if (!/[\u00C2\u00C3\u00E2]|â€/.test(s)) return s
  try {
    const out = Buffer.from(s, 'latin1').toString('utf8')
    if (out.includes('\uFFFD')) return s
    return out === s ? s : out
  } catch {
    return s
  }
}

/**
 * В legacy часто UTF-8 (апостроф U+2019 и т.д.) превратили в три ASCII «?» → isn???t, ???фраза???.
 * Восстанавливаем только безопасные случаи, чтобы не превращать апострофы внутри слов в кавычки.
 */
function repairTripleQuestionMarkUtf8Loss(s: string): string {
  const f = '\uFFFD'
  if (!s.includes('???') && !s.includes(f)) return s
  let t = s

  const wrapQuoted = (inner: string, after: string): string => {
    const q = inner.includes('"') ? "'" : '"'
    return `${q}${inner}${q}${after}`
  }

  const afterQuote = '(\\s|[.,;:!?\\n]|$)'

  // Сначала «кавычки» из ???…???, иначе a???bad → ошибочно a'bad при правиле апострофа
  // U+FFFD
  t = t.replace(
    new RegExp(`(^|\\s)${f}{1,3}([^${f}\\n]+?)${f}{1,3}${afterQuote}`, 'g'),
    (_m, pre: string, inner: string, after: string) => `${pre}${wrapQuoted(String(inner), after)}`,
  )
  t = t.replace(new RegExp(`([A-Za-z]+)${f}{1,3}([A-Za-z]+)`, 'g'), "$1'$2")

  // Три ASCII «?»
  t = t.replace(
    new RegExp(`(^|\\s)\\?\\?\\?([^?\\n]+?)\\?\\?\\?${afterQuote}`, 'g'),
    (_m, pre: string, inner: string, after: string) => `${pre}${wrapQuoted(inner, after)}`,
  )
  t = t.replace(/([A-Za-z]+)\?\?\?([A-Za-z]+)/g, "$1'$2")

  return t
}

function normalizeLegacyTextField(s: string): string {
  return repairTripleQuestionMarkUtf8Loss(
    tryRecoverUtf8MisreadAsLatin1(normalizeTypographicText(s)),
  )
}

/** Как в Articles.slug beforeValidate + лимит длины под индекс/уникальность. */
const MAX_ARTICLE_SLUG_LEN = 200

function normalizeBlogSlug(raw: string): string {
  let s = String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  if (s.length > MAX_ARTICLE_SLUG_LEN) {
    s = s.slice(0, MAX_ARTICLE_SLUG_LEN).replace(/-+$/g, '')
  }
  return s
}

function allocateUniqueSlug(base: string, used: Set<string>): string {
  const safe = base || 'article'
  let candidate = safe
  let n = 2
  while (used.has(candidate)) {
    const suffix = `-${n}`
    const maxBase = MAX_ARTICLE_SLUG_LEN - suffix.length
    let trimmed = safe.slice(0, Math.max(1, maxBase)).replace(/-+$/g, '')
    if (!trimmed) trimmed = 'a'
    candidate = `${trimmed}${suffix}`
    n += 1
  }
  used.add(candidate)
  return candidate
}

function logPayloadEntityError(context: string, err: unknown) {
  console.error(context, err)
  if (!err || typeof err !== 'object') return
  const o = err as Record<string, unknown>
  if (o.data !== undefined) console.error('  data:', JSON.stringify(o.data, null, 2))
  if (o.errors !== undefined) console.error('  errors:', JSON.stringify(o.errors, null, 2))
  if (o.cause !== undefined) console.error('  cause:', o.cause)
}

type Row = Record<string, unknown>

/**
 * Жёсткая очистка таблиц Payload (articles → categories) через TRUNCATE CASCADE.
 * Надёжнее, чем payload.delete: не зависит от лимитов find внутри bulk-delete и снимает «хвосты» в rels.
 * Leads / newsletter / media не трогаем.
 */
async function purgeTargetBlogTablesSql(databaseUri: string) {
  const uri = databaseUri.trim()
  if (!uri) {
    console.error(
      'DATABASE_URI пустой: в migrate-sites.json у сайта должно быть databaseUri; для --internal-site оно копируется в env перед подключением Payload.',
    )
    process.exit(1)
  }
  console.log(`→ очистка целевой БД (SQL TRUNCATE): ${redactDatabaseUri(uri)}`)

  const client = await connectPostgresClientUtf8(uri)
  try {
    const a = await client.query<{ c: string }>('SELECT count(*)::text AS c FROM "articles"')
    const c = await client.query<{ c: string }>('SELECT count(*)::text AS c FROM "categories"')
    console.log(
      `→ до очистки: articles=${a.rows[0]?.c ?? '?'}, categories=${c.rows[0]?.c ?? '?'}`,
    )
    await client.query('BEGIN')
    await client.query('TRUNCATE TABLE "articles" RESTART IDENTITY CASCADE')
    await client.query('TRUNCATE TABLE "categories" RESTART IDENTITY CASCADE')
    await client.query('COMMIT')
    console.log('→ TRUNCATE "articles", "categories" выполнен (CASCADE по rels/locks).')
  } catch (e) {
    try {
      await client.query('ROLLBACK')
    } catch {
      /* ignore */
    }
    console.error('SQL-очистка не удалась (проверьте DATABASE_URI и миграции Payload):', e)
    process.exit(1)
  } finally {
    await client.end()
  }
}

async function runMigrateForSite(
  sourceDatabaseUrl: string,
  uploadsSourceAbs: string,
  migrateLocale: string,
  payloadCacheKey: string,
) {
  const useRu = migrateLocale.toLowerCase() === 'ru'

  if (!fs.existsSync(uploadsSourceAbs)) {
    console.warn(`Нет папки uploads: ${uploadsSourceAbs}`)
  }

  const src = await connectPostgresClientUtf8(sourceDatabaseUrl)

  const { default: config } = await import(
    pathToFileURL(path.resolve(ROOT, 'payload.config.ts')).href
  )
  const payload = await getPayload({ config, key: payloadCacheKey })

  const q = async <T extends Row>(sql: string, params?: unknown[]): Promise<T[]> => {
    const res = await src.query<T>(sql, params)
    return res.rows
  }

  let posts: Row[] = []
  let categories: Row[] = []
  let contacts: Row[] = []
  let newsletters: Row[] = []

  try {
    posts = await q(`SELECT * FROM "BlogPost" ORDER BY "createdAt" ASC`)
    categories = await q(`SELECT * FROM "Category" ORDER BY "createdAt" ASC`)
    contacts = await q(`SELECT * FROM "ContactSubmission" ORDER BY "submittedAt" ASC`)
    newsletters = await q(`SELECT * FROM "NewsletterSubscription" ORDER BY "subscribedAt" ASC`)
  } catch (e) {
    console.error('Чтение Prisma-таблиц не удалось (BlogPost, Category, …).', e)
    await src.end()
    await shutdownPayload(payload)
    process.exit(1)
  }

  console.log(
    `Источник: posts=${posts.length} categories=${categories.length} contacts=${contacts.length} newsletter=${newsletters.length}`,
  )
  console.log(`lang=${migrateLocale} dryRun=${dryRun} uploads=${uploadsSourceAbs}`)

  if (dryRun) {
    console.log(
      '[dry-run] Очистка articles/categories в целевой Payload-БД отключена; записи в Payload не создаются. Запустите без --dry-run для реальной миграции.',
    )
  } else {
    console.log(
      '→ целевая БД: TRUNCATE articles и categories (leads, newsletter-subscriptions, media не трогаем)',
    )
    await purgeTargetBlogTablesSql(process.env.DATABASE_URI || '')
  }

  const categoryOldIdToPayloadId = new Map<string, string>()

  const sortCategoriesParentsFirst = (rows: Row[]): Row[] => {
    const byId = new Map(rows.map((r) => [String(r.id), r]))
    const done = new Set<string>()
    const out: Row[] = []
    const visit = (id: string, stack: Set<string>) => {
      if (done.has(id)) return
      if (stack.has(id)) return
      stack.add(id)
      const row = byId.get(id)
      if (!row) return
      const pid = row.parentId ? String(row.parentId) : null
      if (pid) visit(pid, stack)
      stack.delete(id)
      if (done.has(id)) return
      done.add(id)
      out.push(row)
    }
    for (const r of rows) visit(String(r.id), new Set())
    return out
  }

  const sortedCats = sortCategoriesParentsFirst(categories)

  for (const cat of sortedCats) {
    const slug = String(cat.slug || '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    if (!slug) continue

    if (skipExisting) {
      const ex = await payload.find({
        collection: 'categories',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      if (ex.docs.length > 0) {
        categoryOldIdToPayloadId.set(String(cat.id), ex.docs[0].id as string)
        continue
      }
    }

    const title = normalizeLegacyTextField(pickCategoryName(cat, useRu))
    const descRaw = pickCategoryDesc(cat, useRu)
    const description = descRaw ? normalizeLegacyTextField(descRaw) : undefined

    if (dryRun) {
      categoryOldIdToPayloadId.set(String(cat.id), `dry-cat-${slug}`)
      console.log(`[dry-run] category ${slug}`)
      continue
    }

    try {
      const created = await payload.create({
        collection: 'categories',
        data: { title, slug, description },
        overrideAccess: true,
      })
      categoryOldIdToPayloadId.set(String(cat.id), created.id as string)
      console.log(`+ category ${slug}`)
    } catch (err) {
      const ex = await payload.find({
        collection: 'categories',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      if (ex.docs.length > 0) {
        categoryOldIdToPayloadId.set(String(cat.id), ex.docs[0].id as string)
        console.warn(`= category exists ${slug}`)
      } else {
        logPayloadEntityError(`✗ category ${slug}`, err)
      }
    }
  }

  const mediaByBasename = new Map<string, string>()
  const usedArticleSlugs = new Set<string>()

  async function ensureMedia(basename: string, alt: string): Promise<string | undefined> {
    if (mediaByBasename.has(basename)) return mediaByBasename.get(basename)
    const full = path.join(uploadsSourceAbs, basename)
    if (!fs.existsSync(full)) {
      console.warn(`  нет файла обложки: ${full}`)
      return undefined
    }
    if (dryRun) {
      mediaByBasename.set(basename, `dry-media-${basename}`)
      return mediaByBasename.get(basename)
    }
    try {
      const doc = await payload.create({
        collection: 'media',
        data: { alt: alt.slice(0, 500) || basename },
        filePath: full,
        overrideAccess: true,
      })
      const id = doc.id as string
      mediaByBasename.set(basename, id)
      console.log(`  + media ${basename} → ${id}`)
      return id
    } catch (err) {
      console.error(`  ✗ media ${basename}`, err)
      return undefined
    }
  }

  for (const post of posts) {
    const normalized = normalizeBlogSlug(String(post.slug || ''))
    if (!normalized) continue

    if (skipExisting) {
      const ex = await payload.find({
        collection: 'articles',
        where: { slug: { equals: normalized } },
        limit: 1,
      })
      if (ex.docs.length > 0) {
        console.log(`= article skip ${normalized}`)
        continue
      }
    }

    const slug = allocateUniqueSlug(normalized, usedArticleSlugs)

    const title = normalizeLegacyTextField(pickTitle(post, useRu))
    const excerptRaw = pickExcerpt(post, useRu)
    const excerpt = excerptRaw ? normalizeLegacyTextField(excerptRaw) : undefined
    const contentHtml = normalizeLegacyTextField(pickContentHtml(post, useRu))
    const published = Boolean(post.published)
    const noindex = Boolean(post.noindex)
    const views = Number(post.views ?? 0) || 0
    const publishedAt = post.publishedAt ? new Date(post.publishedAt as string).toISOString() : undefined

    const catPayloadId = post.categoryId
      ? categoryOldIdToPayloadId.get(String(post.categoryId))
      : undefined

    const feat = normalizeFeaturedPath(post.featuredImage as string | undefined)
    let coverId: string | undefined
    if (feat) {
      coverId = await ensureMedia(feat, title)
    }

    const contentMediaMap = await ensureImagesFromHtml(contentHtml, ensureMedia)
    const rich = htmlToLexical(contentHtml, contentMediaMap)

    if (dryRun) {
      console.log(`[dry-run] article ${slug}${slug !== normalized ? ` (legacy «${normalized}»)` : ''} published=${published}`)
      continue
    }

    try {
      await payload.create({
        collection: 'articles',
        data: {
          title,
          slug,
          excerpt,
          category: catPayloadId || undefined,
          cover: coverId || undefined,
          status: published ? 'published' : 'draft',
          content: rich as object,
          seo: {
            seoTitle: undefined,
            seoDescription: undefined,
            noindex,
          },
          publishedAt: published ? publishedAt : undefined,
          views,
        },
        overrideAccess: true,
      })
      console.log(`+ article ${slug}`)
    } catch (err) {
      logPayloadEntityError(`✗ article ${slug}`, err)
    }
  }

  for (const c of contacts) {
    const name = String(c.name || '').trim()
    const email = String(c.email || '').trim()
    const message = String(c.message || '').trim()
    if (!email || !message) continue
    if (dryRun) {
      console.log(`[dry-run] lead ${email}`)
      continue
    }
    try {
      await payload.create({
        collection: 'leads',
        data: { name: name || '—', email, message },
        overrideAccess: true,
      })
      console.log(`+ lead ${email}`)
    } catch (err) {
      console.error(`✗ lead ${email}`, err)
    }
  }

  for (const n of newsletters) {
    const email = String(n.email || '').trim().toLowerCase()
    if (!email) continue
    if (n.unsubscribedAt) continue
    if (dryRun) {
      console.log(`[dry-run] newsletter ${email}`)
      continue
    }
    try {
      await payload.create({
        collection: 'newsletter-subscriptions',
        data: { email, source: 'migration-legacy', consent: true },
        overrideAccess: true,
      })
      console.log(`+ newsletter ${email}`)
    } catch {
      console.warn(`= newsletter skip/exists ${email}`)
    }
  }

  await src.end()
  await shutdownPayload(payload)
}

async function internalSiteRun(mappingPath: string, siteId: string) {
  const map = loadMapping(mappingPath)
  const site = map.sites.find((s) => s.id === siteId)
  if (!site) {
    console.error(`Сайт "${siteId}" не найден в mapping`)
    process.exit(1)
  }

  if (!site.databaseUri?.trim()) {
    console.error(`Сайт "${site.id}": в mapping пустое databaseUri`)
    process.exit(1)
  }

  let sshTunnel: SshTunnelHandle | null = null
  try {
    let targetUri = site.databaseUri.trim()
    if (site.ssh?.tunnel) {
      sshTunnel = await startSshPostgresTunnel(site)
      targetUri = rewriteDatabaseUriLoopbackPort(targetUri, sshTunnel.localPort)
    }
    process.env.DATABASE_URI = targetUri
    console.log(`→ целевая Payload-БД: ${redactDatabaseUri(process.env.DATABASE_URI)}`)
    if (!site.ssh?.tunnel) {
      warnIfTargetDbIsLocalOnly(site)
    }

    const dataDirAbs = expandPath(map.dataDir)
    const uploadsSourceAbs = path.join(dataDirAbs, 'uploads')
    const dumpName = map.dumpFile || 'legacy.sql'
    const dumpAbs = path.join(dataDirAbs, dumpName)
    if (fs.existsSync(dumpAbs) && map.importSqlDump !== true) {
      console.log(
        `(есть ${dumpAbs}: при importSqlDump:true скрипт сам сделает psql -f в родительском запуске)`,
      )
    }

    clearLocalUploads()

    const langFlag = argValue('--lang')?.toLowerCase()
    let migrateLocale = String(site.lang ?? 'en').toLowerCase()
    if (langFlag === 'ru' || langFlag === 'en') {
      migrateLocale = langFlag
      console.log(`→ язык контента миграции: --lang=${langFlag} (в mapping site.lang=${site.lang})`)
    } else if (migrateLocale !== 'ru' && migrateLocale !== 'en') {
      console.warn(`site.lang="${site.lang}" не ru/en — используем en`)
      migrateLocale = 'en'
    }

    await runMigrateForSite(
      map.sourceDatabaseUrl,
      uploadsSourceAbs,
      migrateLocale,
      `migrate-legacy-${site.id}`,
    )

    const localPayloadUploads = path.join(ROOT, 'public', 'uploads')
    await syncPayloadUploadsToRemote(localPayloadUploads, site)

    console.log(`Готово: ${site.id}`)
  } finally {
    stopSshTunnel(sshTunnel)
  }
}

function spawnSiteChild(mappingPath: string, siteId: string, passThrough: string[]) {
  const scriptPath = path.join(ROOT, 'scripts', 'migrate-legacy-blog.ts')
  const args = [
    '--env-file=.env',
    '-r',
    'tsx/cjs',
    scriptPath,
    '--internal-site',
    siteId,
    '--mapping',
    mappingPath,
    ...passThrough,
  ]
  const r = spawnSync(process.execPath, args, {
    cwd: ROOT,
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development',
      DISABLE_PAYLOAD_HMR: 'true',
      PAYLOAD_SKIP_EMAIL_INIT: 'true',
      PAYLOAD_CONFIG_PATH: 'payload.config.ts',
    },
  })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

function passThroughFlagsForChild(): string[] {
  const out: string[] = []
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i]
    if (a === '--mapping') {
      i++
      continue
    }
    if (a.startsWith('--mapping=')) continue
    if (a === '--only') {
      i++
      continue
    }
    if (a.startsWith('--only=')) continue
    if (a === '--internal-site') {
      i++
      continue
    }
    if (a === '--lang') {
      i++
      if (process.argv[i] && !process.argv[i].startsWith('-')) {
        out.push('--lang', process.argv[i])
      }
      continue
    }
    if (a.startsWith('--lang=')) {
      out.push(a)
      continue
    }
    if (
      a === '--dry-run' ||
      a === '--skip-existing' ||
      a === '--skip-remote-uploads' ||
      a === '--skip-upload-ssh'
    ) {
      out.push(a)
    }
  }
  return out
}

async function main() {
  const mappingPath = argValue('--mapping') || path.join('migration', 'migrate-sites.json')
  const internalSite = argValue('--internal-site')

  if (internalSite) {
    await internalSiteRun(mappingPath, internalSite)
    process.exit(0)
  }

  const map = loadMapping(mappingPath)
  const only = argValue('--only')
  const sites = only ? map.sites.filter((s) => s.id === only) : map.sites
  if (sites.length === 0) {
    console.error('Нет сайтов для обработки (--only не совпал?)')
    process.exit(1)
  }

  const dataDirAbs = expandPath(map.dataDir)
  const dumpName = map.dumpFile || 'legacy.sql'
  const dumpAbs = path.join(dataDirAbs, dumpName)
  if (map.importSqlDump === true && !dryRun) {
    if (!fs.existsSync(dumpAbs)) {
      console.error(`importSqlDump=true, но нет файла: ${dumpAbs}`)
      process.exit(1)
    }
    importSqlDumpWithPsql(map.sourceDatabaseUrl, dumpAbs)
  }

  const childFlags = passThroughFlagsForChild()
  for (const s of sites) {
    console.log(`\n════════ ${s.id} (${s.lang}) ════════`)
    spawnSiteChild(mappingPath, s.id, childFlags)
  }
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
