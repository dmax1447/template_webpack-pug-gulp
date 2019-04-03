import {
    $, $all, isElementInViewport, getGlobalRect, isGlobalRectInViewport, intersectionRate, getWindowGlobalRect, isElementVisible,
} from '../utils';

export function isAnimWaiting(el: HTMLElement) {
    return el.classList.contains('anim--is-waiting');
}

export function isAnimStopped(el: HTMLElement) {
    return el.classList.contains('anim--is-stopped');
}

export function isAnimPlaying(el: HTMLElement) {
    return el.classList.contains('anim--is-playing');
}

export interface AnimatedElement extends HTMLElement {
    "--anim": {
        timeout: ReturnType<typeof setTimeout>|undefined,
        initialRect: DOMRect|ClientRect,
    }
}

export type AnimParams = {
    name: string,
    speed: string,
    delay?: string,
    timingFunction?: string,
    /** intersection rate */
    irate?: number,
};

const DEFAULT_IRATE = 0.5;

export function pickAnimParams(el: HTMLElement): AnimParams {
    return {
        name: el.getAttribute('--anim'),
        speed: el.getAttribute('--anim-speed'),
        delay: el.getAttribute('--anim-delay'),
        timingFunction: el.getAttribute('--anim-timing-function'),
        irate: parseFloat(el.getAttribute('--anim-irate')) || DEFAULT_IRATE,
    };
}

export function isAnimatedElement(el: HTMLElement): el is AnimatedElement {
    if ('--anim' in el) {
        return true;
    }
    return false;
}

export function cleanupAnimation(el: HTMLElement) {
    el.classList.toggle('anim', false);
    el.classList.toggle('anim--is-waiting', false);
    el.classList.toggle('anim--is-playing', false);
    el.classList.toggle('anim--is-stopped', false);
    el.style.animation = undefined;

    if (isAnimatedElement(el)) delete el["--anim"];
}

export function setAnimationStyle(el: HTMLElement, animParams: AnimParams, playState: 'paused'|'running'|'initial' = 'running') {
    if (playState === 'running') {
        setTimeout(() => {
            el.style.animation = `anim-${animParams.name} ${animParams.speed} ${playState}`;
            el.style.animationTimingFunction = animParams.timingFunction;
        }, parseFloat(animParams.delay) * 1000);
    } else {
        el.style.animation = `anim-${animParams.name} ${animParams.speed} ${playState}`;
        el.style.animationTimingFunction = animParams.timingFunction;
    }
}

export function prepareAnimation(el: HTMLElement, animParams: AnimParams) {
    cleanupAnimation(el);

    const ael = el as AnimatedElement;
    ael["--anim"] = {
        timeout: undefined,
        initialRect: getGlobalRect(el),
    };

    el.classList.toggle('anim', true);
    el.classList.toggle('anim--is-waiting', true);
    setAnimationStyle(el, animParams, 'paused');
}

export function afterAnimation(el: AnimatedElement) {
    el.classList.toggle('anim--is-stopped', true);
    el.classList.toggle('anim--is-playing', false);
    el.classList.toggle('anim', false);
    el.style.animation = undefined;
    el['--anim'].timeout = undefined;
}

export function runAnimation(el: HTMLElement, animParams: AnimParams) {
    if (isAnimPlaying(el) || isAnimStopped(el)) {
        console.warn('reset animation before playing');
        return;
    }

    if (!animParams.speed.endsWith('s')) {
        throw new Error('--anim-speed should be in seconds! You may use 0.1s');
    }

    if (!isAnimatedElement(el)) prepareAnimation(el, animParams);
    if (!isAnimatedElement(el)) throw new Error('init failed');

    const animTotalDurationMs = parseFloat(animParams.speed) * 1000 + (animParams.delay ? parseFloat(animParams.delay) * 1000 : 0);

    el.classList.toggle('anim', false);
    el.classList.toggle('anim--is-waiting', false);
    el.classList.toggle('anim--is-playing', true);
    el.classList.toggle('anim--is-stopped', false);
    setAnimationStyle(el, animParams);

    if (el["--anim"].timeout !== undefined) {
        clearTimeout(el["--anim"].timeout);
    }

    el['--anim'].timeout = setTimeout(() => {
        afterAnimation(el);
    }, animTotalDurationMs);
}

export function updateAnimations(els: HTMLElement[]) {
    const wndRect = getWindowGlobalRect();

    for (const el of els) {
        if (!isElementVisible(el) || isAnimPlaying(el) || isAnimStopped(el)) continue;

        const animParams = pickAnimParams(el);

        if (isAnimatedElement(el)) {
            if (isGlobalRectInViewport(el["--anim"].initialRect)) {
                if (animParams.irate && animParams.irate > intersectionRate(el["--anim"].initialRect, wndRect)) {
                    continue;
                }
                runAnimation(el, animParams);
                continue;
            }
        }

        if (isElementInViewport(el)) {
            prepareAnimation(el, animParams);
            if (animParams.irate && animParams.irate > intersectionRate(el["--anim"].initialRect, wndRect)) {
                continue;
            }
            runAnimation(el, animParams);
        } else if (!isAnimWaiting(el)) {
            prepareAnimation(el, animParams);
        }
    }
}

export function initAnimations() {
    let animatedElements: HTMLElement[] = [];
    
    $all('[--anim]').forEach(el => {
        animatedElements.push(el);
    });

    let updateTimeout: any;
    let updateInterval: any;

    function afterUpdateTimeout() {
        updateAnimations(animatedElements);
        clearTimeout(updateTimeout);
        clearInterval(updateInterval);
        updateTimeout = undefined;
        updateInterval = undefined;
    }

    function afterUpdateIntervalFrame() {
        updateAnimations(animatedElements);
    }

    function afterUpdateInterval() {
        requestAnimationFrame(afterUpdateIntervalFrame);
    }

    function emitUpdate() {
        if (updateTimeout) clearTimeout(updateTimeout);
        updateTimeout = setTimeout(afterUpdateTimeout, 50);

        if (!updateInterval) {
            updateInterval = setInterval(afterUpdateInterval, 50);
        }
    }

    window.addEventListener('scroll', emitUpdate);
    window.addEventListener('resize', emitUpdate);

    emitUpdate();

    const incrementalUpdateElements = setInterval(() => {
        $all('[--anim]').forEach(el => {
            if (animatedElements.indexOf(el) === -1) {
                animatedElements.push(el);
            }
        });
        afterUpdateIntervalFrame();
    }, 100);

    window.addEventListener('load', () => {
        clearInterval(incrementalUpdateElements);
    })

    // AWESOME MOBILE BORWSERS THANKS A LOT

    const MOBILE_UPDATE_TIMEOUT = 100;
    let mobileLastUpdate = 0;

    function mobileUpdate() {
        const now = Date.now();
        if (mobileLastUpdate + MOBILE_UPDATE_TIMEOUT > now) {
            mobileLastUpdate = now;
        } else {
            afterUpdateIntervalFrame();
        }
        requestAnimationFrame(mobileUpdate);
    }
    
    if (mobileAndTabletCheck) {
        mobileUpdate();
    }
}

function mobileAndTabletCheck() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||(window as any).opera);
    return check;
};