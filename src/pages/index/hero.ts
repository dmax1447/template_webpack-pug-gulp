import {
    $ as $q, $all, isMobileScreen,
} from '../../core/utils';
import { HeroCarousel } from './hero-carousel';
import { HeroControls } from './hero-controls';

function printSVGNumbers() {
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
}

export class Hero {
    private _isHeroMode: boolean = false;
    get isHeroMode() {
        return this._isHeroMode;
    }

    heroCarousel = new HeroCarousel();
    heroControls = new HeroControls({
        prevSlide: (wrap) => this.heroCarousel.prevSlide(wrap),
        nextSlide: (wrap) => {
            if (!wrap && !isMobileScreen() && this.heroCarousel.isLastSlide()) {
                this.leaveHeroMode();
            } else {
                this.heroCarousel.nextSlide();
            }
        },
    });

    onEnterHero: () => void;
    onLeaveHero: (nextAnchor?: string) => void;

    constructor(params: {
        onEnterHero: () => void,
        onLeaveHero: (nextAnchor?: string) => void,
    }) {
        this.onEnterHero = params.onEnterHero;
        this.onLeaveHero = params.onLeaveHero;
    }

    init = () => {
        printSVGNumbers();
        this.heroCarousel.init();
        this.reset();
    
        setTimeout(() => {
            $q('.features .top-bar').style.display = 'block';
        }, 100);
    
        $q('section.hero a[href="#feedback"]').addEventListener('click', () => this.leaveHeroMode('feedback'));
    };

    reset = () => {
        if (window.scrollY <= ($q('section.hero').getBoundingClientRect().height / 2)) {
            this.enterHeroMode();
        } else {
            this.leaveHeroMode();
        }
        this.heroControls.reset();
    };

    enterHeroMode = () => {
        if (this.isHeroMode) return;
        console.warn('enterHeroMode');
        this._isHeroMode = true;
        this.heroControls.register();
        if (!isMobileScreen()) {
            alert('enterHeroMode scrollTo top:0');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        this.onEnterHero();
        $q('.features .top-bar').classList.add('top-bar--hidden');
    };

    leaveHeroMode = (nextAnchor?: string) => {
        if (!this.isHeroMode) return;
        console.warn('leaveHeroMode');
        this._isHeroMode = false;
        this.heroControls.unregister();
        this.onLeaveHero(nextAnchor);
        $q('.features .top-bar').classList.remove('top-bar--hidden');
    };
}
