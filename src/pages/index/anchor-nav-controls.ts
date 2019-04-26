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
        } else {
        }

        window.removeEventListener('keydown', this._onKeyDown);
        if (!isMobileScreen()) {
            window.addEventListener('keydown', this._onKeyDown);
        }
    };

    /** anchors changing */
    _changing = false;

    _onMouseWheel = async (e: JQueryMousewheel.JQueryMousewheelEventObject) => {
        if(lethargy.check(e) === false) return;

        alert('wheel anc');
        
        if ((this.hero.isHeroMode && !this.hero.heroCarousel.isLastSlide()) || this._changing) {
            return;
        }
        const direction = e.deltaY > 0 ? 'up' : 'down';
        
        this._changing = true;
        if (direction === 'down') await this.anchorNav.nextAnchor();
        else await this.anchorNav.prevAnchor();
        this._changing = false;
    };

    _onScroll = async (evt: Event) => {
        if (this._changing) return;

        const { top: newY } = getScroll();
        const deltaY = newY - this.prevousYScroll;
        this.prevousYScroll = newY;

        if (!this.hero.isHeroMode && deltaY < 0 && window.scrollY <= ($q('section.hero').getBoundingClientRect().height / 2)) {
            alert('scroll anc');
            this._changing = true;
            await this.hero.enterHeroMode();
            this._changing = false;
        }

        if (this.hero.isHeroMode && window.scrollY >= ($q('section.hero').getBoundingClientRect().height / 2)) {
            this._changing = true;
            await this.hero.leaveHeroMode();
            this._changing = false;
        }
    };

    _onKeyDown = async (evt: KeyboardEvent) => {
        if ((this.hero.isHeroMode && !this.hero.heroCarousel.isLastSlide()) || this._changing) return;

        this._changing = true;
        if (evt.key === 'ArrowDown' || evt.code === 'ArrowDown' || evt.key === 'ArrowRight' || evt.code === 'ArrowRight') await this.anchorNav.nextAnchor();
        if (evt.key === 'ArrowUp' || evt.code === 'ArrowUp' || evt.key === 'ArrowLeft' || evt.code === 'ArrowLeft') await this.anchorNav.prevAnchor();
        this._changing = false;
    };
}