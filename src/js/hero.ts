import {
    $, $all, disableScroll, enableScroll, smoothScrollTo,
} from '../core/utils';

const slides: {
    [slideKey: string]: {
        videoGroupEl: HTMLDivElement,
        progressBarEl: HTMLDivElement,
        slideEl: HTMLDivElement,
    }
} = {};

let slideKeys: string[] = [];
let currentSlideKey: string;
let videoProgressBarUpdater = 0;

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
    video.currentTime = 0;

    videoProgressBarUpdater = window.setInterval(() => {
        barFill.style.width = `${video.currentTime / video.duration * 100}%`;
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
        sourceEl.src = src;
        sourceEl.type = 'video/mp4';
        videoEl.appendChild(sourceEl);
    }

    if (videoEl.seekable.length === 0) {
        videoEl.load();
    }

    try {
        videoEl.play().catch(() => {});
    } catch {}
}

const MIN_TIME_BEFORE_SLIDE_CHANGE = 500;
let lastTimeSlideChanged = 0;

function changeSlide(slideKey: string, noTimeout: boolean|'no timeout' = false) {
    const _now = Date.now();
    if (!noTimeout && lastTimeSlideChanged + MIN_TIME_BEFORE_SLIDE_CHANGE > _now) {
        console.log('skipping changeSlide, because it changed less then MIN_TIME_BEFORE_SLIDE_CHANGE ago', { lastTimeSlideChanged, MIN_TIME_BEFORE_SLIDE_CHANGE, now: _now });
        return;
    }

    resetProgress(slideKey);

    for (const k of slideKeys) {
        const {
            videoGroupEl,
            slideEl,
        } = slides[k];
        videoGroupEl.classList.toggle('hero-slide-video--visible', false);
        slideEl.classList.toggle('hero-slide--visible', false);

        videoGroupEl.querySelector('video').pause();
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

function prevSlide() {
    let i = slideKeys.indexOf(currentSlideKey);
    i = (i - 1);
    if (i < 0) i = slideKeys.length - 1;
    changeSlide(slideKeys[i]);
}

function nextSlide() {
    let i = slideKeys.indexOf(currentSlideKey);
    i = (i + 1) % slideKeys.length;
    changeSlide(slideKeys[i]);
}

function onWheel(evt: WheelEvent) {
    if (evt.deltaY > 0) {
        if (slideKeys.indexOf(currentSlideKey) === slideKeys.length - 1) {
            enableScroll();
            smoothScrollTo($('section.we-help'));
            return;
        }
        nextSlide();
    }
    else {
        prevSlide();
    }
}

export function initHero() {
    $all('.hero-slide-video').forEach(slideVideoEl => {
        const key = slideVideoEl.id.substr(0, slideVideoEl.id.length - "-video".length);
        if (!slides[key]) slides[key] = {} as any;
        slides[key]["videoGroupEl"] = slideVideoEl;

        const video = slideVideoEl.querySelector('video');
        video.onended = () => {
            nextSlide();
        };
    });

    $all('.hero-video-progress').forEach(videoProgressEl => {
        const key = videoProgressEl.id.substr(0, videoProgressEl.id.length - "-progressbar".length);
        if (!slides[key]) slides[key] = {} as any;
        slides[key]["progressBarEl"] = videoProgressEl;

        videoProgressEl.onclick = () => changeSlide(key, 'no timeout');
    });

    $all('.hero-slide').forEach(slideEl => {
        const key = slideEl.id.substr(0, slideEl.id.length - "-slide".length);
        if (!slides[key]) slides[key] = {} as any;
        slides[key]["slideEl"] = slideEl;
    });

    slideKeys = Object.keys(slides);

    changeSlide(slideKeys[0]);

    if (window.scrollY === 0) {
        disableScroll();
    }
    window.addEventListener('wheel', onWheel);
}