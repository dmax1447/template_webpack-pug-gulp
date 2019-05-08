type CAROUSEL_TRIGGER = 'click'|'timeout';

/**
 * DOM should be:  
 * 
 *  root  
 *  --item  
 *  --item
 * 
 * root element should contain only carousel items
 * 
 * @param root root element or selector
 */
export function singleCarouselFade(
    root: HTMLElement|string,
    params: {
        fadeTimeMS?: number,
        timeoutMS?: number,
        trigger?: CAROUSEL_TRIGGER[],
        pauseOnHover?: boolean,
        firstItemIndex?: number,
        itemClass?: string,
        itemClassHidden?: string,
        itemClassShow?: string,
        itemClassFadeout?: string,
        itemClassCurrent?: string,
    } = {},
) {
    const {
        fadeTimeMS = 2000,
        timeoutMS = 6000,
        trigger = [ 'click', 'timeout' ],
        pauseOnHover = true,
        firstItemIndex = 0,
        itemClass = 'single-carousel-fade__item',
        itemClassHidden = 'single-carousel-fade__item--hidden',
        itemClassShow = 'single-carousel-fade__item--show',
        itemClassFadeout = 'single-carousel-fade__item--fade-out',
        itemClassCurrent = 'single-carousel-fade__item--current',
    } = params;

    let rootEl: HTMLElement;
    if (typeof root === 'string') {
        root = document.querySelector<HTMLElement>(root)!;
        if (!root) {
            console.error(`singleCarouselFade: root element not found; "${root}"`);
            return null;
        }
    }
    rootEl = root;

    const initReset = () => {
        for (let i = 0, len = rootEl.children.length; i < len; ++i) {
            const el = rootEl.children.item(i)! as HTMLElement;

            el.style.transitionDuration = `${fadeTimeMS}ms`;
            el.classList.add(itemClass);
    
            if (i === firstItemIndex) {
                el.classList.add(itemClassShow);
                el.classList.add(itemClassCurrent);
            } else {
                el.classList.add(itemClassHidden);
            }
        }
    };
    initReset();

    let intervalTimer = 0;

    const stopTimer = () => {
        if (intervalTimer) {
            window.clearInterval(intervalTimer);
            intervalTimer = 0;
        }
    };

    const startTimer = () => {
        if (intervalTimer) stopTimer();
        intervalTimer = window.setInterval(nextItem, timeoutMS);
    };

    const disposePool = new Set<Function>([
        stopTimer,
    ]);

    const dispose = () => {
        disposePool.forEach(x => x());
        disposePool.clear();
    };

    const carouselControl = {
        dispose,
        stopTimer,
        startTimer,
    };

    const fadeInItem = (el: HTMLElement) => {
        el.classList.add(itemClassFadeout);
        el.classList.remove(itemClassHidden);
        el.classList.add(itemClassCurrent);

        requestAnimationFrame(() => {
            el.classList.remove(itemClassFadeout);
            el.classList.add(itemClassShow);
        });
    };

    const fadeOutItem = (el: HTMLElement) => {
        el.classList.add(itemClassFadeout);
        el.classList.remove(itemClassShow);
        el.classList.remove(itemClassCurrent);

        return {
            timer: setTimeout(_hideItem, fadeTimeMS, el),
            element: el,
        };
    };

    const _hideItem = (el: HTMLElement) => {
        if (el && el.classList) {
            el.classList.add(itemClassHidden);
            el.classList.remove(itemClassFadeout);
            el.classList.remove(itemClassCurrent);
            el.classList.remove(itemClassShow);
            _nextItemTimer = null;
        }
    };

    const findNextItem = (current: HTMLElement): { nextItem: HTMLElement, nextItemIndex: number } => {
        let currentIndex = -1;

        for (let i = 0, len = rootEl.children.length; i < len; ++i) {
            const el = rootEl.children.item(i);
            if (el === current) currentIndex = i;
        }

        if (currentIndex === -1) {
            console.warn('singleCarouselFade: failed find current index');
            currentIndex = 0;
        }

        currentIndex = (currentIndex + 1) % rootEl.children.length;
        const nextItem = rootEl.children.item(currentIndex)! as HTMLElement;

        return {
            nextItem,
            nextItemIndex: currentIndex,
        };
    };

    let _nextItemTimer: ReturnType<typeof fadeOutItem>|null = null;
    
    const nextItem = () => {
        const currentItem = rootEl.querySelector<HTMLElement>(`.${itemClassCurrent}`);
        if (!currentItem) {
            console.warn('singleCarouselFade: no current item found, resetting');
            initReset();
            return;
        }

        const { nextItem } = findNextItem(currentItem);

        if (_nextItemTimer) {
            clearTimeout(_nextItemTimer.timer);
            _hideItem(_nextItemTimer.element);
        }

        fadeInItem(nextItem);
        _nextItemTimer = fadeOutItem(currentItem);
    };

    if (trigger.includes('timeout')) {
        startTimer();
    }

    if (trigger.includes('click')) {
        const onClick = () => {
            if (trigger.includes('timeout') && !pauseOnHover) {
                stopTimer();
                nextItem();
                startTimer();
            } else {
                nextItem();
            }
        };

        rootEl.addEventListener('click', onClick);
        disposePool.add(() => rootEl.removeEventListener('click', onClick));
    }

    if (pauseOnHover && trigger.includes('timeout')) {
        const mouseEnter = () => {
            stopTimer();
        };

        const mouseLeave = () => {
            startTimer();
        };

        rootEl.addEventListener('mouseenter', mouseEnter);
        rootEl.addEventListener('mouseleave', mouseLeave);

        disposePool.add(() => {
            rootEl.removeEventListener('mouseenter', mouseEnter);
            rootEl.removeEventListener('mouseleave', mouseLeave);
        });
    }

    return carouselControl;
}