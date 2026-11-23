# Project notes

## Акцентные карточки (градиент + шум), по Figma 110:6122
Фон акцентной карточки = два слоя в одном `background`: шум сверху и линейный градиент снизу:
`background:url(./assets/accent-bubbles.png) var(--acc-x) var(--acc-y2) / 240px 240px repeat, url(./assets/accent-noise.png) 0 var(--acc-y) / 160px 160px repeat, linear-gradient(<угол>, rgb(18,2,9) 9.9%, rgb(33,3,17) 23.8%, rgb(49,5,25) 37.7%, rgb(75,5,36) 51.7%, rgb(118,3,55) 65.6%, rgb(162,0,73) 80.3%, rgb(166,54,105) 97.9%, rgb(198,105,147) 107.3%)`.
Угол по пропорциям блока: `180 - atan(1.53 * h / w)` в градусах (1200x730 → 137°, 1200x525 → 146°, 1200x400 → 153°, 1200x192 → 166°, 595x536 → 126°).
Группа карточек (сетка) — один общий градиент на всю группу: у каждой карточки тот же градиент с `background-size` = размер группы и `background-position` = минус смещение карточки внутри группы, шум отдельным слоем.
Шум: два слоя поверх градиента — `accent-noise.png` (мелкое зерно, 160px) и `accent-bubbles.png` (редкие светлые точки, 240px), оба в 2.86 раза прозрачнее исходного (−30%, затем ещё ×0.5). Движутся как пузырьки шампанского: зерно медленно ползёт вверх, точки поднимаются быстрее с лёгким покачиванием (CSS-переменные --acc-y/--acc-y2/--acc-x, анимации accRise 120s и accSway 18s в helmet, селектор `[style*="accent-noise.png"]`, отключается при prefers-reduced-motion). Старые картинки-фоны (brand-gradient-card, astro-gradient, card-gradient-*, ws-*-bg, audit-*-bg, sc-*-bg, audit-rv, ws-result, tok-card) больше не используются.

## Бинарные иллюстрации в карточках
Все иллюстрации в карточках идут через `Binary Engine.dc.html` (движок из binary-style-kit, адаптирован под карточки только обвязкой, отрисовка не тронута),
настройки каждой иллюстрации лежат в `binary-illustrations.js`.
Правило: иллюстрация не рисуется, пока пользователь не долистал до неё. Когда до блока с ней остаётся 250 px (он ещё под нижним краем экрана), она один раз проявляется с нуля (снизу вверх, 2.2 с),
дальше живёт как обычно; вне экрана отрисовка на паузе. Это зашито в движке (проверка положения в каждом кадре), отдельно на страницах ничего делать не нужно.
Одинаковый визуальный вес по всему сайту (зашито в движке, по умолчанию): силуэт объекта занимает ~20% кадра (`weight` 0.2, крупные объекты уменьшаются до этой площади),
средняя яркость объекта 0.34 (`tone`, общий сдвиг тона в пределах ×0.75–1.35, акценты сохраняют своё место в иерархии). Переопределять только по просьбе.
Плотность и чёткость: w/h холста = 2× размера области, `density="2"` (на ретине 1 пиксель холста = 1 пиксель экрана, цифры ~3.5 px без размытия, фоновых цифр не больше, чем в ките). `contrast` 2.8, `tone` 0.46 (чётче и светлее). Белые вспышки цифр минимальные: `sparkle` 0.1.
В карточках с `<binary-glyph>` объект в 1.6 раза крупнее по площади, чем старый глиф (`size` 1.6, предел 45% кадра).
На остальных страницах старые `<binary-glyph>` / `<binary-glyph-wide>` сами рисуют новую иллюстрацию через `binary-engine.js`, если для их `shape` есть запись в `binary-illustrations.js` (алиасы в `BINARY_ILLUSTRATION_ALIASES`); страницы не правятся.
Исходники карточек: монохромный матовый графитовый металл, простые крупные формы, без падающих теней, белый фон (gpt-image-2), файлы `assets/ill-<shape>.png`.

## Header navigation (all pages)
- Header nav is `<nav class="sn">` with 3 dropdowns: Tokenomics, Digital Assets, Company. CSS lives in each page's helmet as `<style data-site-nav>`; open on hover or focus (CSS only, no JS).
- Panel: full header width under the header, solid rgb(8,8,10), grid 420px + 2 link columns; first cell is an accent-gradient intro card with a gray underlined link.
- No underline or active marking for the current section in the header (user's rule).
- Header container gets z-index:30; the "Talk to the team" button links to Contact.dc.html. Generator: scratchpad nav/build_nav.py.
- Header is sticky on every page: it is the first child of the page root (`position:sticky;top:0`, `margin-bottom:-92px` where it overlays the hero), root uses `overflow:clip` (not hidden, which breaks sticky). Glass of the header lives in `[data-sn-hdr]::before` (tint rgba(2,2,2,.42); open menu sheet rgba(2,2,2,.64), blur 14px).
- Open menu = one glass element: the panel starts at the top of the header (`top:0`, `z-index:-1`, padding-top 122px) and covers the header too; the header's own glass fades out while the menu is open.
- The glass of the open menu is one shared `.sn-sheet` (first child of `.sn`, height 395px): it stays open while moving between Tokenomics / Digital Assets / Company, only the panel content crossfades. All panels are the same height (intro card min-height 233px). EN switch removed from the header.

## Footer (all pages)
- `<footer class="ft">` is the last child of the page root, CSS in helmet `<style data-site-footer>`. Columns follow the header navigation (Tokenomics / Digital Assets / Company); left: logo, tagline, Subscribe form, social icons (X, LinkedIn, Telegram, Base, Clutch). Below: dark Google map of 8BLOCKS FZCO with address / email / phone card; bottom bar: "© 2026 8BLOCKS FZCO. All rights reserved." + Privacy policy / Terms of Service (8blocks.io).
- Flow pages: root padding-bottom moved to the footer's margin-top. Absolute-layout pages (Landing, Readiness Check/Result, Tokenomics Calculator/Results): the old root height became a spacer div before the footer.
