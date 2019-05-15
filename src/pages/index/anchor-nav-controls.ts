import { $q, getScroll, isMobileScreen, disableScroll, enableScroll } from "../../core/utils";
import { Hero } from "./hero";
import { AnchorNav } from "./anchor-nav";
import { isInertionScroll } from "../../core/lethargy-scroll";
import { listenMouseWheel, MouseWheelListener } from "../../core/mouse-wheel";

export class AnchorNavControls {
    prevousYScroll: number = 0;
    hero: Hero;
    anchorNav: AnchorNav;
    _registeredMouseWheel?: Function;

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

        if (this._registeredMouseWheel) {
            this._registeredMouseWheel();
            this._registeredMouseWheel = undefined;
        }
    
        if (!isMobileScreen()) {
            this._registeredMouseWheel = listenMouseWheel(window, this._onMouseWheel, {
                checkInertion: true,
                checkDirection: true,
            });

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

    _onMouseWheel: MouseWheelListener = async ({ isInertion, directionY }) => {
        if (isInertion || !directionY) return;

        if ((this.hero.isHeroMode && !this.hero.heroCarousel.isLastSlide()) || this._changing) {
            return;
        }

        this._changing = true;
        if (directionY === 'down') await this.anchorNav.nextAnchor();
        else await this.anchorNav.prevAnchor();
        this._changing = false;
    };

    _onScroll = async (evt: Event) => {
        if (this._changing) return;

        const { top: newY } = getScroll();
        const deltaY = newY - this.prevousYScroll;
        this.prevousYScroll = newY;

        if (!this.hero.isHeroMode && deltaY < 0 && window.scrollY <= ($q('section.hero').getBoundingClientRect().height / 2)) {
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