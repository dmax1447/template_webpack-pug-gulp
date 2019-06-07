import { listenSwipe } from "../utils-mobile";

type CAROUSEL_TRIGGER = 'click'|'timeout'|'touch swipe';

type SingleCarouselFadeParams = {
    fadeTimeMS?: number,
    timeoutMS?: number,
    trigger?: Array<CAROUSEL_TRIGGER>,
    pauseOnHover?: boolean,
    firstItemIndex?: number,
    itemClass?: string,
    itemClassHidden?: string,
    itemClassShow?: string,
    itemClassFadeout?: string,
    itemClassCurrent?: string,
    dotsContainerClass?: string,
    dotsClass?: string,
    dotsClassCurrent?: string,
    dotsStyles?: CSSStyleDeclaration,
    noDots?: boolean,
    /** can change to next item? can be used eg to pause changing in some conditions */
    canChange?: (params: {
        currentItem: HTMLElement,
        nextItem: HTMLElement,
        nextItemIndex: number,
        params: SingleCarouselFadeParams,
    }) => boolean,
};

/**
 * DOM should be:  
 * 
 *  root  
 *  --item  
 *  --item
 * 
 * root element should contain only carousel items  
 * items can be swapped dynamically after carousel was initializated
 * 
 * @param root root element or selector
 */
export function singleCarouselFade(
    root: HTMLElement|string,
    params: SingleCarouselFadeParams = {},
) {
    const {
        fadeTimeMS = 2000,
        timeoutMS = 6000,
        trigger = [ 'click', 'timeout', 'touch swipe' ] as Array<CAROUSEL_TRIGGER>,
        pauseOnHover = true,
        firstItemIndex = 0,
        itemClass = 'single-carousel-fade__item',
        itemClassHidden = 'single-carousel-fade__item--hidden',
        itemClassShow = 'single-carousel-fade__item--show',
        itemClassFadeout = 'single-carousel-fade__item--fade-out',
        itemClassCurrent = 'single-carousel-fade__item--current',
        dotsContainerClass = 'single-carousel-fade__dot-container',
        dotsClass = 'single-carousel-fade__dot',
        dotsClassCurrent = 'single-carousel-fade__dot--current',
        dotsStyles = {},
        noDots = false,
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

    if (rootEl.children.length <= 1) {
        console.warn('singleCarouselFade: one or less items');
        return null;
    }

    const initReset = () => {
        // remove dots
        let dotsC = rootEl.querySelector(`.${dotsContainerClass}`);
        if (dotsC) dotsC.remove();

        // setup children
        let itemsNum = rootEl.children.length;

        for (let i = 0, len = itemsNum; i < len; ++i) {
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
        
        // append dots
        if (!noDots) {
            dotsC = document.createElement('div');
            dotsC.className = dotsContainerClass;
            const dotsStylesKV = Object.entries(dotsStyles);
    
            for (let i = 0; i < itemsNum; ++i) {
                const dot = document.createElement('div');
                dot.className = dotsClass;
                for (const [ k, v ] of dotsStylesKV) {
                    (dot.style as any)[k] = v;
                }
                if (i === firstItemIndex) {
                    dot.classList.add(dotsClassCurrent);
                }
                dotsC.appendChild(dot);
            }
            rootEl.appendChild(dotsC);
        }
    };
    initReset();

    const setCurrentDot = (dotIndex: number) => {
        if (noDots) return;
        
        const dotsC = rootEl.querySelector(`.${dotsContainerClass}`);
        if (!dotsC) {
            console.error('singleCarouselFade: no dots container found, but params.noDots=false');
            return;
        }

        // remove 'current'
        const dotCur = dotsC.querySelector(`.${dotsClassCurrent}`);
        if (dotCur) {
            dotCur.classList.remove(dotsClassCurrent);
        }

        // set 'current'
        const dotI = dotsC.children.item(dotIndex);
        if (!dotI) {
            console.error(`singleCarouselFade: no dot by specified index found; dotIndex=${dotIndex}`);
            return;
        }

        dotI.classList.add(dotsClassCurrent);
    };

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
        const items = rootEl.querySelectorAll(`.${itemClass}`);

        findCurrentIndex: for (let i = 0, len = items.length; i < len; ++i) {
            const el = items.item(i);
            if (el === current) {
                currentIndex = i;
                break findCurrentIndex;
            }
        }

        if (currentIndex === -1) {
            console.warn('singleCarouselFade: failed find current index');
            currentIndex = 0;
        }

        currentIndex = (currentIndex + 1) % items.length;
        const nextItem = items.item(currentIndex)! as HTMLElement;

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

        const { nextItem, nextItemIndex } = findNextItem(currentItem);

        if (params.canChange) {
            if (!params.canChange({
                currentItem,
                nextItem,
                nextItemIndex,
                params,
            })) {
                console.log('singleCarouselFade: canChange returned false, skipping change');
            }
        }

        if (_nextItemTimer) {
            clearTimeout(_nextItemTimer.timer);
            _hideItem(_nextItemTimer.element);
        }

        setCurrentDot(nextItemIndex);
        fadeInItem(nextItem);
        _nextItemTimer = fadeOutItem(currentItem);
    };

    const carouselControl = {
        dispose,
        stopTimer,
        startTimer,
        nextItem,
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

    if (trigger.includes('touch swipe')) {
        listenSwipe(rootEl, (dir) => {
            if (dir === 'right' || dir === 'down') {
                nextItem();
            }
        }, undefined, 'only touch');
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