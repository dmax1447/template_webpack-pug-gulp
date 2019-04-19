import './index.scss';

if (process.env.BUILD === 'prod') {
    require('./no-rem.scss');
}

import { initHero, enterHeroMode, leaveHeroMode, isHeroMode, isLastSlide } from './hero';
import {
    $ as $q, $all, getWindowGlobalRect, isGlobalRectInViewport, intersectionRate, smoothScrollTo, getGlobalRect, isMobileScreen, getScroll, disableScroll, sleep,
} from '../../core/utils';

const Lethargy = require("exports-loader?this.Lethargy!lethargy/lethargy");
const lethargy = new Lethargy();

const pageScrollAnchors: { selector: string, hash: string, onEnter?: Function, onLeave?: Function }[] = [
    {
        hash: "hero",
        selector: '#hero',
        onEnter: enterHeroMode,
        onLeave: () => {
            leaveHeroMode();
            setTimeout(() => smoothScrollTo($q('#we-help')), 500);
            return sleep(500);
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

const MIN_TIME_BEFORE_ANCHOR_CHANGE = 300;

let currentAnchorIndex = 0;
let lastTimeAnchorChanged = 0;

/** current in-view anchor; returns [ anchor, index ] or undefined */
function getCurrentAnchor(): [ (typeof pageScrollAnchors[0]), number ]|undefined {
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

    for (let i = 0; i < anchors.length; ++i) {
        anchors[i].inViewportRatio = intersectionRate(anchors[i].rect, wndRect);

        if (maxInViewRatio < anchors[i].inViewportRatio) {
            maxInViewRatio = anchors[i].inViewportRatio;
            maxInViewRatioAIndex = i;
        }
    }

    if (maxInViewRatioAIndex === undefined) return undefined;
    return [ anchors[maxInViewRatioAIndex], maxInViewRatioAIndex ];
}

async function setCurrentAnchor(index: number) {
    const now = Date.now();
    if (now !== 0 && (now - MIN_TIME_BEFORE_ANCHOR_CHANGE) < lastTimeAnchorChanged) return;

    const anch = pageScrollAnchors[index];

    if (currentAnchorIndex !== index) {
        const prevousAnch = pageScrollAnchors[currentAnchorIndex];
        if (prevousAnch.onLeave) {
            await prevousAnch.onLeave();
        }
        if (anch.onEnter) {
            await anch.onEnter();
        }
    }

    smoothScrollTo($q(`#${anch.hash}`));
    currentAnchorIndex = index;
    lastTimeAnchorChanged = now;
}

function centerCurrentAnchor() {
    const anch = getCurrentAnchor();
    if (!anch) return;

    if (anch[0].onEnter) anch[0].onEnter();
    setCurrentAnchor(anch[1]);
}

function prevAnchor() {
    const curA = getCurrentAnchor();
    if (!curA) return;

    const prevIndex = Math.max(0, curA[1] - 1);
    if (prevIndex === curA[1]) return;

    const anch = pageScrollAnchors[prevIndex];

    if (curA[0].onLeave) curA[0].onLeave();

    currentAnchorIndex = prevIndex;
    if (anch.onEnter) {
        anch.onEnter();
    } else {
        setTimeout(() => {
            setCurrentAnchor(prevIndex);
        }, 300);
    }
}

function nextAnchor() {
    const curA = getCurrentAnchor();
    if (!curA) return;

    const nextIndex = curA[1] + 1;
    if (nextIndex === curA[1] || pageScrollAnchors.length === nextIndex) return;

    const anch = pageScrollAnchors[nextIndex];

    if (curA[0].onLeave) curA[0].onLeave();

    if (anch.onEnter) {
        anch.onEnter();
    } else {
        setTimeout(() => {
            setCurrentAnchor(nextIndex);
        }, 300);
    }
}

const setup = () => {
    if (!isMobileScreen()) {
        let changing = false;
        $('html').mousewheel((e) => {
            if(lethargy.check(e) === false) return;
            
            if (isHeroMode && !isLastSlide() || changing) return;
            const direction = e.deltaY > 0 ? 'up' : 'down';
            
            if (direction === 'down') nextAnchor();
            else prevAnchor();

            changing = true;
            setTimeout(() => changing = false, 300);
        });
        disableScroll();
    }

    if (isMobileScreen()) {
        let { top: prevousY } = getScroll();

        window.addEventListener('scroll', (evt) => {
            if (isHeroMode) return;
            
            const { top: newY } = getScroll();
            const deltaY = newY - prevousY;
            prevousY = newY;

            if (deltaY < 0 && window.scrollY <= ($q('section.hero').getBoundingClientRect().height / 2)) {
                enterHeroMode();
            }
        });
    }

    initHero();

    if (isHeroMode) currentAnchorIndex = 0;
    else {
        const curAnch = getCurrentAnchor();
        if (!curAnch) {
            currentAnchorIndex = 0;
            enterHeroMode();
        }
    }

    // fix for safari wheel animation

    $q('.mouse-help-icon__wheel').style.animation = 'none';
    $q('.mouse-help-icon__wheel').style.webkitAnimation = 'none';

    setTimeout(() => {
        $q('.mouse-help-icon__wheel').style.animation = '';
        $q('.mouse-help-icon__wheel').style.webkitAnimation = '';
    }, 100);
};

window.addEventListener('load', setup);

let resizeTimeout: any;
window.addEventListener('resize', () => {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(setup, 1000);
});