import { $ as $q, getScroll, isMobileScreen, disableScroll, enableScroll } from "../../core/utils";
import { Hero } from "./hero";
import { AnchorNav } from "./anchor-nav";

const Lethargy = require("exports-loader?this.Lethargy!lethargy/lethargy");
const lethargy = new Lethargy();

const CHANGING_TIMEOUT = 60;

export class AnchorNavControls {
    prevousYScroll: number = 0;
    hero: Hero;
    anchorNav: AnchorNav;

    constructor(
        hero: Hero,
        anchorNav: AnchorNav,
    ) {
        this.hero = hero;
        this.anchorNav = anchorNav;
    }

    init = () => this.reset();

    reset = () => {
        let { top: prevousYScroll } = getScroll();
        this.prevousYScroll = prevousYScroll;

        $('html').off('mousewheel', this._onMouseWheel as any);
    
        if (!isMobileScreen()) {
            $('html').on('mousewheel', this._onMouseWheel);
            disableScroll();
        } else {
            enableScroll();
        }
    
        window.removeEventListener('scroll', this._onScroll);
        console.log('anchor nav controls: reset');
        if (isMobileScreen()) {
            console.log('anchor nav controls: isMobileScreen');
            window.addEventListener('scroll', this._onScroll);
        } else {
            console.log('anchor nav controls: not isMobileScreen');
        }

        window.removeEventListener('keydown', this._onKeyDown);
        if (!isMobileScreen()) {
            window.addEventListener('keydown', this._onKeyDown);
        }
    };

    /** anchors changing */
    _changing = false;

    _onMouseWheel = (e: JQueryMousewheel.JQueryMousewheelEventObject) => {
        if(lethargy.check(e) === false) return;
        
        if ((this.hero.isHeroMode && !this.hero.heroCarousel.isLastSlide()) || this._changing) return;
        const direction = e.deltaY > 0 ? 'up' : 'down';
        
        if (direction === 'down') this.anchorNav.nextAnchor();
        else this.anchorNav.prevAnchor();

        this._changing = true;
        setTimeout(() => this._changing = false, CHANGING_TIMEOUT);
    };

    _onScroll = (evt: Event) => {
        const { top: newY } = getScroll();
        const deltaY = newY - this.prevousYScroll;
        this.prevousYScroll = newY;

        if (deltaY < 0 && window.scrollY <= ($q('section.hero').getBoundingClientRect().height / 2)) {
            console.log('anchor nav controls: this.hero.enterHeroMode');
            this.hero.enterHeroMode();
        }

        if (window.scrollY >= ($q('section.hero').getBoundingClientRect().height / 2)) {
            console.log('anchor nav controls: this.hero.leaveHeroMode');
            this.hero.leaveHeroMode();
        }
    };

    _onKeyDown = (evt: KeyboardEvent) => {
        if ((this.hero.isHeroMode && !this.hero.heroCarousel.isLastSlide()) || this._changing) return;

        if (evt.key === 'ArrowDown' || evt.code === 'ArrowDown' || evt.key === 'ArrowRight' || evt.code === 'ArrowRight') this.anchorNav.nextAnchor();
        if (evt.key === 'ArrowUp' || evt.code === 'ArrowUp' || evt.key === 'ArrowLeft' || evt.code === 'ArrowLeft')  this.anchorNav.prevAnchor();
        
        this._changing = true;
        setTimeout(() => this._changing = false, CHANGING_TIMEOUT);
    };
}