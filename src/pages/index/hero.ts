import {
    $ as $q, $all, disableScroll, enableScroll, smoothScrollTo, sleep, getScroll, listenSwipe, isMobileScreen,
} from '../../core/utils';

const slides: {
    [slideKey: string]: {
        videoGroupEl: HTMLDivElement,
        progressBarEl: HTMLDivElement,
        slideEl: HTMLDivElement,
    }
} = {};

const MIN_TIME_BEFORE_SLIDE_CHANGE = 500;
const SLIDE_DISAPPEARING_TIME = 500;

let slideKeys: string[] = [];
let currentSlideKey: string;
let videoProgressBarUpdater = 0;

let lastTimeSlideChanged = 0;
export let isHeroMode = false;

export function isLastSlide() {
    return slideKeys.indexOf(currentSlideKey) === slideKeys.length - 1;
}

function resetProgress(currentActiveKey: string) {
    // reset
    for (const k of slideKeys) {
        const {
            progressBarEl,
            videoGroupEl,
            slideEl,
        } = slides[k];

        progressBarEl.classList.toggle('hero-video-progress--active', false);
        (progressBarEl.querySelector('.hero-video-progress__bar-fill') as HTMLDivElement).style.width = '0%';
        videoGroupEl.classList.toggle('hero-slide-video--visible', false);
        slideEl.classList.toggle('hero-slide--visible', false);
    }

    const {
        videoGroupEl,
        progressBarEl,
    } = slides[currentActiveKey];

    window.clearInterval(videoProgressBarUpdater);
    const video = videoGroupEl.querySelector('video');
    const barFill = progressBarEl.querySelector('.hero-video-progress__bar-fill') as HTMLDivElement;
    progressBarEl.classList.toggle('hero-video-progress--active', true);
    if (video) video.currentTime = 0;

    videoProgressBarUpdater = window.setInterval(() => {
        barFill.style.width = video ? `${video.currentTime / video.duration * 100}%` : '100%';
    }, 500);
}

function preloadSlideVideo(slideKey: string) {
    const {
        videoGroupEl,
    } = slides[slideKey];

    const src = videoGroupEl.getAttribute('data-src');
    const videoEl = videoGroupEl.querySelector('video');
    const videoSourceEl = videoGroupEl.querySelector('source');

    if (!videoSourceEl) {
        const sourceEl = document.createElement('source');
        sourceEl.src = src!;
        sourceEl.type = 'video/mp4';
        if (videoEl) videoEl.appendChild(sourceEl);
    }

    if (videoEl && videoEl.seekable.length === 0) {
        videoEl.load();
    }

    try {
        if (videoEl) videoEl.play().catch(() => {});
    } catch {}
}

async function animateSlideDisappearing(slideKey: string, fadeDirection: 'prev'|'next' = 'next') {
    const {
        slideEl,
    } = slides[slideKey];

    slideEl.classList.toggle('--next', fadeDirection === 'next');
    slideEl.classList.add('hero-slide--disappearing');
    await sleep(SLIDE_DISAPPEARING_TIME);
    slideEl.classList.remove('hero-slide--visible');
    slideEl.classList.remove('hero-slide--disappearing');
}

async function changeSlide(
    slideKey: string,
    noTimeout: boolean|'no timeout' = false,
    animationDirection: 'prev'|'next'|'byIndex'
) {
    const _now = Date.now();
    if (!noTimeout && lastTimeSlideChanged + MIN_TIME_BEFORE_SLIDE_CHANGE > _now) {
        console.log('skipping changeSlide, because it changed less then MIN_TIME_BEFORE_SLIDE_CHANGE ago', { lastTimeSlideChanged, MIN_TIME_BEFORE_SLIDE_CHANGE, now: _now });
        return;
    }

    if (slideKey === currentSlideKey) {
        console.log('skipping changeSlide, because it is active now');
        return;
    }

    const _curSlideIndex = slideKeys.indexOf(currentSlideKey);
    const _newSlideIndex = slideKeys.indexOf(slideKey);

    animationDirection = animationDirection === 'byIndex' ? (_newSlideIndex > _curSlideIndex ? 'next' : 'prev') : animationDirection;

    if (currentSlideKey) {
        await animateSlideDisappearing(currentSlideKey, animationDirection);
    }

    resetProgress(slideKey);

    for (const k of slideKeys) {
        const {
            videoGroupEl,
            slideEl,
        } = slides[k];
        videoGroupEl.classList.toggle('hero-slide-video--visible', false);
        slideEl.classList.toggle('hero-slide--visible', false);

        const vid = videoGroupEl.querySelector('video');
        if (vid) vid.pause();
    }

    const {
        videoGroupEl,
        slideEl,
    } = slides[slideKey];

    videoGroupEl.classList.toggle('hero-slide-video--visible', true);
    slideEl.classList.toggle('hero-slide--visible', true);

    preloadSlideVideo(slideKey);
    currentSlideKey = slideKey;

    lastTimeSlideChanged = Date.now();
}

function prevSlide(wrap: false|'wrap' = false) {
    let i = slideKeys.indexOf(currentSlideKey) - 1;
    if (wrap && i < 0) i = slideKeys.length - 1;
    if (i >= 0) {
        changeSlide(
            slideKeys[i],
            // start timeout before next change
            isMobileScreen() ? 'no timeout' : false,
            // fade animation
            isMobileScreen() ? 'prev' : 'byIndex',
        );
    }
}

function nextSlide() {
    let i = slideKeys.indexOf(currentSlideKey);
    i = (i + 1) % slideKeys.length;
    changeSlide(
        slideKeys[i],
        // start timeout before next change
        isMobileScreen() ? 'no timeout' : false,
        // fade animation
        isMobileScreen() ? 'next' : 'byIndex',
    );
}

function onWheel(evt: JQueryMousewheel.JQueryMousewheelEventObject) {
    if (isHeroMode) {
        if (evt.deltaY < 0) {
            if (slideKeys.indexOf(currentSlideKey) === slideKeys.length - 1) {
                leaveHeroMode();
                return;
            }
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

let _registeredSwipe: Function|undefined;

export function initHero() {
    $all('.hero-slide-video').forEach((slideVideoEl, i) => {
        const key = slideVideoEl.id.substr(0, slideVideoEl.id.length - "-video".length);
        if (!slides[key]) slides[key] = {} as any;
        slides[key]["videoGroupEl"] = slideVideoEl;

        const video = slideVideoEl.querySelector('video');
        if (video) {
            video.onended = () => nextSlide();
        }
    });

    $all('.hero-video-progress').forEach(videoProgressEl => {
        const key = videoProgressEl.id.substr(0, videoProgressEl.id.length - "-progressbar".length);
        if (!slides[key]) slides[key] = {} as any;
        slides[key]["progressBarEl"] = videoProgressEl;

        videoProgressEl.onclick = () => changeSlide(key, 'no timeout', 'byIndex');
    });

    $all('.hero-slide').forEach(slideEl => {
        const key = slideEl.id.substr(0, slideEl.id.length - "-slide".length);
        if (!slides[key]) slides[key] = {} as any;
        slides[key]["slideEl"] = slideEl;
    });

    $all('.hero-slide-item__number[data-number]').forEach(numEl => {
        const numberStr = numEl.getAttribute('data-number') || '';
        for (let i = 0; i < numberStr.length; ++i) {
            const ni = parseInt(numberStr[i], 10);
            if (ni !== NaN) {
                const numberImg = document.createElement('img');
                numberImg.src = `assets/Num${ni}.svg`;
                numEl.appendChild(numberImg);
            }
        }
        numEl.removeAttribute('data-number');
    });

    slideKeys = Object.keys(slides);

    $('html').off('mousewheel', onWheel as any);
    if (_registeredSwipe) _registeredSwipe();
    _registeredSwipe = undefined;

    if (isMobileScreen()) {
        _registeredSwipe = listenSwipe($q('section.hero'), (direction) => {
            if (direction === 'left') prevSlide('wrap');
            else if (direction === 'right') nextSlide();
        }, 30);
    } else {
        $('html').on('mousewheel', onWheel);
    }

    changeSlide(slideKeys[0], undefined, 'byIndex');

    if (window.scrollY <= ($q('section.hero').getBoundingClientRect().height / 2)) {
        enterHeroMode();
        setTimeout(() => {
            $q('.features .top-bar').style.display = 'block';
        }, 100);
    } else {
        $q('.features .top-bar').style.display = 'block';
    }

    $q('section.hero a[href="#feedback"]').removeEventListener('click', leaveHeroMode);
    $q('section.hero a[href="#feedback"]').addEventListener('click', leaveHeroMode);
}

export function enterHeroMode() {
    if (!isMobileScreen()) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // disableScroll();
        isHeroMode = true;
    }
    $q('.features .top-bar').classList.add('top-bar--hidden');
}

export function leaveHeroMode() {
    if (!isMobileScreen()) {
        // enableScroll();
        isHeroMode = false;
    }
    $q('.features .top-bar').classList.remove('top-bar--hidden');
}