import { $q, isMobileScreen, listenSwipe, SwipeListener } from "../../core/utils";
import { isInertionScroll } from "../../core/lethargy-scroll";
import { listenMouseWheel, MouseWheelListener } from "../../core/mouse-wheel";

export class HeroControls {
    prevSlide: (wrap?: false|'wrap') => void;
    nextSlide: (wrap?: false|'wrap') => void;

    _registeredSwipe?: Function;
    _registeredMouseWheel?: Function;

    constructor(params: {
        prevSlide: (wrap?: false|'wrap') => void,
        nextSlide: (wrap?: false|'wrap') => void,
    }) {
        this.prevSlide = params.prevSlide;
        this.nextSlide = params.nextSlide;
    }

    reset = () => {
        this.unregister();
        this._register();
    };

    /** use `reset` instead */
    _register = () => {
        if (isMobileScreen()) {
            this._registeredSwipe = listenSwipe($q('section.hero'), this._onSwipe, 30);
        }
        
        window.addEventListener('keydown', this._onKeyDown);

        if (this._registeredMouseWheel) {
            this._registeredMouseWheel();
            this._registeredMouseWheel = undefined;
        }
        this._registeredMouseWheel = listenMouseWheel(window, this._onWheel, {
            checkInertion: true,
            checkDirection: true,
        });
    };

    unregister = () => {
        if (this._registeredMouseWheel) {
            this._registeredMouseWheel();
            this._registeredMouseWheel = undefined;
        }
        if (this._registeredSwipe) {
            this._registeredSwipe();
            this._registeredSwipe = undefined;
        }
        window.removeEventListener('keydown', this._onKeyDown);
    };

    _onWheel: MouseWheelListener = ({ isInertion, directionY }) => {
        console.log('_onWheel', isInertion, directionY);
        if (isInertion || !directionY) return;
        if (directionY === 'down') this.nextSlide();
        else this.prevSlide('wrap');
    };

    _onSwipe: SwipeListener = (direction) => {
        if (direction === 'left') this.prevSlide('wrap');
        else if (direction === 'right') this.nextSlide('wrap');
    };

    _onKeyDown = (evt: KeyboardEvent) => {
        if (evt.key === 'ArrowUp' || evt.code === 'ArrowUp' || evt.key === 'ArrowLeft' || evt.code === 'ArrowLeft')  this.prevSlide();
        if (evt.key === 'ArrowDown' || evt.code === 'ArrowDown' || evt.key === 'ArrowRight' || evt.code === 'ArrowRight') this.nextSlide();
    };
}