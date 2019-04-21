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
    isHeroMode: boolean = false;

    heroCarousel = new HeroCarousel();
    heroControls = new HeroControls({
        prevSlide: (wrap) => this.heroCarousel.prevSlide(wrap),
        nextSlide: () => {
            if (this.heroCarousel.isLastSlide()) this.leaveHeroMode();
            else this.heroCarousel.nextSlide();
        },
    });

    onEnterHero: () => void;
    onLeaveHero: () => void;

    constructor(params: {
        onEnterHero: () => void,
        onLeaveHero: () => void,
    }) {
        this.onEnterHero = params.onEnterHero;
        this.onLeaveHero = params.onLeaveHero;
    }

    init = () => {
        this.heroCarousel.init();
    
        printSVGNumbers();
    
        if (window.scrollY <= ($q('section.hero').getBoundingClientRect().height / 2)) {
            this.enterHeroMode();
        } else {
            this.leaveHeroMode();
        }
    
        setTimeout(() => {
            $q('.features .top-bar').style.display = 'block';
        }, 100);
    
        $q('section.hero a[href="#feedback"]').removeEventListener('click', this.leaveHeroMode);
        $q('section.hero a[href="#feedback"]').addEventListener('click', this.leaveHeroMode);
    };

    enterHeroMode = () => {
        if (!isMobileScreen()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.isHeroMode = true;
            this.heroControls.register();
            this.onEnterHero();
        }
        $q('.features .top-bar').classList.add('top-bar--hidden');
    };

    leaveHeroMode = () => {
        if (!isMobileScreen()) {
            this.isHeroMode = false;
            this.heroControls.unregister();
            this.onLeaveHero();
        }
        $q('.features .top-bar').classList.remove('top-bar--hidden');
    };
}
