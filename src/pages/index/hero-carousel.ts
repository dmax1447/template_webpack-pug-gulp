import { sleep, isMobileScreen, $all } from "../../core/utils";

type SlideElements = {
    videoGroupEl: HTMLDivElement,
    progressBarEl: HTMLDivElement,
    slideEl: HTMLDivElement,
};

const MIN_TIME_BEFORE_SLIDE_CHANGE = 500;
const SLIDE_DISAPPEARING_TIME = 500;

export class HeroCarousel {
    slides: {
        [slideKey: string]: SlideElements
    } = {};
    slideKeys: string[] = [];
    currentSlideKey: string = undefined!;
    videoProgressBarUpdater = 0;
    
    lastTimeSlideChanged = 0;

    isLastSlide = () => {
        return this.slideKeys.indexOf(this.currentSlideKey) === this.slideKeys.length - 1;
    };

    init = (
        slides?: { [slideKey: string]: SlideElements },
    ) => {
        if (!slides) {
            const slides_: { [slideKey: string]: SlideElements } = {};

            $all('.hero-slide-video').forEach((slideVideoEl, i) => {
                const key = slideVideoEl.id.substr(0, slideVideoEl.id.length - "-video".length);
                if (!slides_[key]) slides_[key] = {} as any;
                slides_[key]["videoGroupEl"] = slideVideoEl;
        
                const video = slideVideoEl.querySelector('video');
                if (video) {
                    video.onended = () => this.nextSlide();
                }
            });
        
            $all('.hero-video-progress').forEach(videoProgressEl => {
                const key = videoProgressEl.id.substr(0, videoProgressEl.id.length - "-progressbar".length);
                if (!slides_[key]) slides_[key] = {} as any;
                slides_[key]["progressBarEl"] = videoProgressEl;
        
                videoProgressEl.onclick = () => this._changeSlide(key, 'no timeout', 'byIndex');
            });
        
            $all('.hero-slide').forEach(slideEl => {
                const key = slideEl.id.substr(0, slideEl.id.length - "-slide".length);
                if (!slides_[key]) slides_[key] = {} as any;
                slides_[key]["slideEl"] = slideEl;
            });

            slides = slides_;
        }

        this.slides = slides;
        this.slideKeys = Object.keys(slides);
        this.toSlide(this.slideKeys[0], undefined, 'byIndex');
    };

    _resetProgress = (currentActiveKey: string) => {
        // reset
        for (const k of this.slideKeys) {
            const {
                progressBarEl,
                videoGroupEl,
                slideEl,
            } = this.slides[k];
    
            progressBarEl.classList.toggle('hero-video-progress--active', false);
            (progressBarEl.querySelector('.hero-video-progress__bar-fill') as HTMLDivElement).style.width = '0%';
            videoGroupEl.classList.toggle('hero-slide-video--visible', false);
            slideEl.classList.toggle('hero-slide--visible', false);
        }
    
        const {
            videoGroupEl,
            progressBarEl,
        } = this.slides[currentActiveKey];
    
        window.clearInterval(this.videoProgressBarUpdater);
        const video = videoGroupEl.querySelector('video');
        const barFill = progressBarEl.querySelector('.hero-video-progress__bar-fill') as HTMLDivElement;
        progressBarEl.classList.toggle('hero-video-progress--active', true);
        if (video) video.currentTime = 0;
    
        this.videoProgressBarUpdater = window.setInterval(() => {
            barFill.style.width = video ? `${video.currentTime / video.duration * 100}%` : '100%';
        }, 500);
    };

    _preloadSlideVideo = (slideKey: string) => {
        const {
            videoGroupEl,
        } = this.slides[slideKey];
    
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
    };

    _animateSlideDisappearing = async (
        slideKey: string,
        fadeDirection: 'prev'|'next' = 'next',
    ) => {
        const {
            slideEl,
        } = this.slides[slideKey];
    
        slideEl.classList.toggle('--next', fadeDirection === 'next');
        slideEl.classList.add('hero-slide--disappearing');
        await sleep(SLIDE_DISAPPEARING_TIME);
        slideEl.classList.remove('hero-slide--visible');
        slideEl.classList.remove('hero-slide--disappearing');
    };

    _changeSlide = async (
        slideKey: string,
        noTimeout: boolean|'no timeout' = false,
        animationDirection: 'prev'|'next'|'byIndex',
    ) => {
        const _now = Date.now();
        if (!noTimeout && this.lastTimeSlideChanged + MIN_TIME_BEFORE_SLIDE_CHANGE > _now) {
            console.log('skipping changeSlide, because it changed less then MIN_TIME_BEFORE_SLIDE_CHANGE ago', { lastTimeSlideChanged: this.lastTimeSlideChanged, MIN_TIME_BEFORE_SLIDE_CHANGE, now: _now });
            return;
        }
    
        if (slideKey === this.currentSlideKey) {
            console.log('skipping changeSlide, because it is active now');
            return;
        }
    
        const _curSlideIndex = this.slideKeys.indexOf(this.currentSlideKey);
        const _newSlideIndex = this.slideKeys.indexOf(slideKey);
    
        animationDirection = animationDirection === 'byIndex' ? (_newSlideIndex > _curSlideIndex ? 'next' : 'prev') : animationDirection;
    
        if (this.currentSlideKey) {
            await this._animateSlideDisappearing(this.currentSlideKey, animationDirection);
        }
    
        this._resetProgress(slideKey);
    
        for (const k of this.slideKeys) {
            const {
                videoGroupEl,
                slideEl,
            } = this.slides[k];
            videoGroupEl.classList.toggle('hero-slide-video--visible', false);
            slideEl.classList.toggle('hero-slide--visible', false);
    
            const vid = videoGroupEl.querySelector('video');
            if (vid) vid.pause();
        }
    
        const {
            videoGroupEl,
            slideEl,
        } = this.slides[slideKey];
    
        videoGroupEl.classList.toggle('hero-slide-video--visible', true);
        slideEl.classList.toggle('hero-slide--visible', true);
    
        this._preloadSlideVideo(slideKey);
        this.currentSlideKey = slideKey;
    
        this.lastTimeSlideChanged = Date.now();
    };

    toSlide = (
        slideKey: string,
        noTimeout: boolean|'no timeout' = false,
        animationDirection: 'prev'|'next'|'byIndex',
    ) => this._changeSlide(slideKey, noTimeout, animationDirection);

    prevSlide = (wrap: false|'wrap' = false) => {
        let i = this.slideKeys.indexOf(this.currentSlideKey) - 1;
        if (wrap && i < 0) i = this.slideKeys.length - 1;
        if (i >= 0) {
            this._changeSlide(
                this.slideKeys[i],
                // start timeout before next change
                isMobileScreen() ? 'no timeout' : false,
                // fade animation
                isMobileScreen() ? 'prev' : 'byIndex',
            );
        }
    };
    
    nextSlide = () => {
        let i = this.slideKeys.indexOf(this.currentSlideKey);
        i = (i + 1) % this.slideKeys.length;
        this._changeSlide(
            this.slideKeys[i],
            // start timeout before next change
            isMobileScreen() ? 'no timeout' : false,
            // fade animation
            isMobileScreen() ? 'next' : 'byIndex',
        );
    };
}
