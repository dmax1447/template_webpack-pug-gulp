import { $ as $q, getScroll, isMobileScreen, disableScroll, enableScroll } from "../../core/utils";
import { Hero } from "./hero";
import { AnchorNav } from "./anchor-nav";

const Lethargy = require("exports-loader?this.Lethargy!lethargy/lethargy");
const lethargy = new Lethargy();

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
        if (isMobileScreen()) {
            window.addEventListener('scroll', this._onScroll);
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
        setTimeout(() => this._changing = false, 300);
    };

    _onScroll = (evt: Event) => {
        if (this.hero.isHeroMode) return;
        if(lethargy.check(evt) === false) return;
        
        const { top: newY } = getScroll();
        const deltaY = newY - this.prevousYScroll;
        this.prevousYScroll = newY;

        if (deltaY < 0 && window.scrollY <= ($q('section.hero').getBoundingClientRect().height / 2)) {
            this.hero.enterHeroMode();
        }
    };

    _onKeyDown = (evt: KeyboardEvent) => {
        if ((this.hero.isHeroMode && !this.hero.heroCarousel.isLastSlide()) || this._changing) return;

        if (evt.key === 'ArrowDown' || evt.code === 'ArrowDown' || evt.key === 'ArrowRight' || evt.code === 'ArrowRight') this.anchorNav.nextAnchor();
        if (evt.key === 'ArrowUp' || evt.code === 'ArrowUp' || evt.key === 'ArrowLeft' || evt.code === 'ArrowLeft')  this.anchorNav.prevAnchor();
        
        this._changing = true;
        setTimeout(() => this._changing = false, 300);
    };
}