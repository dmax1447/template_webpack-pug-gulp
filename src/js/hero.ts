import {
    $, $all,
} from './utils';

const slides: {
    [slideKey: string]: {
        videoGroupEl: HTMLDivElement,
        progressBarEl: HTMLDivElement,
        slideEl: HTMLDivElement,
    }
} = {};
let slideKeys: string[] = [];

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
    window.clearInterval(videoProgressBarUpdater);
    const video = slides[currentActiveKey].videoGroupEl.querySelector('video');
    const barFill = slides[currentActiveKey].progressBarEl.querySelector('.hero-video-progress__bar-fill') as HTMLDivElement;
    slides[currentActiveKey].progressBarEl.classList.toggle('hero-video-progress--active', true);
    video.currentTime = 0;

    videoProgressBarUpdater = window.setInterval(() => {
        barFill.style.width = `${video.currentTime / video.duration * 100}%`;
    }, 500);
}

function changeSlide(slideKey: string) {
    resetProgress(slideKey);

    for (const k of slideKeys) {
        const {
            videoGroupEl,
            slideEl,
        } = slides[k];
        videoGroupEl.classList.toggle('hero-slide-video--visible', false);
        slideEl.classList.toggle('hero-slide--visible', false);
    }

    slides[slideKey].videoGroupEl.classList.toggle('hero-slide-video--visible', true);
    slides[slideKey].slideEl.classList.toggle('hero-slide--visible', true);
}

export function initHero() {
    $all('.hero-slide-video').forEach(slideVideoEl => {
        const key = slideVideoEl.id.substr(0, slideVideoEl.id.length - "-video".length);
        if (!slides[key]) slides[key] = {} as any;
        slides[key]["videoGroupEl"] = slideVideoEl;
    });

    $all('.hero-video-progress').forEach(videoProgressEl => {
        const key = videoProgressEl.id.substr(0, videoProgressEl.id.length - "-progressbar".length);
        if (!slides[key]) slides[key] = {} as any;
        slides[key]["progressBarEl"] = videoProgressEl;

        videoProgressEl.onclick = () => changeSlide(key);
    });

    $all('.hero-slide').forEach(slideEl => {
        const key = slideEl.id.substr(0, slideEl.id.length - "-slide".length);
        if (!slides[key]) slides[key] = {} as any;
        slides[key]["slideEl"] = slideEl;
    });

    slideKeys = Object.keys(slides);

    changeSlide(slideKeys[0]);
}