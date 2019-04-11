import './index.scss';
import { initHero, enterHeroMode, leaveHeroMode, isHeroMode, isLastSlide } from './hero';
import {
    $ as $q, $all, getWindowGlobalRect, isGlobalRectInViewport, intersectionRate, smoothScrollTo, getGlobalRect,
} from '../../core/utils';

const pageScrollAnchors: (string|{ id: string, onEnter?: Function, onLeave?: Function })[] = [
    {
        id: "hero",
        onEnter: enterHeroMode,
        onLeave: () => {
            leaveHeroMode();
            setTimeout(() => smoothScrollTo($q('#we-help')), 500);
        },
    },
    "we-help",
    "we-offer",
    "feedback"
];

/** current in-view anchor */
function getCurrentAnchor() {
    const totalPageHeight = window.outerHeight;
    const wndRect = getWindowGlobalRect();

    const anchors = pageScrollAnchors.map((x, i) => {
        const { id, onEnter, onLeave } = typeof x !== 'string' ? x : { id: x, onEnter: undefined, onLeave: undefined};
        const { top } = getGlobalRect($q(`#${id}`));
        return {
            index: i,
            id,
            top,
            height: 0,
            inViewportRatio: 0,
            onEnter,
            onLeave,
        };
    });

    let maxInViewRatio = 0;
    let maxInViewRatioAIndex = undefined;

    // calculate anchor's height as (anchor[i+1].top - anchor[i].top)
    for (let i = 0; i < anchors.length; ++i) {
        const nextTop = i === anchors.length - 1 ? totalPageHeight : anchors[i+1].top;
        anchors[i].height = nextTop - anchors[i].top;
        const anchorRect = {
            left: 0,
            right: 0,
            top: anchors[i].top,
            height: anchors[i].height,
            width: wndRect.width,
            bottom: totalPageHeight - (anchors[i].top + anchors[i].height),
        };

        anchors[i].inViewportRatio = intersectionRate(anchorRect, wndRect);

        if (maxInViewRatio < anchors[i].inViewportRatio) {
            maxInViewRatio = anchors[i].inViewportRatio;
            maxInViewRatioAIndex = i;
        }
    }

    console.log(maxInViewRatioAIndex, anchors);

    if (maxInViewRatioAIndex === undefined) return undefined;
    return anchors[maxInViewRatioAIndex];
}

function centerCurrentAnchor() {
    const anch = getCurrentAnchor();
    if (!anch) return;

    if (anch.onEnter) anch.onEnter();
    smoothScrollTo($q(`#${anch.id}`));
}

function prevAnchor() {
    const curA = getCurrentAnchor();
    if (!curA) return;

    const prevIndex = Math.max(0, curA.index - 1);
    if (prevIndex === curA.index) return;

    const x = pageScrollAnchors[prevIndex];
    const anch = typeof x === 'string' ? { id: x } : x;

    if (curA.onLeave) curA.onLeave();

    if (anch.onEnter) {
        anch.onEnter();
    } else {
        setTimeout(() => smoothScrollTo($q(`#${anch.id}`)), 300);
    }
}

function nextAnchor() {
    const curA = getCurrentAnchor();
    if (!curA) return;

    const nextIndex = (curA.index + 1) % pageScrollAnchors.length;
    if (nextIndex === curA.index) return;

    const x = pageScrollAnchors[nextIndex];
    const anch = typeof x === 'string' ? { id: x } : x;

    if (curA.onLeave) curA.onLeave();

    if (anch.onEnter) {
        anch.onEnter();
    } else {
        setTimeout(() => smoothScrollTo($q(`#${anch.id}`)), 300);
    }
}

window.addEventListener('load', () => {
    // Reset scroll action while user stil strolling
    let wheelTimer = 0;

    // If user scrolled a lot, just center current scene on current anchor
    let timerRestartsCount = -1;

    $('html').mousewheel((e) => {
        if (isHeroMode && !isLastSlide()) return;
        const direction = e.deltaY > 0 ? 'up' : 'down';

        ++timerRestartsCount;
        window.clearTimeout(wheelTimer);

        wheelTimer = window.setTimeout(function() {
            if (timerRestartsCount > 0) {
                centerCurrentAnchor();
            } else {
                if (direction === 'down') nextAnchor();
                else prevAnchor();
            }
            timerRestartsCount = -1;
        }, 200);
    });

    initHero();
});
