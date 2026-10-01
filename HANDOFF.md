# Tokenomics AI page handoff

## Accepted revision and Git publication

User accepted the brighter pink unicorn with surrounding binary particles and explicitly requested commit/push to the existing branch. Latest TypeScript and focused ESLint passed. Final production build passed on2026-10-01 (Next16.2.9); pre-existing Nodemailer transport verification warnings did not fail the build. Changes include the page, local assets/copy/styles, route-specific shell behaviour, verification script, supplied HTML reference and this handoff. Branchmain, remoteorigin (`Moroz-js/8blocks-v2`). Older no-commit/build-pending notes below are historical and superseded by this entry. Push result is reported in the conversation after Git confirms it.

## Latest changes — Russian copy, restored footer, clean unicorn source

**Stronger pink + surrounding particles (newest):** after user requested a much lighter appearance and more particles, lifted body tone exponent to.65; RGB now155+100*min(1,tc*1.4),8+65tc+170hi²,75+100tc+75hi². Body opacity alpha*(.9+.32*t); deep-shadow scatter.65–.8. Halo colourRGB190/25/110, keep probability.75, opacity min(.5,near*1.3); empty background probability2.5%, opacity.1–.22. Surrounding dust increased to1000 glyphs anchored to scatter/halo cells, radius20+random^1.7*180, opacity.12+.32*(1-r/200). This preserves sparse outskirts and concentrates density close to the outline. Browser screenshot `bright-unicorn-surrounding-scatter.png` inspected, runtime errors[]. Pose/scale unchanged.

**Shadow visibility refinement (latest):** user found too many body regions nearly black. Lifted body dark/mid pinks: tone exponent1.05 instead of1.6; RGB base125/6/60 with respective tone ranges130/58/100. High-white/pale highlight endpoints remain unchanged. Body opacity now alpha*(.62+.6*t); shadow scatter opacity.24–.38. Background/halo colours are isolated as atlas entries256/257, preserving their original colour/opacity/distribution. Pose/grid remain unchanged. Browser screenshot `lifted-pink-shadows.png` visually inspected.

**Additional black-area scatter (latest):** per user request added faint RGB229/45/154 binary glyphs beyond the existing halo where blurred alpha<.03 (1.8% grid occupancy, opacity.08–.18), and through the darkest body areas (tone<.12,35% of those cells, opacity.14–.26). Shadow cells reuse their existing glyph rather than drawing overlapping characters; sampled detail remains in the other cells. All glyphs retain subtle per-character flicker and persistent values. HTML-derived palette/halo/520 dust glyphs remain. Browser capture `shadow-scatter.png` inspected at1484×925; runtime errors[]. No full-suite repeat for this small density/colour extension.

**Direct HTML palette/particles (newest, replaces RGB tweaks and rollback appearance below):** user requested taking colours/particles from the supplied original file. Re-read the actual extracted4711-byte component from `8Blocks Binary Unicorn.html` and ported its equations directly, without the earlier pink caps/boosts: luminance(.3R+.59G+.11B), normalize `(L-.12)/.62`, smoothstep; tc=t^1.6/hi=max(0,(t-.72)/.28); RGB(90+165*min(1,tc*1.4),4+60tc+180hi²,40+120tc+90hi²); alpha `min(1,sourceAlpha*(.32+.9*t)*flicker)`.256 cached shades reduce rounding. Uses the HTML's clean transparent embedded PNG as invisible sampling source, composed in the already verified upright mirror (1024×757, scale.37,left127,top0; no rotation). Rest of page layout is untouched.

Particle systems now follow that HTML: blurred-alpha halo (blur max(6,columns/10), alpha threshold.35, nearby threshold.03, keep probability.55, tone.35, opacity min(.28,near*.6));520 extra binary glyphs with radius40+random^1.6*360, random angle, fixedRGB229/45/154, opacity.08+.3*(1-r/400), flicker.55+.45*sin(time*1.2+phase), vertical drift sin(time*.6+phase)*6. Dust digits retain their values as in the reference; regular/halo digits retain1% mutation/90ms. Preserved atlas rendering,30fps cap, DPR, ResizeObserver, visibility pause, reduced motion and cleanup. Current square grid/font retained to limit scope to colour/particles; the HTML's visible10%-opacity img is still omitted because the requested visible unicorn must consist only of canvas glyphs.

Direct-port verification passed TypeScript, focused ESLint and full runtime suite:14529 glyphs,1.84% mutation across200ms,4 scroll steps,10 independent demo states+loop, DPR/reduced motion, mocked form failure/success, PDF, unchanged home styles and errors[]. Inspected desktop screenshot. No production build/deploy for this iteration.

**Pink brightness refinement (latest):** user requested stronger pink midtones, rather than white highlights. Before atlas quantization body source RGB is now remapped to `min(255,R*1.7+10)`, `min(145,G*.65)`, `min(215,B*1.45+12)`. This lifts magenta/pink and caps neutral white. Only source/body colour calculation changed; separate scatter palette and generation remain intact. Browser checked actual stacking: unicorn z-index1 above hero gradient z-index0, no runtime errors; visually inspected `bright-pink-unicorn.png` at1484×925. Source-colour atlas implementation passed TypeScript, focused ESLint and full runtime suite (14212 digits,1.85% mutation,4 stories/10 phases+loop, reduced motion/DPR, mocked form, PDF, unchanged home). Final RGB-only refinement was checked visually/runtime rather than rerunning the entire suite.

**Unicorn colour correction (newest):** user approved the reverted source/particles and requested only the unicorn's colours to match original artwork/Figma. Body glyphs now use RGB from each sampled source pixel instead of the artificial beet/pink ramp. RGB is quantized to17-level channel steps (maximum8.5 error) and cached in a multi-column glyph atlas; source colour hues, pale highlights and dark areas are retained. Scatter glyphs continue to use the exact previous32-shade ramp and unchanged distribution/opacity/flicker/drift. Source, pose, scale, grid, glyph size/weight, alpha and timing remain unchanged. Updated verification sprite decoding to account for atlas column groups, using source-tile width rather than destination CSS width.

**Full unicorn rollback (newest, supersedes all HTML-source/pose/halo experiments below):** user requested the exact unicorn version immediately before the HTML file was introduced, including its old particles and contrast. `BinaryUnicornCanvas.tsx` again uses `/img/tokenomics-ai/unicorn-source.png` (original1024×757 Figma bitmap), black-matte-to-alpha conversion `(L-.012)/.11`, mirrored square-grid brightest-pixel sampling, glyph size cell×1.2, system monospace700, brightness `min(1,(L*1.8)^.85)`, opacity `min(1,alpha*2.5)`, original pre-HTML pink palette (R65+190I/G2+168I^2.1/B28+183I^1.4). Old sparse scatter restored: probability `.038*exp(-distance/9)`, brightness.1–.4, opacity.08–.28. Original artwork's baked-in binary halo is sampled again as part of the source. Removed FontFace loading, portrait composition transforms, rectangular rows, enhanced halo, and scatter-count hook. Atlas/DPR/ResizeObserver/reduced-motion/persistent digit mutation remain. Supplied HTML and extracted PNG/font are retained unused; no user files deleted. RU copy, grey accents, restored footer, header and page layout stay as currently implemented.

Rollback verification: TypeScript, focused ESLint and full runtime suite passed;14210 digits, approximately2.15% mutation across200ms,4 stories,10 demo states+loop while stationary, DPR/reduced motion, mock form failure/success, PDF, unchanged home styles, runtime errors[]. Desktop screenshot inspected. No production build or deployment performed.

**Visible halo correction (newest):** restoring old scatter constants failed to restore the old appearance: much of the previous halo was baked into the Figma binary PNG, whereas the clean HTML portrait has no halo. Recreated its surrounding field in the canvas: probability `.003+.5*exp(-distance/12)`, pink brightness.4–.7, opacity `.14+random*.25*proximity`. Density/opacity decay away from silhouette; sparse0/1 scatter keeps its restrained flicker/drift. Current unicorn source/pose/contrast are unchanged. Added `data-scatter-count` for inspection. Targeted browser check at1484×925 recorded1727 scatter glyphs and8525 total; visually inspected `%TEMP%/tokenomics-ai-verification/restored-visible-scatter.png` and confirmed a visible binary halo. This replaces the particle-only rollback constants below.

**Latest particle-only rollback:** user explicitly requested restoring only the earlier particles. Reverted scatter generation to probability `.038*exp(-distance/9)`, brightness.1–.4 and opacity.08–.28. Removed the later uniform distant layer and its brighter scatter settings. Kept current clean-source unicorn, corrected upright mirrored pose, scale, contrast, font, row spacing and all animation safeguards. This supersedes the scatter settings recorded below.

**Orientation correction (latest, overrides30° pose below):** re-read Figma hero2661:8412 via MCP and compared the clean-source composition directly beside its screenshot. Removed the invented rotation completely. The source is only horizontally mirrored, with uniform scale `.37 * 2748 / naturalHeight`, left127/top0 inside the invisible1024×757 composition (`translate(127 + naturalWidth*scale,0)`, `scale(-scale,scale)`, draw at0/0). This matches the upright head/horn in Figma; the lower portrait is clipped by hero. Pink contrast and background binary scatter remain. Targeted browser capture at1280×723/DPR2 passed: source ready,7052 glyphs,1938px backing canvas. Compared `corrected-figma-pose.png` with fresh `figma-hero-current.png` in `%TEMP%/tokenomics-ai-verification/`. No full runtime rerun for this transform-only correction.

Latest visual follow-up: clean unicorn is now mirrored and rotated30° clockwise in an invisible1024×757 composition matching the Figma artwork bounds. Uniform source scale `.34 * 2748 / naturalHeight`, anchor(470,260), image origin at(50% width,35% height); lower neck is cropped. Resampling aspect-fits this composed mask. Contrast normalization is now `(L-.09)/.36` with smoothstep. Binary background scatter now includes a sparse distant layer: probability `.005 + .065*exp(-distance/12)`, opacity `.1 + random*(.08+.16*proximity)`, pink intensity.55–.8; slow1.2px drift and independent flicker remain. This supersedes the previous unrotated aspect-fit×1.35 composition below. Also preloaded Cyrillic in the page-local Geist font, alongside Latin.

Validation after pose/contrast changes: TypeScript and focused ESLint passed. Full runtime suite passed with6646 digits, approximately2.77% mutations across200ms, all4 stories/all10 demo phases+loop, mock form submissions, PDF, DPR/reduced motion, unchanged home styles and errors[]. Desktop screenshot visually checked. The final tiny scatter-only colour/opacity increase followed that run; no additional full-suite rerun was needed.

This section supersedes older notes about all-white headings, English-only copy, hiding the entire footer, and sampling the already-binary Figma PNG.

- Restored Figma grey accents: hero intro and CTA price at33% white, story/output subtitles at50% white, white gradient on the primary hero/CTA headline. All changes remain in the page Sass Module.
- Restored Footer in `src/app/(site)/layout.tsx`. Only its large `FooterWatermark` is wrapped in `StandardPageChrome` in `src/widgets/Footer/Footer.tsx`, hiding the8BLOCKS/А8А9 block on this exact route. Newsletter, links, map, copyright and the small copyright logo remain. Other routes retain their watermark. The top blur remains hidden here; header remains solid black.
- Added page-local `src/widgets/TokenomicsAi/copy.ts`, following existing `lang`/`NEXT_PUBLIC_LANG` (defaultru). Localized hero, badge/facts/buttons, four stories, result cards, closing CTA, form and all10 demo states, including accessibility labels. Page root uses `lang={lang}`. Form option values retain stable English identifiers while displayed labels translate. Protocol names/acronyms stay intact.
- User supplied `8Blocks Binary Unicorn.html`. It bundles a clean transparent1872×2748 RGBA unicorn source, Roboto Mono, and a standalone canvas component. HTML is unchanged. Extracted `public/img/tokenomics-ai/unicorn-reference-source.png` (4,545,943bytes) and `roboto-mono-latin.woff2` (32,796bytes). Original Figma PNG is retained for reference, but the active canvas now samples the clean source.
- `BinaryUnicornCanvas.tsx` adopts the reference's Roboto Mono600, cell×1.25 row spacing, real source alpha, smoothstep luminance curve and nonlinear beet/pink palette. It awaits local FontFace loading before sampling and removes it on unmount. Alpha threshold.35; luminance normalization `(L-.08)/.42`, then smoothstep; opacity `min(1,alpha*(.5+.7*t))`. Brightest shade capped atRGB255/170/211 (`#ffaad3`), keeping highlights pink. Source scale aspect-fit×1.35, top2% of container height, lower neck clipped by hero. Uses the supplied source orientation rather than mirroring the previous binary PNG.
- The HTML reference also showed an img at10% opacity. That visible layer is omitted to preserve the requirement that the visible unicorn consists exclusively of0/1 glyphs. No black-matte conversion or re-sampling of existing binary text remains.
- Existing canvas safeguards/performance remain:64 cached glyph/color sprites,30fps, persistent digits,1% flips every90ms, independent restrained flicker, sparse distance-based binary scatter, DPR/ResizeObserver, visibility pause, reduced motion and cleanup. Resampling only after image/font load or size/DPR changes.
- Updated `scripts/verify-tokenomics-ai.mjs` for restored footer and locale-independent scoped selectors. Final run after clean-source integration passed all4 scroll steps,10 timed states+loop while stationary, pause/play, DPR, reduced motion, mock submit failure/success, PDF download, unchanged home styles, and no runtime errors.6850 sampled digits; mutation rate approximately2.95% across200ms. Desktop/mobile screenshots inspected. TypeScript and focused ESLint passed after integration; production build has not been repeated for this latest pass.
- Remaining localization detail: text baked into original Figma chart/report PNGs and the illustrative downloadable PDF remains English. PDF translation requires embedding a Cyrillic-capable font; built-in jsPDF Helvetica does not support Cyrillic. Main HTML interface is localized.

Next: preserve these new requirements during subsequent tweaks. Current user requests are implemented; run a production build before deployment. Screenshots: `%TEMP%/tokenomics-ai-verification/desktop-hero.png`, `mobile-hero.png`, and the demo/outputs/CTA snapshots generated by the verification script. No commit/deploy performed.

## Актуальный прогресс — 1 октября 2026

Страница реализована и подключена к `/product/tokenomics-ai`. Ниже зафиксированы последние правки после обратной связи пользователя. Они имеют приоритет над исходными размерами, серыми заголовками и градиентами текста в Figma. Остальная часть документа сохраняет ссылки на исходный дизайн, структуру компонентов и требования к анимациям.

### Последующее мобильное уточнение

- По новой просьбе пользователя мобильное хиро тоже занимает высоту экрана минус хедер. При ширине до760px применяется `min(calc(100dvh - var(--ai-header-height)), 1000px)`; до640px переменная равна57px, от641px —65px. Последним уточнением пользователь выбрал `dvh` вместо `svh`: высота хиро теперь меняется вместе с доступной областью при появлении/скрытии адресной строки. Десктопное хиро сохраняет `vh`. Прежняя фиксированная высота810px отменена.
- Мобильный заголовок адаптируется через `clamp(26px, 7vw, 34px)`, описание12px. Единорог закреплён снизу, центрируется по горизонтали и сохраняет aspect ratio; высота artwork — `min(510px, max(240px, calc(100% - 260px)))`, чтобы композиция помещалась и на коротких телефонах.
- Мобильная sticky-stage теперь центрируется по фактической высоте: отступ от верха равен `headerHeight + max(24px, (viewportHeight - headerHeight - stageHeight) / 2)`. Значение сохраняется в `--story-sticky-top` и пересчитывается при resize/изменении размеров stage; обработчик scroll дополнительных измерений не делает. Если места мало, сохраняется минимум24px под хедером. Десктопный sticky-offset не изменён.
- Целевые проверки:390×844 → header57/hero787, sticky сверху129px и снизу129.28px;350×900 →57/843, отступы174/174.06px;320×568 →57/511, отступы25.5/25.69px;700×900 →65/835, отступы95/94.78px. Во всех случаях низ хиро совпал с низом viewport. TypeScript, focused lint StickyStory и whitespace check прошли после этой правки. Проверены снимки `centered-story-350.png` и `centered-story-320.png` в той же temp-папке. Полный runtime-suite/build после этого мобильного уточнения ещё не повторялись.

### Последние исправления

1. **Широкий экран.** Удалено ограничение ширины хиро-градиента, которое на экране 2560px оставляло по540px с обеих сторон. Теперь псевдоэлемент `.hero::after` выходит на100px за каждый край секции и покрывает всю ширину окна. Контент по-прежнему центрируется в контейнере1280px.
2. **Слои единорога и градиента.** В `.hero` включён локальный stacking context через `isolation: isolate`. Градиент имеет `z-index: 0`, контейнер canvas — `1`, текст и факты — `2`. Единорог рисуется поверх розового градиента. Исходный PNG по-прежнему используется только для невидимого семплирования.
3. **Высота хиро на десктопе.** Текущее значение — `min(calc(100vh - 65px), 1000px)`. Ранее были последовательно `659px`, затем `100vh`, затем пробное вычитание64px. Последний вариант оставлял лишний1px: реальная высота хедера составляет65px, включая нижнюю границу. При окне900px измерены хедер65px, хиро835px и нижняя граница хиро ровно900px. При высоких окнах ограничение1000px применяется к самой секции хиро.
4. **Композиция высокого хиро.** Текст и единорог смещаются по вертикали относительно исходной композиции659px; размер artwork на десктопе остаётся969×717. Факты закреплены на71px от нижнего края. На ширине до760px сохранена отдельная мобильная высота810px, свои положения artwork/текста и факты в16px от низа. Последняя просьба про100vh относилась к десктопу.
5. **Белые заголовки.** Серый вводный текст `Tokenomics AI:`, заголовки/подзаголовки истории, обе строки заголовка результатов и заголовок/цена финального CTA теперь полностью белые. Градиент текста убран. Приглушённые описания карточек и основной поясняющий текст сохранены.
6. **Шрифты.** В браузере проверены реально применённые семейства и веса: Geist400 для хиро, истории, заголовка результатов и CTA; Manrope500 для карточек. Geist загружается только через целевой route-файл с локальной переменной `--font-tokenomics-geist`. Глобальная типографика не переписывалась.
7. **Номер шага.** Вместо мгновенной замены цифры добавлены движение по вертикали, лёгкий поворот `rotateX`, изменение прозрачности, короткий розовый импульс и кольцо прогресса. Номер и кольцо управляются только левым scroll-step, не таймером демо. При reduced motion длительности равны нулю.
8. **Полное кольцо четвёртого шага.** Нормализованный Framer Motion `pathLength` заменён на явные `strokeDasharray`/`strokeDashoffset`. Для радиуса20 длина окружности равна `2 * Math.PI * 20`, прогресс шага — `(active + 1) / 4`. На четвёртом шаге offset ровно0, поэтому кольцо замыкается. В браузере подтверждены `strokeDashoffset: 0px`, `strokeDasharray: 125.664px`; снимок проверен визуально.
9. **Отступ истории перед кнопками.** Все четыре текстовых состояния остаются в одной CSS grid-ячейке и участвуют в расчёте максимальной высоты; неактивные состояния прозрачны и имеют `aria-hidden`. Это сохраняет одинаковое положение кнопок при переключении. У `.storyText` есть32px нижнего padding и адаптивная минимальная высота. На третьем шаге измерен отступ примерно50px на десктопе,64px при390px и54px при320px. На всех12 проверенных сочетаниях шага/ширины отступ не меньше примерно32px.
10. **Футер только этой страницы.** `StandardPageChrome` исключает Footer для точного pathname `/product/tokenomics-ai`. На других страницах Footer остаётся. Решение использует клиентский `usePathname`, поскольку корневой layout сохраняется при клиентской навигации; проверки по начальному server pathname было бы недостаточно.
11. **Хедер и верхнее размытие.** Для этой страницы тот же `StandardPageChrome` исключает общий фиксированный blur-overlay высотой120px. `SiteHeader` передаёт обычному Header локальный класс, задающий сплошной фон `#020202` и отключающий backdrop blur. У Header добавлен только необязательный `className`; глобальные стили хедера не менялись. Остальные страницы получают исходный хедер и overlay.

### Оптимизация скролла и canvas

- Основная нагрузка хиро возникала из-за примерно10,500 вызовов `fillText` на каждом кадре, расчётов RGB и создания строк цветов для каждого глифа.
- `BinaryUnicornCanvas.tsx` теперь создаёт offscreen atlas при загрузке/изменении размера:2 символа ×32 оттенка, всего64 заранее отрисованных варианта. Atlas создаётся с учётом DPR и текущего размера шрифта.
- Видимый canvas рисует только бинарные глифы из atlas через `drawImage`; это не отображение исходного unicorn PNG. Цвет определяется семплированной яркостью и соответствующим оттенком atlas, прозрачность — альфой и независимым flicker.
- RAF сохранён, но фактическая отрисовка ограничена30fps. Мутации символов идут независимо, примерно1% каждые90ms. Состояния символов сохраняются между кадрами; React state для отдельных цифр не используется.
- Невидимый canvas и hidden document не продолжают анимацию; reduced motion остаётся статичным. Cleanup таймеров, RAF, listeners и observers сохранён.
- На одном локальном тесте2560×1440/DPR2 средний интервал RAF до оптимизации был примерно44.9ms, p95 —55.5ms. После оптимизации средний интервал примерно14.0ms, p95 —20.9ms. Это измерение конкретного локального headless-окружения, не гарантия производительности всех устройств и не фактическая частота обновления artwork, ограниченная30fps.
- `StickyStory.tsx` теперь измеряет начало/длину прокрутки и sticky-offset при инициализации/resize. Обработчик scroll использует сохранённую геометрию и `window.scrollY`; повторные `getComputedStyle` и измерения DOM на каждом scroll убраны. React обновляется только при смене одного из четырёх шагов.
- Lenis отключён только для `/product/tokenomics-ai`, здесь используется нативный scroll. При уходе на другую страницу Lenis снова создаётся с прежними настройками; при возврате очищается. Это реализовано в `LenisProvider.tsx` по `usePathname`, без изменения поведения остальных страниц.
- Правый `ProductDemo` всё ещё имеет независимый таймер. Ни оптимизация scroll, ни новые номер/кольцо не связывают его состояние с прокруткой.

### Текущее состояние файлов и репозитория

- Из существующих файлов изменены `src/app/(site)/product/tokenomics-ai/page.tsx`, `src/app/(site)/layout.tsx`, `src/shared/lib/LenisProvider.tsx`, `src/widgets/Header/Header.tsx`.
- Новые компоненты и scoped styles находятся в `src/widgets/TokenomicsAi/`; список и назначение файлов приведены ниже.
- Экспорты Figma находятся в `public/img/tokenomics-ai/`; atlas создаётся во время выполнения, отдельного atlas-файла в репозитории нет.
- Автоматизированная проверка находится в `scripts/verify-tokenomics-ai.mjs`. Её instrumentation обновлена для распознавания бинарных glyph-sprites после перехода с `fillText` на atlas.
- Новый код, assets, verification script и этот HANDOFF пока untracked; существующие изменения не закоммичены. Коммит/деплой не выполнялись.
- Не менялись `globals.scss`, глобальные токены, `docs/styleguide.md`, общий reset, shared Button/Card и старый `Platform.module.scss`.

### Что проверено и когда

- После оптимизации canvas, изменения истории и page-specific chrome прошёл полный `node scripts/verify-tokenomics-ai.mjs`: все4 шага, sticky pin/release, все10 состояний и wraparound при неподвижном scroll, pause/play, reduced motion, binary-only glyphs, ограниченные мутации, DPR2/DPR3 и resize, PDF Download, native dialog/ESC/focus, mock-success/mock-error contact, отсутствие runtime page errors и сравнение глобальных стилей главной страницы.
- В этой проверке API contact перехватывается: реальных заявок и сообщений не отправлялось.
- Отдельный клиентский переход AI → главная → AI подтвердил восстановление Footer, обычного хедера и Lenis на главной и их правильное состояние после возвращения. Не ограничивались полной перезагрузкой страниц.
- BrowserMCP открыл обновлённый route и подтвердил отсутствие Footer в accessibility snapshot. Его screenshot API продолжает выдавать `image readback failed`; визуальные снимки получены локальной Puppeteer-проверкой.
- TypeScript и production build прошли после основных performance/chrome/story изменений. Focused ESLint прошёл без ошибок; в существующем Header остаётся предупреждение о неиспользуемом `_mediaEnabled`.
- Сборка выводит прежние Nodemailer connection warnings, но завершается с exit code0. Эти настройки не менялись.
- После поздних правок слоёв, SVG-кольца и высоты хиро выполнены целевые browser-проверки. Для последней высоты подтверждено `65 + 835 = 900` и bottom секции ровно900px. Полная production build после самой последней однострочной правки `64px → 65px` не повторялась.
- Для четвёртого кольца проверены и computed styles, и screenshot. Для отступов выполнены все4 шага на1280/390/320px. Focused lint `StickyStory.tsx` после изменения кольца завершился без ошибок.
- Скриншоты и демонстрационный PDF находятся в системном temp: `C:/Users/lisof/AppData/Local/Temp/tokenomics-ai-verification/`. Полезные последние снимки: `wide-hero.png`, `third-story.png`, `unicorn-over-gradient.png`, `full-fourth-ring.png`; более ранние снимки могут отражать предыдущее состояние до последних правок.

### Ограничения и рекомендуемое продолжение

1. Последняя просьба пользователя — детально записать прогресс. Этот turn меняет только HANDOFF; новые UI-правки не выполняются.
2. Если потребуется дальнейшая работа, сначала прочитать актуальные файлы и git status. Текущие пожелания пользователя — белые заголовки, нативный scroll, отсутствие Footer/верхнего blur и единорог поверх градиента — важнее противоречащих им деталей исходного Figma.
3. Повторить полный runtime verification, typecheck, focused lint и build перед финальным коммитом/деплоем после будущих изменений. Уже выполненные проверки не являются доказательством состояния будущих изменений.
4. При изменении высоты Header обновить вычитание65px либо перейти к измеряемой CSS-переменной. Сейчас значение соответствует обычному десктопному Header64px плюс1px border; отдельный staging bar и будущие изменения header-height этой последней проверкой не покрывались.
5. Высота в экран минус хедер теперь действует и на мобильном; использовать описанные выше57/65px и `dvh` для хиро, не возвращать фиксированные810px. Sticky-stage на телефонах центрируется при наличии места, иначе получает24px отступ под хедером. Длина scrolling wrapper по-прежнему использует `svh`, чтобы появление адресной строки не меняло длину истории.
6. Не заменять glyph atlas видимым PNG и не связывать правый таймер с progress истории. Для производительности сохранять atlas-кэш,30fps, sparse mutations и отсутствие React state на каждую цифру.
7. Из исходных ограничений остаются: нет отдельного mobile Figma и left-state2–4; unicorn asset уже содержит binary-текстуру и чёрную подложку; PDF — иллюстративный demo, не результат реального AI; английская page-copy при текущем русском shared header/SEO. Подробности и исходные nodes ниже.

## Исходная реализация и Figma-спецификация

Implementation is connected and verified at **`/product/tokenomics-ai`**. Metadata and structured data are preserved. Global styles, tokens, the old styleguide, and shared Button/Card components remain unchanged. Layout/Header/Lenis integration now supports page-specific chrome and native scrolling, with existing page defaults preserved.

## Implemented / files created

- `src/widgets/TokenomicsAi/BinaryUnicornCanvas.tsx`: offscreen image/mask sampling, persistent binary digits, mutation/flicker, silhouette-adjacent scatter, resize/DPR handling, visibility pause, reduced motion, and cleanup.
- `src/widgets/TokenomicsAi/StickyStory.tsx`: four left story steps selected by scroll progress; opacity/translate transitions; separate `ProductDemo` component.
- `src/widgets/TokenomicsAi/ProductDemo.tsx`: ten timer-driven demo states, persistent window chrome, animated conversation/output transitions, pause/play control, reduced-motion final state, and an illustrative PDF download using existing `jspdf`.
- `src/widgets/TokenomicsAi/useReducedMotion.ts`: reactive media-query preference via `useSyncExternalStore`.
- `src/widgets/TokenomicsAi/TokenomicsAiPage.tsx`: hero, report cards, closing CTA, and native early-access dialog using existing contact/analytics behavior.
- `src/widgets/TokenomicsAi/TokenomicsAi.module.scss`: isolated Figma styles and responsive layouts.
- `src/widgets/TokenomicsAi/SiteChrome.tsx` and `SiteChrome.module.scss`: pathname-aware footer/top-blur exclusion and solid black header, only for this page; supports client navigation.
- `src/app/(site)/layout.tsx`, `src/widgets/Header/Header.tsx`, `src/shared/lib/LenisProvider.tsx`: connect the chrome gates, optional header class, and native scroll for this route.
- `src/app/(site)/product/tokenomics-ai/page.tsx`: connects the new composition and loads Geist locally; SEO unchanged.
- `scripts/verify-tokenomics-ai.mjs`: automated local runtime checks and screenshots; intercepts contact submissions.
- `public/img/tokenomics-ai/`: `unicorn-source.png`, `demo-gradient.png`, `ai-orb.png`, `allocation-chart.png`, `unlock-chart.png`, `report-preview.png`, plus three native card backgrounds. These are actual Figma exports, not placeholder artwork.
- `HANDOFF.md`: this document.

## Project and route

- Next.js 16 App Router, React 19, TypeScript, Sass Modules. Framer Motion, Lenis, and jsPDF are already installed.
- Target: `/product/tokenomics-ai`, `src/app/(site)/product/tokenomics-ai/page.tsx` renders `widgets/TokenomicsAi/TokenomicsAiPage.tsx`. The old Platform implementation remains untouched and is no longer used by this route.
- Preserve the route's metadata, canonical URL, and structured data when replacing its body.
- `src/app/(site)/layout.tsx` supplies Manrope, global CSS, sticky Header and theme/analytics providers. Footer and fixed top blur are excluded on this route; its header is solid black. Lenis remains enabled elsewhere; this page uses native scrolling. Do not introduce duplicate headers or nested main elements.
- Existing early-access form behavior lives in `src/widgets/Platform/TokenomicsAiInteractive.tsx`; it posts `{ name, email, message }` to `/api/contact` and tracks platform analytics. Reuse the behavior with page-local presentation.

## Figma source of truth

- File: `uSZR8nZ3r4kqxTri5ZKDTG`.
- URL: https://www.figma.com/design/uSZR8nZ3r4kqxTri5ZKDTG/Website--Copy-?node-id=4003-39
- Primary node: **4003:39**, a container holding the desktop page plus nine additional demo frames.
- Actual design page: **2553:2**, “Tokenomics AI”. The other listed page, `1682:2914`, is empty.
- Desktop composition: **2661:8410**, **1280 × 2871**; hero **2661:8412**, 1280 × 723 including the header.
- Hero headline **2661:8418**: Geist Regular, 38px, line-height 1.07; white horizontal text gradient, dim “Tokenomics AI:” line. Hero copy: 12px, white at 66%; CTA: 165 × 46 pill; availability badge uses `#f00b5f`.
- Second-section demo **2661:8495**: x566/y863, **674 × 569**, radius12. Window **2661:8663**: x130/y134 within demo, **414 × 250**, radius24.643, white 12% glass, 22% border. Input **2661:8675**: x130/y395, 414 × 40.
- Left text **2661:8492–8494**, actions **2661:8677**, numbered marker **2661:8682**, vertical rail **2661:8491**. Heading/subtitle 24px Geist; description 14px/18.987px. Text starts x112.
- Outputs heading **2661:8685**: x196/y1611, 888 × 96; 40px Geist, line-height1.2, dim second line.
- Three cards **2661:8686**, **2661:8868**, **2661:9069**: x40/442/844, y1748, **397 × 440**, radius8, 5px gaps. Titles/descriptions use Manrope Medium 18px; description opacity30%.
- Allocation artwork **2661:8856** (245 × 245); unlock artwork **2661:9038** (357 × 208); report preview **2661:9239** (326 × 196.86); orb **2661:8664**; gradient artwork **2661:8496**.
- Pricing CTA **2661:8452** at x341/y2324: 56px Geist, “Claim your AI Tokenomics model”, dim “From $299”; buttons **2661:9505** at y2592. Bottom radial gradient **2661:8411** at y2395, 1280 × 499, black → beet → `#d71f71`.
- No dedicated mobile/responsive layouts or extra left-story frames were found. Figma ends with the bottom gradient; it does not specify a separate footer design.

## Unicorn

- Original layer **2661:8415**, `image 1926990481`; image hash `0a4fbe71126c9993f965f3bdc92014b69ca5af81`.
- Figma slot: **969 × 717**, visible left432/top101 in hero, horizontally mirrored, right/bottom clipped. Figma uses exposure0.49 and exclusion blending.
- Local source: `public/img/tokenomics-ai/unicorn-source.png`, 1024 × 757. It is already binary-styled artwork with an almost opaque black matte (alpha223–255), not a clean transparent silhouette. No separate underlying artwork was found in the supplied design scope.
- Canvas first converts black luminance into soft offscreen alpha while preserving RGB. It downsamples that mask to a low-resolution grid, uses alpha for occupancy and source luminance for pink intensity, then draws only recognizable `0`/`1` glyphs. The source image is never rendered visibly.
- Each glyph retains its character; approximately1% flip every90ms. RAF draws independent flicker `0.85 + 0.15 * sin(time * 1.6 + phase)`. Sparse low-opacity binary scatter uses distance from the silhouette and tiny slow drift.
- Rendering now caches64 glyph/color variants at the correct DPR in an offscreen atlas on resize. Visible drawing uses those sprites at30fps while retaining independent digit state and flicker. A2560px/DPR2 local check improved average frame interval from approximately45ms to14ms.
- `ResizeObserver` resamples only on load/geometry/DPR changes; backing canvas scales by DPR, preserves source aspect ratio and mirrors it. IntersectionObserver/document visibility stop offscreen work. Reduced motion draws a static frame. Timers, RAF, listeners, and observers are cleaned up.
- Visually tuned against the hero: approximately10,500 glyphs at the desktop slot, recognizable digits, preserved silhouette/detail. Runtime checks confirm binary-only drawing, sparse mutation (~2% over200ms), DPR resizing, and static reduced motion. Do not replace this with a visible bitmap or generic particles.

## Left storytelling steps

Only step1 is explicitly drawn in Figma. The other steps use existing project story copy as the basis and follow the first step's visual composition:

1. **You describe the project** — Name, sector, stage, goal.
2. **AI asks what matters** — A short dialogue fills the gaps.
3. **Model is generated** — Allocations + vesting.
4. **You get the package** — Ready for your data room.

Current descriptions are in `StickyStory.tsx`. Step changes must remain scroll-driven, with stable layout and subtle fade/translateY.

## Right demo sequence

| State | Figma frame | Content |
|---|---|---|
| 1 | 2661:8495 | Orb, greeting, empty project input |
| 2 | 2661:9578 | Typed solar-panel request, send icon |
| 3 | 2661:9762 | Request bubble, project-name question, NOVA PROTOCOL input |
| 4 | 2661:9946 | Name response, sector choices: DeFi/GameFi/RWA/Finance |
| 5 | 2661:10145 | DeFi response, stage choices: Pre-seed/Private Sale/Pre-TGE/TGE |
| 6 | 2661:10350 | Pre-seed, raise question, $2M seed then community round |
| 7 | 2661:10555 | Allocation doughnut, drafting8 buckets |
| 8 | 2661:10743 | Unlock chart, testing unlock spikes |
| 9 | 2661:11001 | 99%, creating investor PDF |
| 10 | 2661:11180 | NOVA result, metadata, doughnut, Download |

`ProductDemo.tsx` loops these states on independent timeouts while visible, even when scrolling stops. It never consumes scroll progress or the active left step. Current durations total roughly26seconds. Preserve continuous window/chat movement rather than flashing screenshots.

## Required behavior and style boundaries

- **Container:** taller scroll wrapper; stage sticks/pins below the shared header and releases at the wrapper's end.
- **Left:** scroll progress selects story step; no layout jumps.
- **Right:** independent visible-section timer loop; stopped scrolling must not stop playback. Pause/play and reduced-motion behavior must work.
- Create `TokenomicsAi.module.scss` with a scoped, opaque near-black page root, locally loaded Geist, local Figma palette/type/spacing/radii, and dedicated buttons/panels. Retain Manrope where Figma explicitly uses it.
- Do not modify `docs/styleguide.md`, global tokens/typography/reset, `globals.scss`, shared Button/Card styles, or `Platform.module.scss` for this page. Avoid global selectors and overflow ancestors that break sticky positioning. Cover the global background with the local page surface.
- Keep desktop fidelity first; adapt mobile sensibly. Clean up all animation resources and honor reduced motion.

## Verification and known limits

- Passed: TypeScript, focused ESLint, production build, and git diff whitespace check.
- Passed: four scroll steps; sticky pin/release; ten timed states plus wraparound while stationary; pause/play; reduced motion; canvas alpha/luminance sampling, binary-only drawing, sparse mutation, resize/DPR; generated demo PDF download; dialog autofocus/Escape; mocked contact success/error; existing homepage global-style comparison; no runtime page errors.
- Desktop/mobile screenshots were inspected against Figma. BrowserMCP inspected the existing homepage and the new route. Its screenshot capture still reports image readback failure; the local Puppeteer verification provides screenshots instead.
- Follow-up fixes: hero gradient spans full viewport; headings are fully white per user request; fonts checked as Geist400/Manrope500; story marker rolls numbers with a pulse/progress ring; all story states participate in stable grid sizing with at least32px before actions. Scroll geometry is cached on resize rather than recomputed on every scroll event.
- Verified client-navigation roundtrip: footer, original header styling and Lenis return on home, then disappear/reset appropriately on re-entering the AI route.
- Build completes with existing Nodemailer connection warnings. Real contact submissions were not sent during testing.
- English page copy follows Figma; the shared header and SEO retain the project's configured locale (currently Russian locally). This page has no footer.
- No dedicated mobile Figma or left steps2?4 exist in the supplied scope. Mobile is adapted; extra story copy follows the existing project narrative.
- The source unicorn has a black matte and already contains binary texture; offscreen masking and sampling reconstruct it as live canvas glyphs.
- PDF download is an explicitly illustrative demo report, not a live AI-generated model.

## Next steps

1. Review the running page at /product/tokenomics-ai. No implementation blocker remains.
2. To repeat checks, start the app and run node scripts/verify-tokenomics-ai.mjs, npm run typecheck, focused ESLint, and npm run build.
3. Screenshots and the generated PDF are written to the system temporary directory under tokenomics-ai-verification.
4. Deployment and any future localization or real model-generation integration are outside this implementation.
