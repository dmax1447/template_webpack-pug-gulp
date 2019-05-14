Simple framework for animations

Animations will start, when browser's viewport contains more than *intersection rate* (intersected area scalar) part of animated element.

Example:
```pug
div.anim(--anim="slide-in-up", --anim-speed="1s", --anim-delay="0.6s")
    h2 Агентствам
    ul
        li
            i(class="far fa-analytics")
            span Мы — продуктовые ребята.  Нам понятен язык бизнеса и метрик
        li
            i(class="far fa-laptop")
            span Лучше всего проектируем и кодим сложные дэшборды и админки
        li
            i(class="far fa-chart-pie-alt")
            span Нам можно отдать часть работ, например только фронт или только бэк
```

## Setup

Import styles from `./core/anim/styles.scss`.  
It also contains built-in animations.

Invoke `initAnimations` method after html dom is loaded (before `window.onload` event fires).

Eg:
```js
import { initAnimations } from './core/anim';

initAnimations();
window.onload = () => { /* ... */ };
```

Append `noscript` with animations disabling styles:
```pug
noscript
    style.
        .anim {
            animation: none !important;
            opacity: 1 !important;
        }
```

## Animate!

Every animated element should have `.anim` class assigned and `--anim-*` attributes.

`--anim-*` attributes describes animation parameters.

* `--anim` - Animation name
* `--anim-speed` - Animation speed; duration of whole animation (in css time units).
* `--anim-delay` - Delay before animation starts (in css time units).
* `--anim-timing-function` - CSS animation timing function.
* `--anim-irate` - Minimal intersection scalar of viewport's & element's areas that will fire animation. (`0.5` by default).

Animation name should be css keyframe animation, without `anim-` prefix.  
Eg for `--anim="slide-in-left"`, `"anim-slide-in-left"` animation will be used.

There are some built-in animations in `./core/anim/styles.scss`:
* slide-in-left
* slide-in-left-center
* slide-in-right
* slide-in-right-center
* slide-in-up
* slide-in-up-center
* fade-in
* fade-in-07
* slide-in-back

## Trouble Fixes

Manually check & animate some hot spots:
```js
tryAnimateHero() {
    setTimeout(() => {
        const sy = window.pageYOffset;
        const th = document.body.getBoundingClientRect().height;
        const r = sy / th;

        if (0.1 > r) {
            $all('.hero-left.anim, .hero-right.anim').forEach(el => {
                if (isAnimPlaying(el) || isAnimStopped(el)) return;
                runAnimation(el, pickAnimParams(el));
            });
        }
    }, 300);
}

onload = () => {
    function updateScrollStates() {
        const sy = window.pageYOffset;
        const th = document.body.getBoundingClientRect().height;
        const r = sy / th;

        // show bottom panel
        // if (0.14 < r && r < 0.45) {
        //     $q('.bottom-panel').classList.toggle('bottom-panel--hidden', false);
        // } else {
        //     $q('.bottom-panel').classList.toggle('bottom-panel--hidden', true);
        // }

        // fix show hero animation
        if (0.1 > r) {
            $all('.hero-left.anim, .hero-right.anim').forEach(el => {
                if (isAnimPlaying(el) || isAnimStopped(el)) return;
                runAnimation(el, pickAnimParams(el));
            });
        }
    }

    updateScrollStates();

    // bottom popup
    let updateScrollStatesTimeout;
    window.addEventListener('scroll', () => {
        if (skipScrollEvents) return;
        if (updateScrollStatesTimeout) {
            clearTimeout(updateScrollStatesTimeout);
        }
        updateScrollStatesTimeout = setTimeout(updateScrollStates, 50);
    });
}
```