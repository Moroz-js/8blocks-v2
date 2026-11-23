# Project notes

## Brand gradient
`assets/brand-gradient.png` — фирменный градиент («Astro Gradient», тёмно-сливовый → магента → белый, с зерном).
Применять ТОЛЬКО по явной просьбе пользователя: накладывать поверх карточки с заливкой как абсолютный слой
(`position:absolute; inset:0; background:url(./assets/brand-gradient.png) center/cover; opacity:.7` — как в Figma «Astro Gradient (3)»),
контент карточки — поверх (`position:relative`). По умолчанию карточки остаются с плоской заливкой.
`assets/brand-gradient-card.png` — готовое кадрирование под карточку (тёмно-сливовый верх → магента внизу справа), использовать `center / 100% 100%`.
