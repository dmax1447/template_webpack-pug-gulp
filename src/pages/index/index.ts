import './index.scss';
import { initHero, enterHeroMode, leaveHeroMode, isHeroMode, isLastSlide } from './hero';
import {
    $ as $q, $all, getWindowGlobalRect, isGlobalRectInViewport, intersectionRate, smoothScrollTo, getGlobalRect,
} from '../../core/utils';

const pageScrollAnchors: { selector: string, hash: string, onEnter?: Function, onLeave?: Function }[] = [
    {
        hash: "hero",
        selector: '#hero',
        onEnter: enterHeroMode,
        onLeave: () => {
            leaveHeroMode();
            setTimeout(() => smoothScrollTo($q('#we-help')), 500);
        },
    },
    {
        hash: 'we-help',
        selector: '.features__we-help-items'
    },
    {
        hash: 'we-offer',
        selector: '.features__we-offer-items'
    },
    {
        hash: 'feedback',
        selector: '#feedback'
    },
];

/** current in-view anchor */
function getCurrentAnchor() {
    const totalPageHeight = window.outerHeight;
    const wndRect = getWindowGlobalRect();

    const anchors = pageScrollAnchors.map((x, i) => {
        const { hash, selector, onEnter, onLeave } = x;

        return {
            rect: getGlobalRect($q(selector)),
            index: i,
            hash,
            selector,
            inViewportRatio: 0,
            onEnter,
            onLeave,
        };
    });

    let maxInViewRatio = 0;
    let maxInViewRatioAIndex = undefined;

    // calculate anchor's height as (anchor[i+1].top - anchor[i].top)
    for (let i = 0; i < anchors.length; ++i) {
        // const nextTop = i === anchors.length - 1 ? totalPageHeight : anchors[i+1].top;
        // anchors[i].height = nextTop - anchors[i].top;
        // const anchorRect = {
        //     left: 0,
        //     right: 0,
        //     top: anchors[i].top,
        //     height: anchors[i].height,
        //     width: wndRect.width,
        //     bottom: totalPageHeight - (anchors[i].top + anchors[i].height),
        // };

        anchors[i].inViewportRatio = intersectionRate(anchors[i].rect, wndRect);

        if (maxInViewRatio < anchors[i].inViewportRatio) {
            maxInViewRatio = anchors[i].inViewportRatio;
            maxInViewRatioAIndex = i;
        }
    }

    console.log(maxInViewRatioAIndex, anchors);

    if (maxInViewRatioAIndex === undefined) return undefined;
    return anchors[maxInViewRatioAIndex];
}

function scrollToSet(hash: string) {
    // window.location.he
    smoothScrollTo($q(`#${hash}`));
}

function centerCurrentAnchor() {
    const anch = getCurrentAnchor();
    if (!anch) return;

    if (anch.onEnter) anch.onEnter();
    scrollToSet(anch.hash);
}

function prevAnchor() {
    const curA = getCurrentAnchor();
    if (!curA) return;

    const prevIndex = Math.max(0, curA.index - 1);
    if (prevIndex === curA.index) return;

    const anch = pageScrollAnchors[prevIndex];

    if (curA.onLeave) curA.onLeave();

    if (anch.onEnter) {
        anch.onEnter();
    } else {
        setTimeout(() => scrollToSet(anch.hash), 300);
    }
}

function nextAnchor() {
    const curA = getCurrentAnchor();
    if (!curA) return;

    const nextIndex = (curA.index + 1) % pageScrollAnchors.length;
    if (nextIndex === curA.index) return;

    const anch = pageScrollAnchors[nextIndex];

    if (curA.onLeave) curA.onLeave();

    if (anch.onEnter) {
        anch.onEnter();
    } else {
        setTimeout(() => scrollToSet(anch.hash), 300);
    }
}

window.addEventListener('load', () => {
    // Reset scroll action while user stil strolling
    let wheelTimer = 0;

    // If user scrolled a lot, just center current scene on current anchor
    let timerRestartsCount = -1;
    let accum = 0;

    $('html').mousewheel((e) => {
        if (isHeroMode && !isLastSlide()) return;
        const direction = e.deltaY > 0 ? 'up' : 'down';

        if (direction === 'down') accum++;
        else accum--;

        ++timerRestartsCount;
        window.clearTimeout(wheelTimer);

        wheelTimer = window.setTimeout(function() {
            if (Math.abs(accum) <= 3) {
                if (direction === 'down') nextAnchor();
                else prevAnchor();
            } else {
                centerCurrentAnchor();
            }
            
            timerRestartsCount = -1;
            accum = 0;
        }, 200);
    });

    initHero();
});
