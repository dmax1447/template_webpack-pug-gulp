import { $q, isMobileScreen, listenSwipe } from "../../core/utils";

const Lethargy = require("exports-loader?this.Lethargy!lethargy/lethargy");
const lethargy = new Lethargy();

export class HeroControls {
    prevSlide: (wrap?: false|'wrap') => void;
    nextSlide: (wrap?: false|'wrap') => void;

    _registeredSwipe: Function|undefined;

    constructor(params: {
        prevSlide: (wrap?: false|'wrap') => void,
        nextSlide: (wrap?: false|'wrap') => void,
    }) {
        this.prevSlide = params.prevSlide;
        this.nextSlide = params.nextSlide;
    }

    reset = () => {
        this.unregister();
        this.register();
    };

    register = () => {
        if (isMobileScreen()) {
            this._registeredSwipe = listenSwipe($q('section.hero'), (direction) => {
                if (direction === 'left') this.prevSlide('wrap');
                else if (direction === 'right') this.nextSlide('wrap');
            }, 30);
        }
        
        $('html').on('mousewheel', this._onWheel);
        window.addEventListener('keydown', this._onKeyDown);
    };

    unregister = () => {
        $('html').off('mousewheel', this._onWheel as any);
        if (this._registeredSwipe) {
            this._registeredSwipe();
            this._registeredSwipe = undefined;
        }
        window.removeEventListener('keydown', this._onKeyDown);
    };

    _onWheel = (evt: JQueryMousewheel.JQueryMousewheelEventObject) => {
        if(lethargy.check(evt) === false) return;

        const scrollDown = evt.deltaY < 0;

        if (scrollDown) this.nextSlide();
        else this.prevSlide('wrap');
    };

    _onKeyDown = (evt: KeyboardEvent) => {
        if (evt.key === 'ArrowUp' || evt.code === 'ArrowUp' || evt.key === 'ArrowLeft' || evt.code === 'ArrowLeft')  this.prevSlide();
        if (evt.key === 'ArrowDown' || evt.code === 'ArrowDown' || evt.key === 'ArrowRight' || evt.code === 'ArrowRight') this.nextSlide();
    };
}