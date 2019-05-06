
import {
    $q, getWindowGlobalRect, intersectionRate, smoothScrollTo, getGlobalRect,
} from '../../core/utils';

export type AnchorDef = {
    selector: string,
    hash: string,
    onEnter?: Function,
    onLeave?: Function,
};

const MIN_TIME_BEFORE_ANCHOR_CHANGE = 300;

export class AnchorNav {
    anchors: AnchorDef[];
    currentAnchorIndex = 0;
    lastTimeAnchorChanged = 0;

    constructor(anchors: AnchorDef[]) {
        this.anchors = anchors;
    }

    /** current in-view anchor; returns [ anchor, index ] or undefined */
    getCurrentAnchor = (): [ AnchorDef, number ]|undefined => {
        const wndRect = getWindowGlobalRect();
    
        const anchors = this.anchors.map((x, i) => {
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
    };
    
    setCurrentAnchor = async (index: number, force: 'force'|false = false) => {
        const now = Date.now();
        if (!force && now !== 0 && (now - MIN_TIME_BEFORE_ANCHOR_CHANGE) < this.lastTimeAnchorChanged) return;
    
        const anch = this.anchors[index];
    
        if (!force && this.currentAnchorIndex !== index) {
            const prevousAnch = this.anchors[this.currentAnchorIndex];
            if (prevousAnch.onLeave) {
                await prevousAnch.onLeave();
            }
            if (anch.onEnter) {
                await anch.onEnter();
            }
        }
    
        const scrollingTask = smoothScrollTo($q(`#${anch.hash}`));
        this.currentAnchorIndex = index;
        this.lastTimeAnchorChanged = now;

        return scrollingTask;
    };
    
    centerCurrentAnchor = async () => {
        const anch = this.getCurrentAnchor();
        if (!anch) return;
    
        if (anch[0].onEnter) await anch[0].onEnter();
        return this.setCurrentAnchor(anch[1]);
    }
    
    prevAnchor = async () => {
        const curA = this.getCurrentAnchor();
        if (!curA) return;
    
        const prevIndex = Math.max(0, curA[1] - 1);
        if (prevIndex === curA[1]) return;
    
        const anch = this.anchors[prevIndex];
    
        if (curA[0].onLeave) await curA[0].onLeave();
    
        this.currentAnchorIndex = prevIndex;
        if (anch.onEnter) {
            await anch.onEnter();
        } else {
            return this.setCurrentAnchor(prevIndex);
        }
    };
    
    nextAnchor = async () => {
        const curA = this.getCurrentAnchor();
        if (!curA) return;
    
        const nextIndex = curA[1] + 1;
        if (nextIndex === curA[1] || this.anchors.length === nextIndex) return;
    
        const anch = this.anchors[nextIndex];
    
        if (curA[0].onLeave) await curA[0].onLeave();
    
        if (anch.onEnter) {
            await anch.onEnter();
        } else {
            return this.setCurrentAnchor(nextIndex);
        }
    };
}